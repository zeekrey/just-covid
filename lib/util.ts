export const THRESHOLD = [
    {
        from: 0,
        to: 15,
        emoji: '🕺',
        color: 'linear-gradient(90deg, #43C6AC 0%, #F8FFAE 100%)',
        fallbackImage: '/emojis/man-dancing_1f57a.png',
    },
    {
        from: 15,
        to: 35,
        emoji: '😷',
        color: 'linear-gradient(90deg, #DCE35B 0%, #45B649 100%)',
        fallbackImage: '/emojis/face-with-medical-mask_1f637.png',
    },
    {
        from: 35,
        to: 50,
        emoji: '🤒',
        color: 'linear-gradient(90deg, #F09819 0%, #EDDE5D 100%)',
        fallbackImage: '/emojis/face-with-thermometer_1f912.png',
    },
    {
        from: 50,
        to: 999,
        emoji: '🧟‍♀️',
        color: 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)',
        fallbackImage: '/emojis/woman-zombie_1f9df-200d-2640-fe0f.png',
    },
]

const determineInfectionLevel = (
    value: number
): { emoji: string; color: string; fallbackImage: string } => {
    const findLevel = THRESHOLD.map((el) =>
        value >= el.from && value < el.to ? 1 : 0
    )
    return {
        emoji: THRESHOLD[findLevel.indexOf(1)].emoji,
        color: THRESHOLD[findLevel.indexOf(1)].color,
        fallbackImage: THRESHOLD[findLevel.indexOf(1)].fallbackImage,
    }
}

const tidyUpName = (name: string, kind: string): string =>
    kind === 'Landkreis' ? `${name} (Landkreis)` : name

export { tidyUpName, determineInfectionLevel }
