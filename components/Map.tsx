import Image from 'next/image'
import mbxStatic from '@mapbox/mapbox-sdk/services/static'
import styled from 'styled-components'

const Wrapper = styled.div`
    border-radius: 1rem;
    overflow: hidden;
    & > div {
        width: 100% !important;
    }
`

const Map: React.FunctionComponent = () => {
    const staticService = mbxStatic({
        accessToken:
            'pk.eyJ1IjoiemVla3JleSIsImEiOiJja2gwaHViYXQxZHo1MnlyMWdwbjZ3aHIxIn0.iBfBScdw9fEpd_-7-MhtEA',
    })

    const request = staticService.getStaticImage({
        ownerId: 'mapbox',
        styleId: 'streets-v11',
        width: 800,
        height: 500,
        position: {
            coordinates: [12, 13],
            zoom: 4,
        },
    })
    const staticImageUrl = request.url()
    // Now you can open staticImageUrl in a browser.
    return (
        <Wrapper>
            <Image
                src={staticImageUrl}
                width={800}
                height={500}
                alt="mapbox"
                loading="eager"
            />
        </Wrapper>
    )
}

export { Map }
