/* eslint-disable @typescript-eslint/no-var-requires*/
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
    images: {
        domains: ['api.mapbox.com'],
    },
    pwa: {
        dest: 'public',
        runtimeCaching,
    },
})
