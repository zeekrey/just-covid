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
    if (typeof process.env.NEXT_PUBLIC_MAPBOX === 'undefined')
        throw Error('Please provide a Mapbox token within a .env file.')

    const staticService = mbxStatic({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX || '',
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
