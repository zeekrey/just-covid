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

const Placeholder = styled.div`
    background-color: lightgray;

    @media (max-width: 576px) {
        padding-top: ${() => 100.0 / (400 / 350)}%;
    }

    @media (min-width: 1200px) {
        padding-top: ${() => 100.0 / (1280 / 380)}%;
    }

    @media (min-width: 992px) and (max-width: 1199px) {
        padding-top: ${() => 100.0 / (400 / 150)}%;
    }

    @media (min-width: 577px) and (max-width: 991px) {
        padding-top: ${() => 100.0 / (400 / 225)}%;
    }
`

const Map: React.FunctionComponent<{ coords: [number, number] }> = ({
    coords,
}) => {
    return (
        <Wrapper>
            <Placeholder />
            <picture>
                {/* Small devices (landscape phones, 576px and up) */}
                <source
                    media="(max-width: 576px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 400,
                        height: 350,
                    })}
                />
                {/* Extra large devices (large desktops, 1200px and up) */}
                <source
                    media="(min-width: 1200px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 1280,
                        height: 380,
                    })}
                />
                {/* Large devices (desktops, 992px and up) */}
                <source
                    media="(min-width: 992px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 720,
                        height: 270,
                    })}
                />
                {/* Medium devices (tablets, 768px and up) */}
                <source
                    media="(min-width: 577px)"
                    srcSet={getMapboxStaticImageUrl({
                        coords: coords,
                        width: 560,
                        height: 315,
                    })}
                />
                {/* default */}
                <img
                    src={getMapboxStaticImageUrl({
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
