const citiesWithCoords = require('./citycoordinates.json')
const cities = require('./cities.json')
const fs = require('fs')
const fetch = require('node-fetch')

const test = cities.cities.map((chunk, index) =>
    setTimeout(() => {
        console.log('Generating chunk no.: ', index)
        return chunk.map((city) =>
            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?&address=${encodeURIComponent(
                    city
                )}&key=AIzaSyD45Vj_0Z-waFHG463DKKqkCRSpnenCYr8`
            )
                .then((res) => res.json())
                .then((res) => {
                    if (typeof res.results[0] === 'undefined') {
                        console.error(res)
                    } else {
                        citiesWithCoords.cities.push({
                            name: city,
                            coords: res.results[0].geometry.location,
                        })
                        fs.writeFile(
                            './data/citycoordinates.json',
                            `{"cities": ${JSON.stringify(
                                citiesWithCoords.cities
                            )}}`,
                            'utf-8',
                            function (err) {
                                if (err) throw err
                            }
                        )
                    }
                })
        )
    }, 2000 * index)
)
