import PaymentsChart from "@/app/ui/paymentChart";
import {
  getAllPayments,
  getAllTokenRequests,
  getDataProviderName,
  getDatasetNameById,
  getDatasetProviderById,
  getUser,
} from "@/lib/data";
import { Payment, TokenRequest } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import {
  CheckCircleIcon,
  CircleX,
  ClockIcon,
  RedoIcon,
  CreditCardIcon,
  GlobeIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return null;
  }

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

  const mongoUser = await getUser(userId);
  const admin = mongoUser.admin;

  if (!admin) {
    return redirect("/dashboard");
  }

  let payments: Payment[] = await getAllPayments();
  let token_requests: TokenRequest[] = await getAllTokenRequests();

  if (payments) {
    payments.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  if (token_requests) {
    token_requests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  console.log(payments);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-8 font-bold text-gray-800">
          Clearing house
        </h1>
        <h1 className="text-xl mb-8 flex items-center">
          <CreditCardIcon className="inline-block mr-2" />
          Transaction view
        </h1>
        <div className="bg-white outline outline-8 outline-[#f9fafb] rounded-sm overflow-hidden">
          <table className="min-w-full bg-white border border-[#f9fafb]">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Data Consumer
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Requested At
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Data Provider
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Token Generated At
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Dataset
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-left text-sm text-gray-900">
                  Amount
                </th>
                <th className="py-3 px-4 bg-[#f9fafb] text-center text-sm text-gray-900">
                  Paid Success
                </th>
              </tr>
            </thead>
            <tbody>
              {payments &&
                payments.map(async (payment) => (
                  <tr key={payment.id} className="border-t border-[#f3f4f6]">
                    <td className="py-5 px-4 text-base text-gray-600">
                      {await getDataProviderName(payment.userId)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {await getDatasetProviderById(payment.datasetId)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {formatDate(payment.tokenCreatedAt)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {await getDatasetNameById(payment.datasetId)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {payment.amount}$
                    </td>
                    <td className="py-5 px-4 text-center text-base text-gray-600">
                      {payment.paymentStatus ? (
                        <CheckCircleIcon className="text-green-500 inline-block" />
                      ) : (
                        <CircleX className="text-red-600 inline-block" />
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-xl mb-8 flex items-center">
          <GlobeIcon className="inline-block mr-2" />
          Token tracker
        </h1>
        <div className="bg-white outline outline-8 outline-[#f9fafb] rounded-sm overflow-hidden">
          <table className="min-w-full bg-white border border-[#f9fafb]">
            <thead>
              <tr>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Token Requester
                </th>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Token Requested At
                </th>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Token Provider
                </th>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Token Status
                </th>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Price
                </th>
                <th className="py-4 px-4 bg-[#f9fafb] text-left text-sm text-gray-900 border-b border-[#f9fafb]">
                  Token Request Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {token_requests &&
                token_requests.map(async (token_request) => (
                  <tr
                    key={token_request.id}
                    className="border-t border-[#f9fafb]"
                  >
                    <td className="py-5 px-4 text-base text-gray-600">
                      {await getDataProviderName(token_request.reqUserID)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {formatDate(token_request.createdAt)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {await getDataProviderName(token_request.providerID)}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {token_request.status == "accepted" && (
                        <CheckCircleIcon className="text-green-500 inline-block" />
                      )}
                      {token_request.status == "declined" && (
                        <CircleX className="text-red-600 inline-block" />
                      )}
                      {token_request.status == "pending" && (
                        <ClockIcon className="text-yellow-400 inline-block" />
                      )}
                    </td>
                    <td className="py-5 px-4 text-base text-gray-600">
                      {token_request.status === "accepted"
                        ? token_request.amount === 0
                          ? "Free"
                          : token_request.amount + "$"
                        : "-"}
                    </td>

                    <td className="py-5 px-4 text-base text-gray-600">
                      {token_request.reason}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-20">
          <PaymentsChart payments={payments} />
        </div>
      </div>
    </>
  );
}
