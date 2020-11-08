import mbxStatic from '@mapbox/mapbox-sdk/services/static'

const getMapboxStaticImageUrl = ({
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

export { getMapboxStaticImageUrl }
