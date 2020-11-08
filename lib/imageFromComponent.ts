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

    // Open a browser window and set the wrap th component with a unstyled body
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
