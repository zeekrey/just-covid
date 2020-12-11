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

## Caveats 

As of writing this playwright needs a postinstall hook to work properly.This hook is not fired when next revalidates the page. If you want to use [awesome ISG](https://nextjs.org/blog/next-9-5#stable-incremental-static-regeneration) then you need somehow cache playwright or do something else.

## Contribution

Do what ever you want. ❤

## Notes

This is an amalgamation of the 2 existing examples:

- [with-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-typescript)
- [with-styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)
