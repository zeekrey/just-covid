import React from 'react'
import styled from 'styled-components'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import type { RKIData } from '../types/types'
import { tidyUpName, determineInfectionLevel } from '../lib/util'

const Title = styled.h1`
    color: red;
    font-size: 50px;
`

export const getStaticProps: GetStaticProps = async () => {
    /**
     * Fetch data from all cities.
     */
    const data = await fetch(
        'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json'
    )
        .then((res) => res.json())
        .then((data) => data.features)

    const _data = await Promise.all(
        data.map(async (el) =>
            fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    el.attributes.GEN
                )}.json?access_token=pk.eyJ1IjoiemVla3JleSIsImEiOiJja2gwaHViYXQxZHo1MnlyMWdwbjZ3aHIxIn0.iBfBScdw9fEpd_-7-MhtEA&cachebuster=1604503361294&autocomplete=false&country=de&types=place&limit=1`
            )
                .then((res) => res.json())
                .then((res) => ({
                    ...el,
                    coords: res.features[0].geometry.coordinates,
                }))
                .catch((err) => console.log(err))
        )
    )

    return { props: { _data } }
}

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 10px;

    // Medium devices (tablets, 768px and up)
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px 10px;
    }

    // Large devices (desktops, 992px and up)
    @media (min-width: 992px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 10px 10px;
    }

    // Extra large devices (large desktops, 1200px and up)
    @media (min-width: 1200px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 10px 10px;
    }
`

const CityWrapper = styled.div<{ color: string }>`
    padding: 4rem;
    border-radius: 1rem;
    background: ${(props) => props.color};
`

const City = ({ city }: { city: RKIData }) => {
    return (
        <Link
            href={encodeURIComponent(
                tidyUpName(city.GEN, city.BEZ).toLowerCase()
            )}
        >
            <a>
                <CityWrapper
                    color={determineInfectionLevel(city.cases7_per_100k).color}
                >
                    {city.GEN}
                    {determineInfectionLevel(city.cases7_per_100k).emoji}
                </CityWrapper>
            </a>
        </Link>
    )
}

const Home = ({ data }: { data: { attributes: RKIData }[] }) => {
    React.useEffect(() => {
        console.log(data)
    }, [])
    return (
        <>
            <Title>My page</Title>
            <Grid>
                {data.map((city) => (
                    <City city={city.attributes} key={city.attributes.GEN} />
                ))}
            </Grid>
        </>
    )
}

export default Home
