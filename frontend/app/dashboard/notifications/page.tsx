import AcceptDeclineButton from "@/app/ui/accept-declineButton";
import {
  getAllAcceptedByUserId,
  getAllDeclinedByUserId,
  getAllPendingByUserId,
  getDataProviderName,
  getDatasetNameById,
  updateTokenRequestSeen,
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Token Requests for Your Datasets
      </h1>

      {/* Pending Requests Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <SquarePenIcon className="w-8 h-8 mr-2" />
          Pending Requests
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Requested By</th>
                <th className="py-2 px-4 text-left">Requested At</th>
                <th className="py-2 px-4 text-left">Dataset</th>
                <th className="py-2 px-4 text-center">Reason</th>
                <th className="py-2 px-4 text-center">Accept/Decline</th>
              </tr>
            </thead>
            <tbody>
              {!pendingRequests || pendingRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No pending requests found
                  </td>
                </tr>
              ) : (
                pendingRequests.map((request) => {
                  if (request.seen === false) {
                    updateTokenRequestSeen(request.id as string);
                  }
                  return (
                    <tr key={request.id} className="border-t">
                      <td className="py-3 px-4">
                        {getDataProviderName(request.reqUserID)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getDatasetNameById(request.datasetID)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {request.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <AcceptDeclineButton
                          id={request.id}
                          paymentId={request.paymentID}
                          datasetId={request.datasetID}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accepted Requests Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <CheckBadgeIcon className="w-8 h-8 mr-2" />
          Accepted Requests
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Accepted By</th>
                <th className="py-2 px-4 text-left">Accepted At</th>
                <th className="py-2 px-4 text-left">Dataset</th>
                <th className="py-2 px-4 text-left">Token URL</th>
              </tr>
            </thead>
            <tbody>
              {!acceptedRequests || acceptedRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No accepted requests found
                  </td>
                </tr>
              ) : (
                acceptedRequests.map((request) => {
                  if (request.seen === false) {
                    updateTokenRequestSeen(request.id as string);
                  }
                  return (
                    <tr key={request.id} className="border-t">
                      <td className="py-3 px-4">
                        {getDataProviderName(request.providerID)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getDatasetNameById(request.datasetID)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declined Requests Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <OctagonXIcon className="w-8 h-8 mr-2" />
          Declined Requests
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Declined By</th>
                <th className="py-2 px-4 text-left">Declined At</th>
                <th className="py-2 px-4 text-left">Dataset</th>
              </tr>
            </thead>
            <tbody>
              {!declinedRequests || declinedRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No declined requests found
                  </td>
                </tr>
              ) : (
                declinedRequests.map((request) => {
                  if (request.seen === false) {
                    updateTokenRequestSeen(request.id as string);
                  }
                  return (
                    <tr key={request.id} className="border-t">
                      <td className="py-3 px-4">
                        {getDataProviderName(request.providerID)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getDatasetNameById(request.datasetID)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
