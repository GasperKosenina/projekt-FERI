"use client";

import { paypal, updateTokenRequestPayed } from "@/lib/data";
import { useState } from "react";
import "@/app/styles/spinner.css";


interface PaypalButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: number | undefined;
  paymentId: string | undefined;
  id: string | undefined;
  isCheckboxChecked: boolean;
}

export default function PaypalButton(props: PaypalButtonProps) {



  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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

    setIsButtonDisabled(true);

    const approvalUrl = await paypal(
      props.datasetId,
      props.payee,
      amount,
      props.paymentId
    );
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
    updateTokenRequestPayed(props.id as string);
  };
  return (
    <div>
      <form onSubmit={handlePay}>
        <button
          type="submit"
          className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center ${(!props.isCheckboxChecked || isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!props.isCheckboxChecked || isButtonDisabled}
        >
          {isButtonDisabled ? (
          <>
            Loading...
            <div className="spinner"></div>
          </>
        ) : (
          "Buy now with PayPal"
        )}
          
        </button>
      </form>
    </div>
  );
}
