"use client";
import { paypal, createPayment } from "@/lib/data";
import { Payment } from "@/lib/definitions";

interface FreeAccessButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: string | undefined;
}

export default function FreeAccessButton({
  datasetId,
  payee,
  amount,
}: FreeAccessButtonProps) {
  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!datasetId) {
      return;
    }
    if (!payee || !amount) {
      return;
    }
    const payment: Payment = await createPayment(datasetId, parseFloat(amount));
    window.location.href = `http://localhost:3000/dashboard/paypal/success?datasetId=${datasetId}&payment_id=${payment.id}`;
  };

  return (
    <form onSubmit={handlePay}>
      <button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center"
      >
        Get Access
      </button>
    </form>
  );
}
