import React from 'react'
import styled from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
import { tidyUpName, determineInfectionLevel, THRESHOLD } from '../lib/util'
import { Map } from '../components/Map'
import { Truck, GitHub, Twitter } from 'react-feather'

import type { RKIData } from '../types/types'

const Wrapper = styled.div`
    text-align: center;
    padding: 1rem;
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
        fallback: false,
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

    const coords: [number, number] = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoiemVla3JleSIsImEiOiJja2gwaHViYXQxZHo1MnlyMWdwbjZ3aHIxIn0.iBfBScdw9fEpd_-7-MhtEA&cachebuster=1604503361294&autocomplete=false&country=de&types=place&limit=1`
    )
        .then((res) => res.json())
        .then((res) => res.features[0].geometry.coordinates)

    const data: RKIData = await fetch(url)
        .then((res) => res.json())
        .then((data) => ({ ...data.features[0].attributes, coords: coords }))

    return { props: { data } }
}

const DateComponent = styled.div`
    margin: 1rem 0;
    color: lightgray;
`

const Links = styled.div`
    margin: 2rem 0;

    & > a {
        margin: 0 1rem;
        color: lightgray;
    }
`

const Footer = styled.footer`
    text-align: center;
    color: lightgray;
    font-size: 0.8rem;
`

const Why = styled.div`
    font-size: 0.9rem;
    margin-top: 4rem;
    margin-left: auto;
    margin-right: auto;
    width: 90%;

    @media (min-width: 576px) {
        width: 80%;
        margin-top: 6rem;
    }

    @media (min-width: 992px) {
        width: 65%;
    }
`

const MapContainer = styled.div`
    width: calc(100%-1rem);
    padding: 1rem;
    @media (min-width: 576px) {
        padding: 1.5rem;
    }

    @media (min-width: 768px) {
        padding: 2rem;
    }

    @media (min-width: 992px) {
        padding: 2.5rem;
    }

    @media (min-width: 1200px) {
        padding: 3rem;
    }
`

// const ThresholdItem = styled.span`
//     margin-right: 0.8rem;
//     &:last-child {
//         margin-right: 0;
//     }
// `

const City: React.FunctionComponent<{ data: RKIData }> = ({ data }) => {
    const {
        // cases,
        // cases_per_100k,
        // cases_per_population,
        cases7_per_100k,
        // cases7_bl_per_100k,
        last_update,
        coords,
    } = data

    return (
        <>
            <MapContainer>
                <Map coords={coords} />
            </MapContainer>
            <Indicator emoji={determineInfectionLevel(cases7_per_100k).emoji} />
            <Wrapper>
                <h2>{tidyUpName(data.GEN, data.BEZ)}</h2>
                <h1>{data.cases7_per_100k.toFixed(2)}</h1>
                <DateComponent>7-Tage-Inzidenz</DateComponent>
                <Why>
                    Für alle die, die sich weniger 📈 und mehr 🥳 zur
                    Beschreibung der aktuelle Lage wünschen. Bleibt gesund. 💌
                    {/* <br />
                    <p>
                        {THRESHOLD.map((el) => (
                            <ThresholdItem>
                                {el.from} → {el.to} = {el.emoji}
                            </ThresholdItem>
                        ))}
                    </p> */}
                </Why>
                <Links>
                    <a href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0">
                        <Truck />
                    </a>
                    <a href="https://twitter.com/zeekrey_">
                        <Twitter />
                    </a>
                    <a href="https://github.com/zeekrey/just-covid">
                        <GitHub />
                    </a>
                </Links>
                <Footer>Daten vom {last_update}</Footer>
            </Wrapper>
        </>
    )
}

export default City
