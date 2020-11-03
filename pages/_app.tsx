import type { AppProps } from 'next/app'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'styled-normalize'

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  /* montserrat-regular - latin */
  @font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-display: auto;
  src: url('/fonts/montserrat-v15-latin-regular.eot'); /* IE9 Compat Modes */
  src: local('Montserrat Regular'), local('Montserrat-Regular'),
       url('/fonts/montserrat-v15-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('/fonts/montserrat-v15-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('/fonts/montserrat-v15-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('/fonts/montserrat-v15-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('/fonts/montserrat-v15-latin-regular.svg#Montserrat') format('svg'); /* Legacy iOS */
}

  /* open-sans-700 - latin */
  @font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-display: auto;
  src: url('/fonts/open-sans-v18-latin-700.eot'); /* IE9 Compat Modes */
  src: local('Open Sans Bold'), local('OpenSans-Bold'),
       url('/fonts/open-sans-v18-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('/fonts/open-sans-v18-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
       url('/fonts/open-sans-v18-latin-700.woff') format('woff'), /* Modern Browsers */
       url('/fonts/open-sans-v18-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
       url('/fonts/open-sans-v18-latin-700.svg#OpenSans') format('svg'); /* Legacy iOS */
}

    body {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 400;
    }

    h1 {
        text-align: center;
        text-transform: uppercase;
        margin-top: 5rem;
        margin-bottom: 0.5rem;
        font-size: 3rem;
    }

    h2 {
        margin: 0;
    }
`

const theme = {
    colors: {
        primary: '#0070f3',
    },
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}
