import AcceptDeclineButton from "@/app/ui/accept-declineButton";
import {
  getAllPendingByUserId,
  getDataProviderName,
  getDatasetNameById,
} from "@/lib/data";
import { TokenRequest } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import { SquarePenIcon } from "lucide-react";

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

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">
          <SquarePenIcon className="w-8 h-8 inline-block mr-2" />
          Pending token requests for your datasets
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
                      <AcceptDeclineButton id={request.id} />
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
