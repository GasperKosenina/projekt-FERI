import { getAllPayments, getDataProviderName, getDatasetNameById, getDatasetProviderById } from "@/lib/data";
import { Payment } from "@/lib/definitions";
import { CheckCircleIcon, CircleX, RedoIcon } from "lucide-react";

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

    const payments: Payment[] = await getAllPayments();
    
    if (payments) {
        payments.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }

    if (payments.length === 0) {
        return <p>no payments found...</p>;
    }

    console.log(payments);

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-8">Blockchain view</h1>
                <div className="bg-white outline outline-4 outline-[#f9fafb] rounded-lg overflow-hidden">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Data consumer</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Requested At</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Data provider</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Token Generated At</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Dataset</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Amount</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-center text-base text-gray-900">Paid Success</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(async payment => (
                                <tr key={payment.id} className="border-t">
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDataProviderName(payment.userId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{formatDate(payment.createdAt)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDatasetProviderById(payment.datasetId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{formatDate(payment.tokenCreatedAt)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDatasetNameById(payment.datasetId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{payment.amount}$</td>
                                    <td className="py-2 px-4 text-center text-base text-gray-600">
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
                <h1 className="text-2xl font-bold mb-8">Token tracker</h1>
                <div className="bg-white outline outline-4 outline-[#f9fafb] rounded-lg overflow-hidden">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Data consumer</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Purchased At</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Data provider</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Token Generated At</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Dataset</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-left text-base text-gray-900">Amount</th>
                                <th className="py-2 px-4 bg-[#f9fafb] text-center text-base text-gray-900">Paid Success</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(async payment => (
                                <tr key={payment.id} className="border-t">
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDataProviderName(payment.userId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{formatDate(payment.createdAt)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDataProviderName(payment.userId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{formatDate(payment.tokenCreatedAt)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{await getDatasetNameById(payment.datasetId)}</td>
                                    <td className="py-2 px-4 text-base text-gray-600">{payment.amount}$</td>
                                    <td className="py-2 px-4 text-center text-base text-gray-600">
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
        </>
    );
}