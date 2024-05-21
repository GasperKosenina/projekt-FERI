"use client";
import { paypal, createPayment } from "@/lib/data";

interface PaymentButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: string | undefined;
}

export default function PaymentButton({
  datasetId,
  payee,
  amount,
}: PaymentButtonProps) {
  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!datasetId) {
      return;
    }
    if (!payee || !amount) {
      return;
    }
    const payment = await createPayment(datasetId, parseFloat(amount));
    const approvalUrl = await paypal(datasetId, payee, amount, payment.id);
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
