import { useLoaderData } from '@remix-run/react'
import { LoaderArgs, json } from '@remix-run/node'
import { random } from 'lodash'
import { prisma } from '~/services/db.server'
import React from 'react'
import { ClientOnly } from 'remix-utils'

const GraphCanvas = React.lazy(() =>
    import('reagraph').then((module) => ({ default: module.GraphCanvas }))
)

export async function loader({ params }: LoaderArgs) {
    const profile = await prisma.companyProfile.findUnique({
        where: {
            id: parseInt(params.companyId),
        },
        include: {
            beneficial_owner: true,
        },
    })

    const identities = profile.beneficial_owner.map((bo) => bo.identity_id)

    const transactions = await prisma.transactionData.findMany({
        where: {
            OR: {
                PEA_name_source: {
                    in: identities,
                },
                PEA_name_dest: {
                    in: identities,
                },
            },
        },
        include: {
            source: true,
            dest: true,
        },
    })

    return json({ profile, identities, transactions })
}

export default function CompanyProfileTrx() {
    const { profile, transactions } = useLoaderData<typeof loader>()

    const nodes = profile.beneficial_owner.map((bo) => ({
        id: bo.identity_id,
        label: `${bo.stakeholder_name}`,
        fill: `hsl(${random(0, 360)}, 100%, 50%)`,
        data: {
            type: bo.province,
        },
        size: transactions.filter(
            (tx) =>
                tx.PEA_name_dest === bo.identity_id ||
                tx.PEA_name_source === bo.identity_id
        ).length,
    }))

    const edges = transactions.map((tx) => ({
        id: `${tx.id}`,
        source: tx.PEA_name_source,
        target: tx.PEA_name_dest,
        label: tx.transaction_id,
    }))

    return (
        <div className="container relative w-full h-80">
            <React.Suspense>
                <ClientOnly>
                    {() => (
                        <GraphCanvas
                            nodes={nodes}
                            edges={edges}
                            clusterAttribute="type"
                        />
                    )}
                </ClientOnly>
            </React.Suspense>
        </div>
    )
}
