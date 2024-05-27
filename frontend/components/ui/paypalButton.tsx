"use client";

import { paypal, createPayment } from "@/lib/data";
import { useState } from "react";

interface PaymentButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: string | undefined;
  isCheckboxChecked: boolean; // Add this prop
}

export default function PaymentButton({
  datasetId,
  payee,
  amount,
  isCheckboxChecked, // Use this prop
}: PaymentButtonProps) {

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCheckboxChecked) {
      alert("You must agree to the GDPR terms and conditions before proceeding.");
      return;
    }
    if (!datasetId) {
      return;
    }
    if (!payee || !amount) {
      return;
    }
    setIsButtonDisabled(true);

    const payment = await createPayment(datasetId, parseFloat(amount));
    const approvalUrl = await paypal(datasetId, payee, amount, payment.id);
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
  };

  console.log(isButtonDisabled)

  return (
    <form onSubmit={handlePay}>
      <button
        type="submit"
        className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center ${(!isCheckboxChecked || isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isCheckboxChecked || isButtonDisabled}
      >
        {isButtonDisabled ? (
          "Loading..."
        ) : (
          <>
            Buy now with
            <span className="ml-2 text-blue-700 font-bold italic" style={{ fontFamily: "Arial" }}>Pay</span>
            <span className="text-blue-400 font-bold italic" style={{ fontFamily: "Arial" }}>Pal</span>
          </>
        )}
      </button>
    </form>
  );
}
