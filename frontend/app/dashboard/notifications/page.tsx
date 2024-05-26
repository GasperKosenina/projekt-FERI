import AcceptDeclineButton from "@/app/ui/accept-declineButton";
import {
  getAllAcceptedByUserId,
  getAllDeclinedByUserId,
  getAllPendingByUserId,
  getDataProviderName,
  getDatasetNameById,
} from "@/lib/data";
import { TokenRequest } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { OctagonXIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

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
    return <div>Check your connection</div>;
  }

  const pendingRequests: TokenRequest[] = await getAllPendingByUserId(userId);
  if (pendingRequests) {
    pendingRequests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  const declinedRequests: TokenRequest[] = await getAllDeclinedByUserId(userId);
  if (declinedRequests) {
    declinedRequests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  const acceptedRequests: TokenRequest[] = await getAllAcceptedByUserId(userId);
  if (acceptedRequests) {
    acceptedRequests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }
  console.log(acceptedRequests);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">
          <SquarePenIcon className="w-8 h-8 inline-block mr-2" />
          Token requests for your datasets
        </h1>
        <div className="bg-white outline outline-1 outline-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">
                  Requested By
                </th>
                <th className="py-2 px-4 bg-gray-200 text-left">
                  Requested At
                </th>
                <th className="py-2 px-4 bg-gray-200 text-left">Dataset</th>
                <th className="py-2 px-4 bg-gray-200 text-center">
                  Accept/Decline
                </th>
              </tr>
            </thead>
            <tbody>
              {!pendingRequests ? (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center">
                    No pending requests found
                  </td>
                </tr>
              ) : (
                pendingRequests.map(async (request) => (
                  <tr key={request.id} className="border-t">
                    <td className="py-3 px-4">
                      {await getDataProviderName(request.reqUserID)}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {await getDatasetNameById(request.datasetID)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <AcceptDeclineButton
                        id={request.id}
                        paymentId={request.paymentID}
                        datasetId={request.datasetID}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-2xl font-bold mb-8">
          <CheckBadgeIcon className="w-8 h-8 inline-block mr-2" />
          Accepted requests
        </h1>
        <div className="bg-white outline outline-1 outline-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">Accepted By</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Accepted At</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Dataset</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Token URL</th>
              </tr>
            </thead>
            <tbody>
              {!acceptedRequests ? (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center">
                    No accepted requests found
                  </td>
                </tr>
              ) : (
                acceptedRequests.map(async (request) => (
                  <tr key={request.id} className="border-t">
                    <td className="py-3 px-4">
                      {await getDataProviderName(request.providerID)}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {await getDatasetNameById(request.datasetID)}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={request.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500"
                      >
                        Click here
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-2xl font-bold mb-8">
          <OctagonXIcon className="w-8 h-8 inline-block mr-2" />
          Declined requests
        </h1>
        <div className="bg-white outline outline-1 outline-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">Declined By</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Declined At</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Dataset</th>
              </tr>
            </thead>
            <tbody>
              {!declinedRequests ? (
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center">
                    No declined requests found
                  </td>
                </tr>
              ) : (
                declinedRequests.map(async (request) => (
                  <tr key={request.id} className="border-t">
                    <td className="py-3 px-4">
                      {await getDataProviderName(request.providerID)}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {await getDatasetNameById(request.datasetID)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
