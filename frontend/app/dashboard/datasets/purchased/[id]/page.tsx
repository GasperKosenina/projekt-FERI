
import { findById, getPaymentByDataset, getUser } from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";


async function getDataProvider(userId: string) {
    try {
        const user = await clerkClient.users.getUser(userId);
        return user.username;
    } catch (error) {
        return "No Data Provider";
    }
}

function formatDate(dateString: any) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default async function Page({
    params,
}: {
    params: { id: string };
}) {
    const { userId } = auth();
    if (!userId) {
        console.error("No user ID found");
        return <div>Check your connection</div>;
    }
    const id = params.id;


    const dataset: Dataset = await findById(id);
    const datasetID:string = dataset.id || '';

    //const payment:Payment = await getPaymentByDataset(datasetID);
    
    


   

    const mongoUser = await getUser(dataset.userID);

    return (
        <main>
            <div>
                <h1 className="text-xl font-bold mb-5">
                    {dataset.name}
                </h1>
                <div className="mt-20 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                                URL
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {dataset.url}
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                                Data Provider
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <span>{await getDataProvider(dataset.userID)} </span>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                                Category
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {dataset.category}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </main>
    );
}
