import {
  findById,
  getDataProviderName,
  getDatasetNameById,
  getPaymentsByUser,
} from "@/lib/data";
import { Payment } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import { CheckCircleIcon } from "lucide-react";

export default async function Page() {
  function formatDate(dateString: any) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  const payments: Payment[] = await getPaymentsByUser(userId);

  if (!payments) {
    console.error("No payments found");
    return (
      <div className="flex justify-center text-xl">
        There is no purchase history of your datasets
      </div>
    );
  }
  payments.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">
          Purchase History Of Your Datasets
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">Bought By</th>
                <th className="py-2 px-4 bg-gray-200 text-left">
                  Purchased At
                </th>
                <th className="py-2 px-4 bg-gray-200 text-left">Dataset</th>
                <th className="py-2 px-4 bg-gray-200 text-center">
                  Paid Success
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map(async (payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="py-2 px-4">
                    {await getDataProviderName(payment.userId)}
                  </td>
                  <td className="py-2 px-4">{formatDate(payment.createdAt)}</td>
                  <td className="py-2 px-4">
                    {await getDatasetNameById(payment.datasetId)}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {payment.paymentStatus ? (
                      <CheckCircleIcon className="text-green-500 inline-block" />
                    ) : (
                      <span className="text-red-500">Failed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}