import Table from "@/app/ui/table"
import Search from "@/app/ui/search"
import Link from "next/link"
import { Suspense } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"


export default async function Page({ searchParams }: { searchParams?: { query?: string }; }) {
    const query = searchParams?.query || '';


    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Datasets</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search />
                <Link
                    href="/dashboard/datasets/create"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Publish new dataset</span>{' '}
                    <PlusIcon className="h-5 md:ml-4" />
                </Link>
            </div>
            <Suspense key={query} >
                <Table query={query} />
            </Suspense>
        </div>
    )
}