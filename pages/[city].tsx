import React from 'react'
import styled from 'styled-components'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { tidyUpName, determineInfectionLevel } from '../lib/util'
import { Map } from '../components/Map'
import { Truck, GitHub, Twitter, ArrowLeftCircle } from 'react-feather'
import { NextSeo } from 'next-seo'
import { cities } from '../data/citycoordinates'
import { Thumbnail } from '../components/Thumbnail'
import { imageFromComponent } from '../lib/imageFromComponent'

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

    const data: RKIData = await fetch(
        `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=GEN%20%3D%20'${city}'${
            isLandkreis ? `%20AND%20BEZ%20%3D%20'LANDKREIS'` : ''
        }&outFields=GEN,BEZ,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json`
    )
        .then((res) => res.json())
        .then(({ features }) => {
            const coords = cities.filter(
                ({ name }) => name === features[0].attributes.GEN
            )
            return {
                ...features[0].attributes,
                coords: [coords[0].coords.lng, coords[0].coords.lat],
            }
        })

    /**
     * Create the preview image
     */

    const previewImageSize = { width: 1200, height: 1200 }
    const pathToStoreFile = `./public/images/${encodeURIComponent(
        tidyUpName(data.GEN, data.BEZ).toLowerCase()
    )}.png`

    await imageFromComponent(
        <Thumbnail
            coords={data.coords}
            inzidenz={data.cases7_per_100k}
            size={previewImageSize}
        />,
        previewImageSize,
        pathToStoreFile
    )

    return {
        props: { data },
        // Revalidate the page every 3600seconds => once per hour
        revalidate: 600,
    }
}

const DateComponent = styled.div`
    margin: 1rem 0;
    color: #757575;
`

const Links = styled.div`
    margin: 2rem 0;

    & > a {
        margin: 0 1rem;
        color: #757575;
    }
`

const Footer = styled.footer`
    text-align: center;
    color: #757575;
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

const SeeMoreButton = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1;
    font-size: 0.8rem;
    padding: 1rem 1.4rem;
    background-color: white;
    font-weight: 800;
    color: #757575;
    text-decoration: none;
    border-radius: 0.4rem;
    box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04),
        0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
        0px 0px 1px rgba(0, 0, 0, 0.04);

    top: 2rem;
    left: 2rem;

    & > div {
        display: none;
        @media (min-width: 576px) {
            display: inherit;
        }
    }

    @media (min-width: 576px) {
        top: 3rem;
        left: 3rem;

        & > svg {
            margin-right: 0.8rem;
        }
    }

    @media (min-width: 992px) {
        top: 4rem;
        left: 4rem;
    }
`

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
            <NextSeo
                title="Just Covid"
                description="Für alle die, die sich weniger 📈 und mehr 🥳 zur
                Beschreibung der aktuelle Lage wünschen. Bleibt gesund. 💌"
                canonical={`https://covid.krey.io/${encodeURIComponent(
                    tidyUpName(data.GEN, data.BEZ).toLowerCase()
                )}`}
                twitter={{
                    handle: '@zeekrey_',
                    site: '@zeekrey_',
                    cardType: 'summary_large_image',
                }}
                openGraph={{
                    url: `https://covid.krey.io/${encodeURIComponent(
                        tidyUpName(data.GEN, data.BEZ).toLowerCase()
                    )}`,
                    title: `Just Covid - ${tidyUpName(data.GEN, data.BEZ)}`,
                    description:
                        'Für alle die, die sich weniger 📈 und mehr 🥳 zur Beschreibung der aktuelle Lage wünschen. Bleibt gesund. 💌',
                    images: [
                        {
                            url: `https://covid.krey.io/images/${encodeURIComponent(
                                tidyUpName(data.GEN, data.BEZ).toLowerCase()
                            )}.png`,
                            width: 1200,
                            height: 1200,
                            alt: 'Just covid image',
                        },
                    ],
                    site_name: `Just Covid - ${tidyUpName(data.GEN, data.BEZ)}`,
                }}
            />
            <MapContainer>
                <Link href="/" passHref>
                    <SeeMoreButton aria-label="Andere Stadt">
                        <ArrowLeftCircle size={18} />
                        <div>Andere Stadt</div>
                    </SeeMoreButton>
                </Link>
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
                </Why>
                <Links>
                    <a
                        href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0"
                        aria-label="Quelle"
                        target="_blank"
                        rel="noopener"
                    >
                        <Truck />
                    </a>
                    <a
                        href="https://twitter.com/zeekrey_"
                        aria-label="Twitter"
                        target="_blank"
                        rel="noopener"
                    >
                        <Twitter />
                    </a>
                    <a
                        href="https://github.com/zeekrey/just-covid"
                        aria-label="Github"
                        target="_blank"
                        rel="noopener"
                    >
                        <GitHub />
                    </a>
                </Links>
                <Footer>Daten vom {last_update}</Footer>
            </Wrapper>
            {/* Just for testing purpose.  */}
            {/* <Thumbnail
                coords={coords}
                inzidenz={cases7_per_100k}
                size={{ width: 1200, height: 1200 }}
            /> */}
        </>
    )
}

export default City
