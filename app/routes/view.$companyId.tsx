import {
    LoaderArgs,
    SerializeFrom,
    V2_MetaFunction,
    json,
} from '@remix-run/node'
import { createContext, useState } from 'react'
import {
    BuildingOfficeIcon,
    UserIcon,
    UsersIcon,
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid'
import { prisma } from '~/services/db.server'
import { clsx } from 'clsx'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import qs from 'qs'
import { BeneficialOwner, CompanyProfile, PotentialRisk } from '@prisma/client'

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'TrackAML App' },
        { name: 'description', content: 'Welcome to TrackAML!' },
    ]
}

const tabs = [
    { name: 'Overview', href: 'overview', icon: UserIcon },
    {
        name: 'Transactions',
        href: 'transactions',
        icon: BuildingOfficeIcon,
    },
    { name: 'Involved Parties', href: 'parties', icon: UsersIcon },
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

type Profile = SerializeFrom<
    CompanyProfile & {
        beneficial_owner: BeneficialOwner[]
        potensial_risk: PotentialRisk
    }
>

export const ProfileContext = createContext<Profile | null>(null)

export default function ViewCompany() {
    const { profile, mapParams } = useLoaderData<typeof loader>()

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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

                    <div className="bg-gray-50 -mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20">
                        <div className="mb-8">
                            <div className="hidden sm:block">
                                <div className="border-b border-gray-200">
                                    <nav
                                        className="-mb-px flex space-x-8"
                                        aria-label="Tabs"
                                    >
                                        {tabs.map((tab) => (
                                            <NavLink
                                                key={tab.name}
                                                to={tab.href}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive
                                                            ? 'border-indigo-500 text-indigo-600'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                        'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                                                    )
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <tab.icon
                                                            className={clsx(
                                                                isActive
                                                                    ? 'text-indigo-500'
                                                                    : 'text-gray-400 group-hover:text-gray-500',
                                                                '-ml-0.5 mr-2 h-5 w-5'
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                        <span>{tab.name}</span>
                                                    </>
                                                )}
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <ProfileContext.Provider value={profile}>
                            <Outlet />
                        </ProfileContext.Provider>
                    </div>
                </div>
            </div>
        </>
    )
}
