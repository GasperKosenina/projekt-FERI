import { findById, getAllPaymentsByDataset } from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import DatasetPage from "@/app/ui/published-dataset";
import { auth } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const dataset: Dataset = await findById(id);
    const payments: Payment[] = await getAllPaymentsByDataset(id);


    const durationInMilliseconds = dataset.duration * 60 * 60 * 1000;

    const validCunsomers = payments.filter(payment => {
        if (!payment.tokenCreatedAt) {
            return false;
        }
        const tokenCreatedAt = new Date(payment.tokenCreatedAt).getTime();
        const currentTime = new Date().getTime();
        return (currentTime - tokenCreatedAt) < durationInMilliseconds;
    });

    const validCunsomersLength = validCunsomers.length;

    const { userId } = auth();
    if (!userId) {
        console.error("No user ID found");
        return;
    }

    if (dataset.userID !== userId) {
        return <p>You do not have access to this page!</p>;
    }


    return <DatasetPage dataset={dataset} validCunsomers={validCunsomersLength} />;
}
