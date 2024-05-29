import { findById, getAllPaymentsByDataset } from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import DatasetPage from "@/app/ui/published-dataset";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const dataset: Dataset = await findById(id);
    const payments: Payment[] = await getAllPaymentsByDataset(id);

    const durationInMilliseconds = dataset.duration * 60 * 60 * 1000;

    const validCustomers = payments.filter(payment => {
        if (!payment.tokenCreatedAt) {
            return false;
        }
        const tokenCreatedAt = new Date(payment.tokenCreatedAt).getTime();
        const currentTime = new Date().getTime();
        return (currentTime - tokenCreatedAt) < durationInMilliseconds;
    });

    const validCustomersLength = validCustomers.length;

    const { userId } = auth();
    if (!userId) {
        console.error("No user ID found");
        return;
    }

    if (dataset.userID !== userId) {
        return (
            <div>
                <h1
                    className="text-left font-normal text-gray-500 mb-4"
                    style={{ fontSize: "1.375rem" }}
                >
                    Access Denied
                </h1>
                <div className="rounded-lg p-6 bg-[#f9fafb]">
                    <div className="mt-6 animate-bounce">
                        <p className="text-center mt-10 text-xl text-grey-500">
                        Uh-oh! ☹ You do not have access to this page. Please try again later.
                        </p>
                    </div>
                    <div className="flex justify-center mt-10 mb-8">
                        <Link href={`/dashboard/datasets`}>
                            <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-[#60a5fa]">
                                Go to Dashboard
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <DatasetPage dataset={dataset} validCunsomers={validCustomersLength} />;
}
