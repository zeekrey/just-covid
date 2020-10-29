import React from 'react'
import styled, { keyframes } from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

type RKIData = {
    GEN: string
    BEZ: string
    death_rate: number
    cases: number
    deaths: number
    cases_per_100k: number
    cases_per_population: number
    BL: string
    BL_ID: string
    county: string
    last_update: string
    cases7_per_100k: number
    recovered: number | null
    EWZ_BL: number
    cases7_bl_per_100k: number
}

const Container = styled.div<{ inzidenz: number }>`
    width: 100vw;
    height: 100vh;
    background: ${({ inzidenz }) =>
        inzidenz < 20
            ? 'linear-gradient(90deg, #DCE35B 0%, #45B649 100%)'
            : inzidenz < 50
            ? 'linear-gradient(90deg, #F09819 0%, #EDDE5D 100%)'
            : 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)'};
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

const SelectContainer = styled.div`
    padding: 8% 10%;
`

const Select = styled.select`
    cursor: pointer;
    width: 100%;
    appearance: none;
    border: none;
    outline: none;
    background-color: inherit;
    border: none;
    color: white;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-display: auto;
    padding: 1rem 2rem;
    margin: 0;
    text-align: center;
    font-size: 4rem;
    option {
        font-size: 1rem;
        color: black;
    }
`

const tidyUpName = (name: string, kind: string): string =>
    kind === 'Landkreis' ? `${name} (Landkreis)` : name

const sortAlphabetically = (list: { name: string }[]): { name: string }[] => {
    return list.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}

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
    const router = useRouter()
    const [listOfCities, setListOfCities] = React.useState<{ name: string }[]>(
        []
    )
    const [selectedCity, setSelectedCity] = React.useState(
        tidyUpName(data.GEN, data.BEZ)
    )

    const {
        // cases,
        // cases_per_100k,
        // cases_per_population,
        cases7_per_100k,
        // cases7_bl_per_100k,
        // last_update,
    } = data

    React.useEffect(() => {
        fetch(
            'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ&outSR=4326&f=json'
        )
            .then((res) => res.json())
            .then(
                (res: {
                    features: { attributes: { GEN: string; BEZ: string } }[]
                }) => {
                    setListOfCities(
                        sortAlphabetically(
                            res.features.map((el) => ({
                                name: tidyUpName(
                                    el.attributes.GEN,
                                    el.attributes.BEZ
                                ),
                            }))
                        )
                    )
                }
            )
            .then(() => console.log(listOfCities))
    }, [])

    console.log(data.cases7_per_100k)
    console.log(
        data.cases7_per_100k < 20
            ? 'green'
            : data.cases7_per_100k < 50
            ? 'yellow'
            : 'red'
    )

    return (
        <>
            <Container inzidenz={data.cases7_per_100k}>
                <SelectContainer>
                    {listOfCities.length && (
                        <Select
                            value={selectedCity}
                            onChange={(event) => {
                                console.log(event.target.value)
                                setSelectedCity(event.target.value)
                                router.push(
                                    `/${event.target.value.toLocaleLowerCase()}`
                                )
                            }}
                        >
                            {listOfCities.map(({ name }) => (
                                <option value={name}>{name}</option>
                            ))}
                        </Select>
                    )}
                </SelectContainer>
                <Stage>
                    <BigBlob>
                        <small>7 Tage Inzidenz</small>
                        <h2>{Math.round(cases7_per_100k)}</h2>
                    </BigBlob>
                    <SmallBlob>🧟‍♀️</SmallBlob>
                </Stage>
            </Container>
        </>
    )
}

export default City
