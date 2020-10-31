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
    const data: RKIData = await fetch(
        'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json'
    )
        .then((res) => res.json())
        .then((data) => data.features)

    console.log(data)

    // ---
    // const { params } = ctx as {
    // params: { city: string }
    // }

    // const isLandkreis =
    //     params.city.substring(params.city.length - '(landkreis)'.length) ===
    //     '(landkreis)'

    // const city = encodeURIComponent(
    //     isLandkreis
    //         ? params.city?.slice(0, params.city.length - ' (landkreis)'.length)
    //         : params.city
    // ).toUpperCase()

    // const url = `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=GEN%20%3D%20'${city}'${
    //     isLandkreis ? `%20AND%20BEZ%20%3D%20'LANDKREIS'` : ''
    // }&outFields=GEN,BEZ,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json`

    // const data: RKIData = await fetch(url)
    //     .then((res) => res.json())
    //     .then(({ features }) => {
    //         console.log(features)
    //         return features[0].attributes
    //     })

    return { props: { data } }
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
