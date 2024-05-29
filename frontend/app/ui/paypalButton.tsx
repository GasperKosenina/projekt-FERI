"use client";

import { paypal } from "@/lib/data";

interface PaypalButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: number | undefined;
  paymentId: string | undefined;
}

export default function PaypalButton(props: PaypalButtonProps) {
  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!props.datasetId) {
      return;
    }
    if (!props.payee || !props.amount) {
      return;
    }

    if (!props.paymentId) {
      return;
    }

    const amount = String(props.amount);

    const approvalUrl = await paypal(
      props.datasetId,
      props.payee,
      amount,
      props.paymentId
    );
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
  };
  return (
    <div>
      <form onSubmit={handlePay}>
        <button
          type="submit"
          className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center`}
        >
          Buy now with
          <span
            className="ml-2 text-blue-700 font-bold italic"
            style={{ fontFamily: "Arial" }}
          >
            Pay
          </span>
          <span
            className="text-blue-400 font-bold italic"
            style={{ fontFamily: "Arial" }}
          >
            Pal
          </span>
        </button>
      </form>
    </div>
  );
}
