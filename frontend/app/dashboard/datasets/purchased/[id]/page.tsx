import Countdown from "@/app/ui/countdown-token";
import { findById, getPaymentByDataset, getUser } from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ButtonComponent, ButtonDetailsComponent } from "@/app/ui/button";

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
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#3b82f6' }}>{dataset.name}</h1>
            <p className="text-lg mb-8">
                <Countdown expiresAt={expiresAt} />
            </p>
            <div className="mx-auto w-full max-w-full bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-gray-200">
                <div className="outline outline-1 border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {dataset.name}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">URL</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href={dataset.url} className="text-blue-500 hover:underline">
                                    {dataset.url}
                                </a>
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Data Provider</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {await getDataProvider(dataset.userID)}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Your Token Expires On</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {formattedExpiresAt}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="mt-8">
                <p className="text-md mb-8 text-gray-700">
                    If you have lost or forgotten your access token, you can request a new one by clicking the button below.
                </p>
                <ButtonComponent>Request New Access Token</ButtonComponent>
            </div>
        </main>
    );
}
