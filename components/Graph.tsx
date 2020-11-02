import * as React from 'react'
import {parse} from 'date-fns'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'

const data = [
    {
        date: '28.10.2020, 00:00 Uhr',
        value: 10,
    },
    {
        date: '29.10.2020, 00:00 Uhr',
        value: 10,
    },
    {
        date: '30.10.2020, 00:00 Uhr',
        value: 10,
    },
    {
        date: '01.11.2020, 00:00 Uhr',
        value: 10,
    },
    {
        date: '02.11.2020, 00:00 Uhr',
        value: 10,
    },
]

const Graph: React.FunctionComponent = () => {
    return (
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" type="number" domain={['dataMin', 'dataMax']}/>
            <YAxis />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
    )
}

export { Graph }
