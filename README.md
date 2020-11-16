# Just C😲vid

> For all, who want less 📈 and more 🐱‍👤 to describe the current COVID-19 situation in Germany. Stay safe. 💌

This is a really tiny project that plays with the awesome features provided by [Vercel](https://vercel.com) and [Nextjs](https://nextjs.org/).

The main goal was to create a individual og:image per page. Inspired by [repng](https://github.com/jxnblk/repng) I use [playwright](https://github.com/microsoft/playwright) to create a actual image from a specified component:

```typescript
// lib/imageFromComponent.ts
import { renderToStaticMarkup } from 'react-dom/server'
import { chromium } from 'playwright'

const baseCSS = `*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}`

const imageFromComponent = async (
    Component: React.ReactElement,
    size: { width: number; height: number },
    filename: string
): Promise<Buffer> => {
    // Render the component to html
    const body = renderToStaticMarkup(Component)

    // Open a browser window and set the component with a unstyled body
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setContent(`<!DOCTYPE html><head>
    <meta charset="utf-8"><style>${baseCSS}</style>
    </head>
    <body style="display:inline-block">
    ${body}`)

    // Set the viewport size to the desired image size
    await page.setViewportSize(size)

    const result = await page.screenshot({
        path: filename,
        clip: {
            x: 0,
            y: 0,
            ...size,
        },
        omitBackground: true,
    })

    await browser.close()

    return result
}

export { imageFromComponent }
```

## Notes 

### How I calculate the Base Reproduction Number

To calculate the Base Reproduction Number (germ.: R-Wert) I use the following formula:

```
BRN from 02.05.2020
SUM(Sum_of_Cases(27.04.20 -> 03.05.20))/SUM(Sum_of_Cases(23.04.20-29.04.20))

const today = today //02.05.20

const sum1 = (Date()-5) + (Date()-4) + (Date()-3) + (Date()-2) + (Date()-1) + (Date()) + (Date()+1)
const sum2 = (Date()-9) + (Date()-8) + (Date()-7) + (Date()-6) + (Date()-5) + (Date()-4) + (Date()-3)
const res = sum1/sum2
```

To get historic data I save the daylie data returnd by (source).

## Contribution

Do what ever you want. ❤

## Notes

This is an amalgamation of the 2 existing examples:

- [with-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)
- [with-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)
