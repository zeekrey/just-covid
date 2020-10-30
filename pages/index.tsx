import React from 'react'
import styled from 'styled-components'
import { GetStaticProps } from 'next'
import type { RKIData } from '../types/types'

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
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px 10px;
`

const CityWrapper = styled.div<{ inzidenz: number }>`
    padding: 4rem;
    border-radius: 1rem;
    background: ${({ inzidenz }) =>
        inzidenz < 20
            ? 'linear-gradient(90deg, #DCE35B 0%, #45B649 100%)'
            : inzidenz < 50
            ? 'linear-gradient(90deg, #F09819 0%, #EDDE5D 100%)'
            : 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)'};
`

const City = ({ city }: { city: { attributes: RKIData } }) => {
    return (
        <CityWrapper inzidenz={city.attributes.cases7_per_100k}>
            {city.attributes.GEN}
        </CityWrapper>
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
                <City city={data[0]} />
            </Grid>
        </>
    )
}

export default Home
