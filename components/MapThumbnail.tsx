import styled from 'styled-components'
import { getMapboxStaticImageUrl } from '../lib/getMapboxStaticImageUrl'

const Wrapper = styled.div`
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    & img {
        width: 100% !important;
    }

    & picture {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
`

const MapThumbnail: React.FunctionComponent<{ coords: [number, number] }> = ({
    coords,
}) => {
    return (
        <Wrapper>
            <div
                style={{
                    paddingTop: `${100.0 / 1}%`,
                    backgroundColor: 'lightgray',
                    // backgroundImage: `url(${getMapboxStaticImage({
                    //     coords: coords,
                    //     width: 15,
                    //     height: 15,
                    // })})`,
                    // backgroundSize: 'cover',
                    // filter: 'blur(3px)',
                }}
            ></div>
            <picture>
                {/* Small devices (landscape phones, 576px and up) */}
                <source
                    media="(max-width: 576px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 300,
                        height: 300,
                    })}
                />
                {/* Extra large devices (large desktops, 1200px and up) */}
                <source
                    media="(min-width: 1200px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 400,
                        height: 400,
                    })}
                />
                {/* Large devices (desktops, 992px and up) */}
                <source
                    media="(min-width: 992px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 350,
                        height: 350,
                    })}
                />
                {/* Medium devices (tablets, 768px and up) */}
                <source
                    media="(min-width: 577px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 300,
                        height: 300,
                    })}
                />
                {/* default */}
                <img
                    src={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 400,
                        height: 400,
                    })}
                    alt="City Map"
                    loading="lazy"
                />
            </picture>
        </Wrapper>
    )
}

export { MapThumbnail }
