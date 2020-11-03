import * as React from 'react'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { scaleTime, scaleLinear } from '@vx/scale'
import { extent } from 'd3-array'

// scales
const timeScale = scaleTime<number>({
    domain: [
        Math.min(...cityTemperature.map(date)),
        Math.max(...cityTemperature.map(date)),
    ],
})
const temperatureScale = scaleLinear<number>({
    domain: [
        Math.min(...cityTemperature.map((d) => Math.min(ny(d), sf(d)))),
        Math.max(...cityTemperature.map((d) => Math.max(ny(d), sf(d)))),
    ],
    nice: true,
})

const Graph: React.FunctionComponent = () => {
    return (
        <>
            <AxisBottom
                top={yMax}
                scale={timeScale}
                numTicks={width > 520 ? 10 : 5}
            />
            <AxisLeft scale={temperatureScale} />
        </>
    )
}

export { Graph }
