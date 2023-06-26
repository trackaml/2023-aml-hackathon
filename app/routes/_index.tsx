import { json, type V2_MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/services/db.server'
import { EntityTable } from '../components'
import RangeSlider from 'react-range-slider-input'
import 'react-range-slider-input/dist/style.css'
import { parse } from 'date-fns'
import { useState } from 'react'

export const meta: V2_MetaFunction = () => {
    return [
        { title: 'TrackAML App' },
        { name: 'description', content: 'Welcome to TrackAML!' },
    ]
}

export const loader = async () => {
    const entities = await prisma.potentialRisk.findMany({
        orderBy: {
            total_risk: 'desc',
        },
        include: {
            company: true,
        },
    })

    const txdata = await prisma.transactionData.findMany()

    const txyears = txdata
        .map((t) => t.transaction_date)
        .map((date) => parse(date, 'dd/LL/yyyy HH:mm', new Date()))
        .map((date) => date.getFullYear())

    const years = [...new Set(txyears)].sort()

    return json({ entities, years })
}

export default function Index() {
    const { entities, years } = useLoaderData<typeof loader>()

    const min = years.at(0)
    const max = years.at(-1)

    const [selectedYears, setSelectedYears] = useState([min, max])

    return (
        <>
            <header className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Illicit offshore sand mining risk ranking
                    </h1>
                </div>
            </header>
            <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Company transaction's year:
                        </h3>
                        <div className="mt-2 sm:flex sm:justify-between items-center">
                            <div className="max-w-xl text-sm text-gray-500 flex mr-2">
                                <span className="whitespace-nowrap">
                                    From: {selectedYears[0]}
                                </span>
                            </div>
                            <RangeSlider
                                className="w-full lg:mr-2"
                                min={min}
                                max={max}
                                onInput={setSelectedYears}
                                value={selectedYears}
                            />
                            <div className="max-w-xl text-sm text-gray-500 flex">
                                <span className="whitespace-nowrap">
                                    To: {selectedYears[1]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <EntityTable entities={entities}></EntityTable>
            </div>
        </>
    )
}
