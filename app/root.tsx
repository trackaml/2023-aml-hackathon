import { cssBundleHref } from '@remix-run/css-bundle'
import * as Remix from '@remix-run/react'

import type { LinksFunction } from '@remix-run/node'

import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
    { rel: 'stylesheet', href: stylesheet },
]

export default function App() {
    return (
        <html lang="en" className="h-full">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Remix.Meta />
                <Remix.Links />
            </head>
            <body className="h-full">
                <Remix.Outlet />
                <Remix.ScrollRestoration />
                <Remix.Scripts />
                <Remix.LiveReload />
            </body>
        </html>
    )
}
