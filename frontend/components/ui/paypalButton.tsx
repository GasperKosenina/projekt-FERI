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

      <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center">
        Buy now with
        <span className="ml-2 text-blue-700 font-bold italic" style={{ fontFamily: "Arial" }}>Pay</span>
        <span className="text-blue-400 font-bold italic" style={{ fontFamily: "Arial" }}>Pal</span>
      </button>
    </form>
  );
}
