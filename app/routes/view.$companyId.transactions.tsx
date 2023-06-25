import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/services/db.server'

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

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        {profile.company_name}'s Transactions
                    </h1>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Source
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Destination
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Transaction Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Ammount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                            {tx.source?.stakeholder_name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {tx.dest?.stakeholder_name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {tx.transaction_date}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {new Intl.NumberFormat('id-Id', {
                                                maximumSignificantDigits: 3,
                                            }).format(tx.transaction_value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
