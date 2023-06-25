import { CompanyProfile, PotentialRisk } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'
import { NavLink } from '@remix-run/react'

type EntityTableProps = {
    entities: SerializeFrom<PotentialRisk & { company: CompanyProfile }>[]
}

export function EntityTable({ entities }: EntityTableProps) {
    return (
        <div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            Number
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Company Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm text-center font-semibold text-gray-900 w-32"
                                        >
                                            Potential Risk
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Mining Location
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                        >
                                            <span className="sr-only"></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {entities.map((entity, index) => (
                                        <tr key={entity.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {entity.company_name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                                                <span
                                                    className="inline-block bg-gradient-to-r to-lime-500 from-rose-500 w-full items-center rounded-md px-2 py-1 text-xs font-medium text-gray-100"
                                                    style={
                                                        {
                                                            '--tw-gradient-from-position': `${entity.total_risk}%`,
                                                            '--tw-gradient-to-position': `${entity.total_risk}%`,
                                                        } as any
                                                    }
                                                >
                                                    {entity.total_risk.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {entity.company?.regency_name}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <NavLink
                                                    to={`/view/${entity.company_id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                    <span className="sr-only">
                                                        , {entity.company_name}
                                                    </span>
                                                </NavLink>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
