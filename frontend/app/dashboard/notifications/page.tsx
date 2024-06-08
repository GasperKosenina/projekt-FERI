import AcceptDeclineButton from "@/app/ui/accept-declineButton";
import PaypalButton from "@/app/ui/paypalButton";
import RequestAccess2 from "@/app/ui/paypal_modal2";
import {
  findById,
  getAllAcceptedByUserId,
  getAllDeclinedByUserId,
  getAllPendingByUserId,
  getDataProviderName,
  getDatasetNameById,
  getUser,
  getUserEmail,
  updateTokenRequestAcceptedSeen,
  updateTokenRequestSeen,
} from "@/lib/data";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  RedoIcon,
  CreditCardIcon,
  GlobeIcon,
} from "lucide-react";
import { Dataset, TokenRequest } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";
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
      <h1 className="text-2xl mb-8 font-bold text-gray-800">Token Requests</h1>

      {/* Pending Requests Section */}
      <div className="mb-8">
        <div className="flex items-center mb-8">
          <ClockIcon className="inline-block mr-2" />
          <h1 className="text-xl text-gray-800">Pending Requests</h1>
        </div>
        <div className="bg-white rounded-sm outline outline-8 outline-[#f9fafb] overflow-hidden">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="py-3 px-4 text-left">Requested By</th>
                <th className="py-3 px-4 text-left">Requested At</th>
                <th className="py-3 px-4 text-left">Dataset</th>
                <th className="py-3 px-4 text-center">Reason</th>
                <th className="py-3 px-4 text-center">Accept/Decline</th>
              </tr>
            </thead>
            <tbody>
              {!pendingRequests || pendingRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-5 px-4 text-center text-gray-500"
                  >
                    No pending requests found
                  </td>
                </tr>
              ) : (
                pendingRequests.map(async (request) => {
                  if (request.seen === false) {
                    updateTokenRequestSeen(request.id as string);
                  }
                  return (
                    <tr key={request.id} className="border-t">
                      <td className="py-5 px-4">
                        {getDataProviderName(request.reqUserID)}
                      </td>
                      <td className="py-5 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-5 px-4">
                        {getDatasetNameById(request.datasetID)}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {request.reason}
                      </td>
                      <td className="py-5 px-4 text-center">
                        <AcceptDeclineButton
                          id={request.id}
                          paymentId={request.paymentID}
                          datasetId={request.datasetID}
                          dataset={await findById(request.datasetID)}
                          reqUser={
                            (await getDataProviderName(request.reqUserID)) || ""
                          }
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

      <div className="mt-28">
        {/* Accepted Requests Section */}
        <div className="w-full px-2 mb-8">
          <div className="flex items-center mb-8">
            <CheckCircleIcon className="inline-block mr-2" />
            <h1 className="text-xl text-gray-800">Accepted Requests</h1>
          </div>
          <div className="bg-white rounded-sm outline outline-8 outline-[#f9fafb] overflow-hidden">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="py-3 px-4 text-left">Accepted By</th>
                  <th className="py-3 px-4 text-left">Accepted At</th>
                  <th className="py-3 px-4 text-left">Dataset</th>
                  <th className="py-3 px-4 text-left">Get Token Access</th>
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
                  acceptedRequests.map(async (request) => {
                    if (request.acceptedSeen === false) {
                      updateTokenRequestAcceptedSeen(request.id as string);
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
                          <Link
                            href={`/dashboard/datasets/purchased/${request.datasetID}`}
                          >
                            <span className="underline cursor-pointer">
                              {getDatasetNameById(request.datasetID)}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          {request.amount === 0 ? (
                            <Link target="_blank" href={request.url || ""}>
                              <span className="text-blue-500 underline cursor-pointer">
                                Access for Free
                              </span>
                            </Link>
                          ) : request.payed === false ? (
                            <RequestAccess2
                              datasetId={request.datasetID}
                              payee={
                                (await getUserEmail(request.providerID)) || ""
                              }
                              paymentId={request.paymentID}
                              id={request.id as string}
                              amount={request.amount}
                            />
                          ) : (
                            <p className="text-green-500">Successfully paid</p>
                          )}
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
        <div className="w-full px-2 mb-8">
          <div className="flex items-center mb-8">
            <XCircleIcon className="inline-block mr-2" />
            <h1 className="text-xl text-gray-800">Declined Requests</h1>
          </div>
          <div className="bg-white rounded-sm outline outline-8 outline-[#f9fafb] overflow-hidden">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="py-3 px-4 text-left">Declined By</th>
                  <th className="py-3 px-4 text-left">Declined At</th>
                  <th className="py-3 px-4 text-left">Dataset</th>
                  <th className="py-3 px-4 text-left">
                    Your reason for a new token
                  </th>
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
                        <td className="py-3 px-4">{request.reason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
