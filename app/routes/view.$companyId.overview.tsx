import { useContext } from 'react'
import { ProfileContext } from './view.$companyId'

export default function CompanyProfileOverview() {
    const profile = useContext(ProfileContext)

    return (
        <>
            <div className="flex items-center mb-2">
                <h2 className="text-base flex-1 font-semibold leading-6 text-gray-900">
                    {profile.company_name}{' '}
                </h2>
                {profile.potensial_risk ? (
                    <span
                        className="bg-gradient-to-r to-lime-500 from-rose-500 items-center rounded-md px-2 py-1 text-xs font-medium text-gray-100"
                        style={
                            {
                                '--tw-gradient-from-position': `${profile.potensial_risk?.total_risk}%`,
                                '--tw-gradient-to-position': `${profile.potensial_risk.total_risk}%`,
                            } as any
                        }
                    >
                        {profile.potensial_risk.total_risk.toFixed(1)}%
                    </span>
                ) : (
                    ''
                )}
            </div>
            <address className="text-gray-500 not-italic text-sm">
                {profile.address}
            </address>
            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
                <colgroup>
                    <col className="w-full" />
                    <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-gray-900">
                    <tr>
                        <th scope="col" className="px-0 py-3 font-semibold">
                            Beneficial Owners
                        </th>
                        <th
                            scope="col"
                            className="py-3 pl-8 pr-0 text-right font-semibold"
                        >
                            Share
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {profile.beneficial_owner.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                            <td className="max-w-0 px-0 py-5 align-top">
                                <div className="truncate font-medium text-gray-900">
                                    {item.stakeholder_name}
                                </div>
                                <div className="truncate text-gray-500">
                                    {item.address}
                                </div>
                            </td>
                            <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                                {new Intl.NumberFormat('id-ID', {
                                    maximumSignificantDigits: 3,
                                }).format(item.total_share_placed)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
