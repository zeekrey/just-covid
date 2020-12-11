import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    background-color: #ef6467;
    padding: 1rem 2rem;
    color: white;
    text-align: center;
`

const Banner: React.FunctionComponent = () => (
    <Wrapper>
        👷‍♂️👷‍♀️ <br /> Die letzte Aktualisierung ist vom 11.12.2020. Diese Seite
        wird nicht mehr aktualisiert.
    </Wrapper>
)

export { Banner }
