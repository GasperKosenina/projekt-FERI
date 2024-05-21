import { Suspense } from "react";
import { CardsSkeleton, LatestInvoicesSkeleton } from "../ui/skeletons";
import MyDatasets from "../ui/my-datasets";
import MyTokens from "../ui/my-tokens";
import CardWrapper from "../ui/cards";


export default async function Page() {


  return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <MyDatasets />
        </Suspense >
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <MyTokens />
        </Suspense>
      </div>
    </main>
  );
}