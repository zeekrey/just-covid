import styled from 'styled-components'
import mbxStatic from '@mapbox/mapbox-sdk/services/static'

const Wrapper = styled.div`
    border-radius: 1rem;
    overflow: hidden;
    & img {
        width: 100% !important;
    }
`

const getMapboxStaticImage = ({
    width,
    height,
    coords = [10, 10],
}: {
    width: number
    height: number
    coords: [number, number]
}): string => {
    const staticService = mbxStatic({
        accessToken:
            'pk.eyJ1IjoiemVla3JleSIsImEiOiJja2gwaHViYXQxZHo1MnlyMWdwbjZ3aHIxIn0.iBfBScdw9fEpd_-7-MhtEA',
    })

    const request = staticService.getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v11',
        width: width,
        height: height,
        position: {
            coordinates: coords,
            zoom: 11,
        },
    })
    return request.url()
}

const Map: React.FunctionComponent<{ coords: [number, number] }> = ({
    coords,
}) => {
    return (
        <Wrapper>
            <picture>
                {/* Small devices (landscape phones, 576px and up) */}
                <source
                    media="(max-width: 576px)"
                    srcSet={getMapboxStaticImage({
                        coords: coords,
                        width: 400,
                        height: 350,
                    })}
                />
                {/* Extra large devices (large desktops, 1200px and up) */}
                <source
                    media="(min-width: 1200px)"
                    srcSet={getMapboxStaticImage({
                        coords: coords,
                        width: 1280,
                        height: 380,
                    })}
                />
                {/* Large devices (desktops, 992px and up) */}
                <source
                    media="(min-width: 992px)"
                    srcSet={getMapboxStaticImage({
                        coords: coords,
                        width: 400,
                        height: 150,
                    })}
                />
                {/* Medium devices (tablets, 768px and up) */}
                <source
                    media="(min-width: 577px)"
                    srcSet={getMapboxStaticImage({
                        coords: coords,
                        width: 400,
                        height: 225,
                    })}
                />
                {/* default */}
                <img
                    src={getMapboxStaticImage({
                        coords: coords,
                        width: 1280,
                        height: 432,
                    })}
                    alt="City Map"
                />
            </picture>
        </Wrapper>
    )
}

export { Map }
