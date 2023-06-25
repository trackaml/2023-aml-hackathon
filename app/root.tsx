import { cssBundleHref } from '@remix-run/css-bundle'
import * as Remix from '@remix-run/react'

import type { LinksFunction } from '@remix-run/node'

import stylesheet from '~/tailwind.css'
import { Header } from './layout/header'

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
    { rel: 'stylesheet', href: stylesheet },
]

export default function App() {
    return (
        <html lang="en" className="h-full bg-gray-100">
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
                <div className="min-h-full">
                    <Header></Header>

                    <main className="-mt-44">
                        <Remix.Outlet />
                    </main>
                </div>
                <Remix.ScrollRestoration />
                <Remix.Scripts />
                <Remix.LiveReload />
            </body>
        </html>
    )
}
