import * as React from 'react'
import type { AppProps } from 'next/app'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'styled-normalize'
import Head from 'next/head'

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
        font-size: 3rem;
        margin: 0;
    }

    h2 {
        margin: 0;
        margin-top: 5rem;
        margin-bottom: 0.5rem;
    }
`

const theme = {
    colors: {
        primary: '#0070f3',
    },
}

type Event = {
    type: string
}

export default function App({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox !== undefined
        ) {
            const wb = (window as any).workbox
            // add event listeners to handle any of PWA lifecycle event
            // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
            wb.addEventListener('installed', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`)
                console.log(event)
            })

            wb.addEventListener('controlling', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`)
                console.log(event)
            })

            wb.addEventListener('activated', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`)
                console.log(event)
            })

            // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
            // NOTE: MUST set skipWaiting to false in next.config.js pwa object
            // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
            const promptNewVersionAvailable = () => {
                // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
                // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
                // You may want to customize the UI prompt accordingly.
                if (
                    confirm(
                        'A newer version of this web app is available, reload to update?'
                    )
                ) {
                    wb.addEventListener('controlling', () => {
                        window.location.reload()
                    })

                    // Send a message to the waiting service worker, instructing it to activate.
                    wb.messageSW({ type: 'SKIP_WAITING' })
                } else {
                    console.log(
                        'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
                    )
                }
            }

            wb.addEventListener('waiting', promptNewVersionAvailable)
            wb.addEventListener('externalwaiting', promptNewVersionAvailable)

            // ISSUE - this is not working as expected, why?
            // I could only make message event listenser work when I manually add this listenser into sw.js file
            wb.addEventListener('message', (event: Event) => {
                console.log(`Event ${event.type} is triggered.`)
                console.log(event)
            })

            /*
            wb.addEventListener('redundant', event => {
              console.log(`Event ${event.type} is triggered.`)
              console.log(event)
            })
            wb.addEventListener('externalinstalled', event => {
              console.log(`Event ${event.type} is triggered.`)
              console.log(event)
            })
            wb.addEventListener('externalactivated', event => {
              console.log(`Event ${event.type} is triggered.`)
              console.log(event)
            })
            */

            // never forget to call register as auto register is turned off in next.config.js
            wb.register()
        }
    }, [])

    return (
        <>
            <Head>
                <html lang="de" />
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <link rel="manifest" href="/manifest.json" />
                <link
                    href="/favicon-16x16.png"
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                />
                <link
                    href="/favicon-32x32.png"
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                />
                <link
                    rel="apple-touch-icon"
                    href="/icons/icon-180x180.png"
                ></link>
                <meta name="theme-color" content="#ffffff" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
            </Head>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
}
