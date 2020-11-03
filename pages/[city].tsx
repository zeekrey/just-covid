import React from 'react'
import styled, { keyframes } from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
// import GithubCorner from 'react-github-corner'
import type { RKIData } from '../types/types'
import { tidyUpName, determineInfectionLevel } from '../lib/util'
import { Map } from '../components/Map'

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

const Wrapper = styled.div`
    text-align: center;
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

const Circle = styled.div`
    border-radius: 99rem;
    width: 8rem;
    height: 8rem;
    background: #ffffff;
    box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04),
        0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
        0px 0px 1px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
        font-size: 2.1rem;
    }
`

const IndicatorWrapper = styled.div`
    position: absolute;
    z-index: 2;
    display: flex;
    justify-content: center;
    margin-top: -6rem;
    width: 100%;
`

const Indicator: React.FunctionComponent<{ emoji: string }> = ({ emoji }) => {
    return (
        <IndicatorWrapper>
            <Circle>
                <div>{emoji}</div>
            </Circle>
        </IndicatorWrapper>
    )
}

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
        .then(({ features }) => features[0].attributes)

    return { props: { data } }
}

const DateComponent = styled.div`
    margin: 1rem 0;
    color: lightgray;
`

const City: React.FunctionComponent<{ data: RKIData }> = ({ data }) => {
    const {
        // cases,
        // cases_per_100k,
        // cases_per_population,
        cases7_per_100k,
        // cases7_bl_per_100k,
        last_update,
    } = data

    return (
        <>
            {/* <GithubCorner
                href="https://github.com/zeekrey/just-covid"
                octoColor="#c42a3c"
                bannerColor="white"
            /> */}
            <div
                style={{
                    width: 'calc(100%-1rem)',
                    padding: '1rem',
                }}
            >
                <Map />
            </div>
            <Indicator emoji={determineInfectionLevel(cases7_per_100k).emoji} />
            <Wrapper>
                <h1>{tidyUpName(data.GEN, data.BEZ)}</h1>
                <h2>{data.cases7_per_100k.toFixed(2)}</h2>
                <div>7-Tage-Inzidenz</div>
                <DateComponent>Vom {last_update}</DateComponent>
                <div>
                    Für alle die, die sich weniger 📈 und mehr 🥳 zur
                    Beschreibung der aktuelle Lage wünschen. Bleibt gesund. 💌
                </div>
                <div>
                    <a href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0">
                        ℹ️
                    </a>
                    <a href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0">
                        🦉
                    </a>
                    <a href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0">
                        😽
                    </a>
                </div>
                <div>
                    <div>Twitter</div>
                    <div>Github</div>
                </div>
                <div>Impressum // Christian Krey, covid@krey.io</div>
            </Wrapper>
        </>
    )
}

export default City
