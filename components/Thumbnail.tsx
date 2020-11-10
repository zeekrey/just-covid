import { getMapboxStaticImageUrl } from '../lib/getMapboxStaticImageUrl'
import { determineInfectionLevel } from '../lib/util'

const Thumbnail: React.FunctionComponent<{
    coords: [number, number]
    inzidenz: number
    size: { width: number; height: number }
}> = ({
    coords = [10, 10],
    inzidenz = 0,
    size = { width: 400, height: 400 },
}) => (
    // Should be the viewport
    <div style={{ ...size, position: 'relative' }}>
        <img
            src={getMapboxStaticImageUrl({
                ...size,
                coords: coords,
            })}
            style={{ position: 'absolute' }}
        />

        <div
            style={{
                position: 'absolute',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    borderRadius: '99rem',
                    width: '32%',
                    height: '32%',
                    background: '#ffffff',
                    boxShadow:
                        '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={determineInfectionLevel(inzidenz).fallbackImageDataUri}
                    alt={determineInfectionLevel(inzidenz).emoji}
                    width="125px"
                />
                <div
                    style={{
                        fontSize: '1rem',
                        color: 'lightgray',
                        margin: '1.5rem 0',
                    }}
                >
                    {' '}
                    7-Tage-Inzidenz
                </div>
                <div
                    style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                    }}
                >
                    {inzidenz.toFixed(2)}
                </div>
            </div>
        </div>
    </div>
)

export { Thumbnail }
