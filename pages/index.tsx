import React from 'react'
import styled from 'styled-components'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { tidyUpName, determineInfectionLevel } from '../lib/util'
import { cities } from '../data/citycoordinates'
import { Truck, GitHub, Twitter } from 'react-feather'
import { MapThumbnail } from '../components/MapThumbnail'
import { NextSeo } from 'next-seo'

import type { RKIData } from '../types/types'

export const getStaticProps: GetStaticProps = async () => {
    /**
     * Fetch data from all cities.
     */

    const data: RKIData = await fetch(
        'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json'
    )
        .then((res) => res.json())
        .then(({ features }) => {
            return features.map((city: { attributes: { GEN: string } }) => {
                const coords = cities.filter(
                    ({ name }) => name === city.attributes.GEN
                )
                return {
                    ...city.attributes,
                    coords: [coords[0].coords.lng, coords[0].coords.lat],
                }
            })
        })

    return { props: { data } }
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 10px;
    padding: 1rem;

    // Medium devices (tablets, 768px and up)
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 14px 14px;
        padding: 2rem;
    }

    // Large devices (desktops, 992px and up)
    @media (min-width: 992px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 20px 20px;
    }

    // Extra large devices (large desktops, 1200px and up)
    @media (min-width: 1200px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 25px 25px;
    }
`

const InnerWrapper = styled.div`
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    & span {
        margin-top: 1rem;
        color: black;
        font-size: 1.4rem;
        font-weight: 600;
        text-align: center;
        word-break: break-word;
    }
`

const CityContainer = styled.div`
    position: relative;
    border-radius: 1rem;
    &:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04),
            0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    }
`

const Circle = styled.div`
    border-radius: 99rem;
    width: 4rem;
    height: 4rem;
    background: #ffffff91;
    box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04),
        0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
        0px 0px 1px rgba(0, 0, 0, 0.04);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 6%;
    bottom: 6%;
    border: 3px solid white;

    & > div {
        font-size: 1.8rem;
    }

    @media (min-width: 768px) {
        & > div {
            font-size: 2rem;
        }
        width: 4.6rem;
        height: 4.6rem;
    }
`

const City = ({ city }: { city: RKIData }) => {
    return (
        <Link
            href={encodeURIComponent(
                tidyUpName(city.GEN, city.BEZ).toLowerCase()
            )}
        >
            <a>
                <CityContainer>
                    <InnerWrapper>
                        <span>{tidyUpName(city.GEN, city.BEZ)}</span>
                        <Circle>
                            <div>
                                {
                                    determineInfectionLevel(
                                        city.cases7_per_100k
                                    ).emoji
                                }
                            </div>
                        </Circle>
                    </InnerWrapper>
                    <MapThumbnail coords={city.coords} />
                </CityContainer>
            </a>
        </Link>
    )
}

const Links = styled.div`
    text-align: center;
    margin: 2rem 0;

    & > a {
        margin: 0 1rem;
        color: #757575;
    }
`

const Why = styled.div`
    font-size: 0.9rem;
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    width: 90%;

    @media (min-width: 576px) {
        width: 80%;
        margin-top: 6rem;
    }

    @media (min-width: 992px) {
        width: 65%;
    }
`
const Wrapper = styled.div`
    text-align: center;
    padding: 1rem;
    padding-top: 15%;
`

const Select = styled.select`
    padding: 0.4rem;
    max-width: 100%;
    margin-top: 1rem;
    border: 1px solid lightgray;
    border-radius: 0.2rem;

    &:hover {
        cursor: pointer;
    }
`

const Label = styled.label`
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #757575;
    display: block;
`

const Home: React.FunctionComponent<{ data: RKIData[] }> = ({ data }) => {
    const [selectedCity, setSelectedCity] = React.useState('')
    const [cities, setCities] = React.useState(data)

    React.useEffect(() => {
        if (selectedCity.length)
            setCities(
                data.filter((el) => tidyUpName(el.GEN, el.BEZ) === selectedCity)
            )
        // console.log(tidyUpName(el.GEN, el.BEZ))
        console.log(selectedCity)
    }, [selectedCity])

    return (
        <>
            <NextSeo
                title="Just Covid"
                description="Für alle die, die sich weniger 📈 und mehr 🥳 zur
                Beschreibung der aktuelle Lage wünschen. Bleibt gesund. 💌"
                canonical="https://covid.krey.io/"
            />
            <Wrapper>
                <h1>Just C😲vid</h1>
                <Why>
                    Für alle die, die sich weniger 📈 und mehr 🐵 zur
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
                <Label htmlFor="select">Wähle eine Stadt aus: </Label>
                <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    id="select"
                >
                    {data.map((el) => (
                        <option
                            value={tidyUpName(el.GEN, el.BEZ)}
                            key={tidyUpName(el.GEN, el.BEZ)}
                        >
                            {tidyUpName(el.GEN, el.BEZ)}
                        </option>
                    ))}
                </Select>
            </Wrapper>
            <Grid>
                {cities.map((city) => (
                    <City city={city} key={tidyUpName(city.GEN, city.BEZ)} />
                ))}
            </Grid>

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
        </>
    )
}

export default Home
