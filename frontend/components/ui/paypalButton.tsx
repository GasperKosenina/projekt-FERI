"use client";
import { paypal } from "@/lib/data";

interface PaymentButtonProps {
  datasetId: string | undefined;
}

export default function PaymentButton({ datasetId }: PaymentButtonProps) {
  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!datasetId) {
      return;
    }
    const approvalUrl = await paypal(datasetId);
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
  };

  return (
    <form onSubmit={handlePay}>
      <button
        type="submit"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
      >
        Pay
      </button>
    </form>
  );
}
