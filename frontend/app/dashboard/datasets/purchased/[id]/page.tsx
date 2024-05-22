import Countdown from "@/app/ui/countdown-token";
import { findById, getPaymentByDataset, getUser } from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";

async function getDataProvider(userId: string): Promise<string> {
    try {
        const user = await clerkClient.users.getUser(userId);
        return user.username || "No Data Provider";
    } catch (error) {
        return "No Data Provider";
    }
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function calculateExpirationDate(createdAt: Date, expirationHours: number): Date {
    const createdAtDate = new Date(createdAt);
    createdAtDate.setHours(createdAtDate.getHours() + expirationHours);
    return createdAtDate;
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

    const dataset: Dataset | null = await findById(id);
    if (!dataset) {
        console.error("Dataset not found");
        return <div>Dataset not found</div>;
    }

    const datasetID: string = dataset.id || '';

    const payment: Payment | null = await getPaymentByDataset(datasetID);

    if (!payment || !payment.tokenCreatedAt) {
        console.error("Payment or created at date not found");
        return <div>Payment or created at date not found</div>;
    }

    const expiration = dataset.duration;
    const createdAt: Date = new Date(payment.tokenCreatedAt);

    const expiresAt = calculateExpirationDate(createdAt, expiration);
    const formattedExpiresAt = formatDate(expiresAt);

    const mongoUser = await getUser(dataset.userID);

    return (
        <main>
            <div>
                <h1 className="text-2xl font-bold mb-10">
                    {dataset.name}
                </h1>
                <h1 className="text-lg mb-5">
                    {expiresAt && <Countdown expiresAt={expiresAt} />}
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
                                Your Token Expires At
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {formattedExpiresAt}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </main>
    );
}
