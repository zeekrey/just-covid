import React from 'react'
import styled, { keyframes } from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
import GithubCorner from 'react-github-corner'
import type { RKIData } from '../types/types'
import { tidyUpName, determineInfectionLevel } from '../lib/util'

const Container = styled.div<{ inzidenz: number }>`
    width: 100vw;
    min-height: 100vh;
    height: 100%;
    background: ${({ inzidenz }) =>
        inzidenz < 20
            ? 'linear-gradient(90deg, #DCE35B 0%, #45B649 100%)'
            : inzidenz < 50
            ? 'linear-gradient(90deg, #F09819 0%, #EDDE5D 100%)'
            : 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)'};

    h1 {
        font-size: 4rem;
        color: white;
        text-align: center;
        padding-top: 10%;
        margin: 0;
        text-transform: uppercase;
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 700;
    }

    small {
        display: block;
        text-align: center;
        color: white;
    }
`

const Hint = styled.p`
    color: white;
    padding: 0 10%;
    margin-top: 15%;
    font-size: 1.5rem;
`

const blobKeyframes = keyframes`
    0% {
              border-radius:  60% 40% 30% 70% / 60% 30% 70% 40%;
              background: white;
      } 
      
      50% {
              border-radius:  30% 60% 70% 40% / 50% 60% 30% 60%;
              background: white;
      }
    
      100% {
          border-radius:  60% 40% 30% 70% / 60% 30% 70% 40%;
          background: white;
      } 
  `

const Wave = styled.div`
    width: 100vw;
    margin-top: -12%;
`

const Boxes = styled.div`
    display: flex;
    margin-bottom: 4rem;
    padding: 0 2rem;
`

const BigBlob = styled.div`
    background: white;
    animation: ${blobKeyframes} 8s ease-in-out infinite;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    height: 400px;
    transition: all 1s ease-in-out;
    width: 400px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    place-content: center;
    align-items: center;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    box-shadow: 0px 19.0056px 25.3408px rgba(0, 0, 0, 0.04),
        0px 12.6704px 19.0056px rgba(0, 0, 0, 0.04),
        0px 3.1676px 6.33521px rgba(0, 0, 0, 0.04),
        0px 0px 0.791901px rgba(0, 0, 0, 0.04);

    small {
        font-size: 1rem;
        color: black;
    }

    h2 {
        font-size: 8rem;
        margin: 0;
    }
`

const SmallBlob = styled.div`
    background: white;
    animation: ${blobKeyframes} 8s ease-in-out infinite;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    height: 150px;
    transition: all 1s ease-in-out;
    width: 150px;
    z-index: 5;
    display: flex;
    place-content: center;
    align-items: center;
    font-size: 2rem;
    right: 28%;
    top: 78%;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    position: absolute;
    box-shadow: 0px 19.0056px 25.3408px rgba(0, 0, 0, 0.04),
        0px 12.6704px 19.0056px rgba(0, 0, 0, 0.04),
        0px 3.1676px 6.33521px rgba(0, 0, 0, 0.04),
        0px 0px 0.791901px rgba(0, 0, 0, 0.04);
`

const Stage = styled.main`
    display: flex;
    place-content: center;
    padding-top: 10%;
    position: relative;
`

const Button = styled.button`
    padding: 1.4rem 6.5rem;
    border: 2px solid #ffffff;
    box-sizing: border-box;
    border-radius: 8px;
    color: white;
    background: none;
    text-transform: uppercase;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 1.5rem;
    cursor: pointer;
    &:focus {
        outline: none;
    }
`

const Box = styled.div`
    padding: 1rem;
    flex: 1;
    text-align: center;

    div {
        font-size: 2rem;
    }

    h3 {
        font-size: 1.4rem;
    }

    p {
        letter-spacing: 0.05rem;
        line-height: 1.4rem;
    }
`

// const sortAlphabetically = (list: { name: string }[]): { name: string }[] => {
//     return list.sort((a, b) => {
//         if (a.name < b.name) {
//             return -1
//         }
//         if (a.name > b.name) {
//             return 1
//         }
//         return 0
//     })
// }

export const getStaticPaths: GetStaticPaths = async () => {
    const cities = await fetch(
        'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json'
    )
        .then((res) => res.json())
        .then(
            (data: {
                features: { attributes: { GEN: string; BEZ: string } }[]
            }) =>
                data.features.map((el) => ({
                    params: {
                        city: encodeURIComponent(
                            tidyUpName(
                                el.attributes.GEN,
                                el.attributes.BEZ
                            ).toLowerCase()
                        ),
                    },
                }))
        )

    console.log(cities)

    return {
        paths: cities,
        fallback: false, // See the "fallback" section below
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { params } = ctx as {
        params: { city: string }
    }

    const isLandkreis =
        params.city.substring(params.city.length - '(landkreis)'.length) ===
        '(landkreis)'

    const city = encodeURIComponent(
        isLandkreis
            ? params.city?.slice(0, params.city.length - ' (landkreis)'.length)
            : params.city
    ).toUpperCase()

    const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=GEN%20%3D%20'${city}'${
        isLandkreis ? `%20AND%20BEZ%20%3D%20'LANDKREIS'` : ''
    }&outFields=GEN,BEZ,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json`

    const data: RKIData = await fetch(url)
        .then((res) => res.json())
        .then(({ features }) => {
            console.log(features)
            return features[0].attributes
        })

    return { props: { data } }
}

/**
 * Nextjs recommends using:
 * function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
 * // will resolve posts to type Post[]
 * }
 * But does not work.
 */

const City = ({ data }: { data: RKIData }) => {
    // const [listOfCities, setListOfCities] = React.useState<{ name: string }[]>(
    //     []
    // )

    const {
        cases,
        cases_per_100k,
        cases_per_population,
        cases7_per_100k,
        cases7_bl_per_100k,
        last_update,
    } = data

    // React.useEffect(() => {
    //     fetch(
    //         'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ&outSR=4326&f=json'
    //     )
    //         .then((res) => res.json())
    //         .then(
    //             (res: {
    //                 features: { attributes: { GEN: string; BEZ: string } }[]
    //             }) => {
    //                 setListOfCities(
    //                     sortAlphabetically(
    //                         res.features.map((el) => ({
    //                             name: tidyUpName(
    //                                 el.attributes.GEN,
    //                                 el.attributes.BEZ
    //                             ),
    //                         }))
    //                     )
    //                 )
    //             }
    //         )
    //         .then(() => console.log(listOfCities))
    // }, [])

    // console.log(data.cases7_per_100k)
    // console.log(
    //     data.cases7_per_100k < 20
    //         ? 'green'
    //         : data.cases7_per_100k < 50
    //         ? 'yellow'
    //         : 'red'
    // )

    return (
        <>
            <GithubCorner
                href="https://github.com/zeekrey/just-covid"
                octoColor="#c42a3c"
                bannerColor="white"
            />
            <Container inzidenz={data.cases7_per_100k}>
                <h1>{tidyUpName(data.GEN, data.BEZ)}</h1>
                <small>Vom: {last_update}</small>
                <Stage>
                    <BigBlob>
                        <small>7 Tage Inzidenz</small>
                        <h2>{Math.round(cases7_per_100k)}</h2>
                    </BigBlob>
                    <SmallBlob>
                        {determineInfectionLevel(cases7_per_100k).emoji}
                    </SmallBlob>
                </Stage>
                <Hint>
                    In {tidyUpName(data.GEN, data.BEZ)} haben sich bisher{' '}
                    <strong>{cases} </strong>Menschen infiziert. Das sind{' '}
                    <strong>{cases_per_population}</strong> der
                    Gesamtbevölkerung in {tidyUpName(data.GEN, data.BEZ)}. Im
                    vergleich mit dem Bundesland hat Leipzig{' '}
                    <strong>{Math.round(cases_per_100k)}</strong> Fälle pro
                    100.000 Einwohner, wobei das Bundesland{' '}
                    <strong>{Math.round(cases7_bl_per_100k)}</strong> Fälle pro
                    100.000 Einwohner hat.
                </Hint>
                <div
                    style={{
                        display: 'flex',
                        placeContent: 'center',
                        margin: '10%',
                    }}
                >
                    <Button>Teilen</Button>
                </div>
            </Container>
            <Wave>
                <svg
                    viewBox="0 0 768 163"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 47.0669L43 59.0669C85 70.0669 171 93.0669 256 78.0669C341 62.0669 427 9.06687 512 1.06687C597 -6.93313 683 32.0669 725 51.0669L768 70.0669V162.067H725C683 162.067 597 162.067 512 162.067C427 162.067 341 162.067 256 162.067C171 162.067 85 162.067 43 162.067H0V47.0669Z"
                        fill="white"
                    />
                </svg>
            </Wave>
            <Boxes>
                <Box>
                    <div>🔍</div>
                    <h3>Quelle</h3>
                    <p>
                        Die Daten stammem vom Robert Koch-Institut (RKI),
                        dl-de/by-2-0 vom <strong>{last_update}</strong>. Die
                        konkrete Quelle kann{' '}
                        <a href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0">
                            hier
                        </a>{' '}
                        eingesehen werden.
                    </p>
                </Box>
                <Box>
                    <div>❓</div>
                    <h3>Wie?</h3>
                    <p>
                        Dies ist ein kleines Projekt für alle die, die sich
                        weniger 📈 und mehr 🥳 zur Beschreibung der aktuelle
                        Lage wünschen. Eine gute Beschreibung der
                        7-Tage-Inzidenz findet ihr{' '}
                        <a href="https://www.zdf.de/nachrichten/panorama/coronavirus-covid19-glossar-100.html">
                            hier
                        </a>{' '}
                        .
                    </p>
                </Box>
                <Box>
                    <div>👋</div>
                    <h3>Hey!</h3>
                    <p>Fragen oder Feedback gerne via Twitter.</p>
                </Box>
            </Boxes>
            <hr />
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div>🧾</div>
                <h4>Impressum</h4>
                <strong>Christian Krey</strong>
                <p>covid@krey.io</p>
            </div>
        </>
    )
}

export default City
