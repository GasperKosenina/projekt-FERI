import {
  findById,
  getDataProviderName,
  getDatasetNameById,
  getPaymentsByUser2,
  getTokenRequestsByUser,
} from "@/lib/data";
import { Payment, TokenRequest } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import { CheckCircleIcon, CircleX, RedoIcon, Repeat1Icon, Repeat2Icon } from "lucide-react";
import React from "react";

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

  const payments: Payment[] = await getPaymentsByUser2(userId);

  if (payments) {
    payments.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  const tokenRequests: TokenRequest[] = await getTokenRequestsByUser(userId);
  const tokenRequestsByDataset = tokenRequests ? tokenRequests.reduce((acc, request) => {
    if (!acc[request.datasetID]) {
      acc[request.datasetID] = [];
    }
    acc[request.datasetID].push(request);
    return acc;
  }, {} as Record<string, TokenRequest[]>) : {};

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-8 text-gray-800">Transactions History</h1>
        <div className="bg-white outline outline-1 outline-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">Bought By</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Purchased At</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Dataset</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Amount</th>
                <th className="py-2 px-4 bg-gray-200 text-center">Paid Success</th>
              </tr>
            </thead>
            <tbody>
              {!payments ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No payment history found
                  </td>
                </tr>
              ) : (
                payments.map(async (payment) => (
                  <React.Fragment key={payment.id}>
                    <tr className="border-t">
                      <td className="py-6 px-4">
                        {await getDataProviderName(payment.userId)}
                      </td>
                      <td className="py-6 px-4">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-6 px-4">
                        {await getDatasetNameById(payment.datasetId)}
                      </td>
                      <td className="py-6 px-4">{payment.amount}$</td>
                      <td className="py-6 px-4 text-center">
                        {payment.paymentStatus ? (
                          <CheckCircleIcon className="text-green-500 inline-block" />
                        ) : (
                          <CircleX className="text-red-600 inline-block" />
                        )}
                      </td>
                    </tr>
                    {tokenRequestsByDataset[payment.datasetId]?.map(async (request) => (
                      <tr key={request.id} className="border-t">
                        <td className="py-2 px-4 text-sm text-gray-500 pl-10"></td>
                        <td className="py-2 px-4 text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500">
                          {await getDatasetNameById(request.datasetID)}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-500">{request.amount}$</td>
                        <td className="py-6 px-4 text-center">
{/*                         {request.payed ? (
                          <CheckCircleIcon className="text-green-500 inline-block" />
                        ) : (
                          <CircleX className="text-red-600 inline-block" />
                        )} */}
                      </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
