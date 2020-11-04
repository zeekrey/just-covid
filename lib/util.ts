export const THRESHOLD = [
    {
        from: 0,
        to: 15,
        emoji: '🕺',
        color: 'linear-gradient(90deg, #43C6AC 0%, #F8FFAE 100%)',
    },
    {
        from: 15,
        to: 35,
        emoji: '😷',
        color: 'linear-gradient(90deg, #DCE35B 0%, #45B649 100%)',
    },
    {
        from: 35,
        to: 50,
        emoji: '🤒',
        color: 'linear-gradient(90deg, #F09819 0%, #EDDE5D 100%)',
    },
    {
        from: 50,
        to: 999,
        emoji: '🧟‍♀️',
        color: 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)',
    },
]

const determineInfectionLevel = (value: number) => {
    const findLevel = THRESHOLD.map((el) =>
        value >= el.from && value < el.to ? 1 : 0
    )
    return {
        emoji: THRESHOLD[findLevel.indexOf(1)].emoji,
        color: THRESHOLD[findLevel.indexOf(1)].color,
    }
}

const tidyUpName = (name: string, kind: string): string =>
    kind === 'Landkreis' ? `${name} (Landkreis)` : name

export { tidyUpName, determineInfectionLevel }
