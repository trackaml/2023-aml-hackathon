import { LoaderArgs, V2_MetaFunction, json } from '@remix-run/node'
import { useState } from 'react'
import {
    Bars3Icon,
    CalendarDaysIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    UserCircleIcon,
    XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid'
import { prisma } from '~/services/db.server'
import { clsx } from 'clsx'
import { useLoaderData } from '@remix-run/react'
import qs from 'qs'

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'TrackAML App' },
        { name: 'description', content: 'Welcome to TrackAML!' },
    ]
}

const moods = [
    {
        name: 'Excited',
        value: 'excited',
        icon: FireIcon,
        iconColor: 'text-white',
        bgColor: 'bg-red-500',
    },
    {
        name: 'Loved',
        value: 'loved',
        icon: HeartIcon,
        iconColor: 'text-white',
        bgColor: 'bg-pink-400',
    },
    {
        name: 'Happy',
        value: 'happy',
        icon: FaceSmileIcon,
        iconColor: 'text-white',
        bgColor: 'bg-green-400',
    },
    {
        name: 'Sad',
        value: 'sad',
        icon: FaceFrownIcon,
        iconColor: 'text-white',
        bgColor: 'bg-yellow-400',
    },
    {
        name: 'Thumbsy',
        value: 'thumbsy',
        icon: HandThumbUpIcon,
        iconColor: 'text-white',
        bgColor: 'bg-blue-500',
    },
    {
        name: 'I feel nothing',
        value: null,
        icon: XMarkIconMini,
        iconColor: 'text-gray-400',
        bgColor: 'bg-transparent',
    },
]

export async function loader({ params }: LoaderArgs) {
    const apiKey = process.env.GMAPS_API_KEY

    const profile = await prisma.companyProfile.findUnique({
        where: {
            id: parseInt(params.companyId),
        },
        include: {
            beneficial_owner: true,
            potensial_risk: true,
        },
    })

    const mapParams = qs.stringify(
        {
            center: profile.address,
            format: 'png',
            size: '400x400',
            key: apiKey,
        },
        { format: 'RFC1738' }
    )

    return json({ profile, apiKey, mapParams })
}

export default function ViewCompany() {
    const [selected, setSelected] = useState(moods[5])

    const { profile, mapParams } = useLoaderData<typeof loader>()

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {/* Invoice summary */}
                    <div className="lg:col-start-3 lg:row-end-1">
                        <h2 className="sr-only">Summary</h2>
                        <div className="rounded-lg bg-gray-50 p-2 shadow-sm ring-1 ring-gray-900/5">
                            <img
                                className="rounded"
                                src={`https://maps.googleapis.com/maps/api/staticmap?${mapParams}`}
                                alt="maps"
                            />
                        </div>
                    </div>

                    {/* Invoice */}
                    <div className="bg-gray-50 -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
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
                                    {profile.potensial_risk.total_risk.toFixed(
                                        1
                                    )}
                                    %
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
                                    <th
                                        scope="col"
                                        className="px-0 py-3 font-semibold"
                                    >
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
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-100"
                                    >
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
                    </div>
                </div>
            </div>
        </>
    )
}
