import { createPayment } from "@/lib/data";

let paymentId: any = null;

export async function getPayment(datasetId: string) {
    if (!paymentId) {
        paymentId = await createPayment(datasetId);
    }
    return paymentId;
}