import { json, type V2_MetaFunction } from '@remix-run/node'
import { prisma } from '~/services/db.server'
import { EntityTable } from '../components'
import { Header } from '../layout/header'

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'TrackAML App' },
        { name: 'description', content: 'Welcome to TrackAML!' },
    ]
}

export const loader = async () => {
    const entities = await prisma.potentialRisk.findMany({})

    console.log({ entities })

    return json({})
}

export default function Index() {
    return (
        <div className="min-h-full">
            <Header title="Illicit offshore sand mining risk ranking"></Header>

            <main className="-mt-32">
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    <EntityTable entities={[]}></EntityTable>
                </div>
            </main>
        </div>
    )
}
