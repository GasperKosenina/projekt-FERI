import Table from "@/app/ui/table";
import Search from "@/app/ui/search";
import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TableSkeleton } from "@/app/ui/skeletons";
import CategoryDropdown from "@/app/ui/category-dropdown";

export default async function Page({ searchParams }: { searchParams?: { query?: string, category?: string }; }) {
    const query = searchParams?.query || '';
    const category = searchParams?.category || '';


    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
            <h1 className={`text-2xl font-bold`}>Datasets</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search />
                <CategoryDropdown />
                <Link
                    href="/dashboard/datasets/create"
                    className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Publish new dataset</span>{' '}
                    <PlusIcon className="h-5 md:ml-4" />
                </Link>
            </div>
            <Suspense fallback={<TableSkeleton />} key={query}>
                <Table query={query} category={category} />
            </Suspense>
        </div>
    );
}
