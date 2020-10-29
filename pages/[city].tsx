import React from 'react'
import styled from 'styled-components'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

type Data = {
    author: string
    content: string
}

const Container = styled.div<{ inzidenz: number }>`
    width: 100vw;
    height: 100vh;
    background-color: ${({ inzidenz }) =>
        inzidenz < 20 ? 'green' : inzidenz < 50 ? 'yellow' : 'red'};
`

const Title = styled.h1`
    color: red;
    font-size: 50px;
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

const City: React.FunctionComponent = ({
    data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter()
    const [listOfCities, setListOfCities] = React.useState<{ name: string }[]>(
        []
    )
    const [selectedCity, setSelectedCity] = React.useState(
        tidyUpName(data.GEN, data.BEZ)
    )

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
                            res.features.map((el) =>
                                tidyUpName(el.attributes.GEN, el.attributes.BEZ)
                            )
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
                <Title>{data.GEN}</Title>
                {listOfCities.length && (
                    <select
                        value={selectedCity}
                        onChange={(event) => {
                            console.log(event.target.value)
                            setSelectedCity(event.target.value)
                            router.push(
                                `/${event.target.value.toLocaleLowerCase()}`
                            )
                        }}
                    >
                        {listOfCities.map((el) => (
                            <option value={el}>{el}</option>
                        ))}
                    </select>
                )}
                <div>{JSON.stringify(data)}</div>
            </Container>
        </>
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

    console.log(cities)

    return {
        paths: cities,
        fallback: false, // See the "fallback" section below
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { params } = ctx as { params: { city: string } }
    console.log(params.city)

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

    const data: Data[] = await fetch(url)
        .then((res) => res.json())
        .then(({ features }) => {
            console.log(features)
            return features[0].attributes
        })

    return { props: { data } }
}

export default City
