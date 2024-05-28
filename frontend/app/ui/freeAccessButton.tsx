"use client";
import { paypal, createPayment } from "@/lib/data";
import { Payment } from "@/lib/definitions";
import { useState } from "react";
import "@/app/styles/spinner.css";

interface FreeAccessButtonProps {
  datasetId: string | undefined;
  payee: string | undefined;
  amount: string | undefined;
  isCheckboxChecked: boolean; // Add this prop
}

export default function FreeAccessButton({
  datasetId,
  payee,
  amount,
  isCheckboxChecked, // Use this prop
}: FreeAccessButtonProps) {

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

    const payment: Payment = await createPayment(datasetId, parseFloat(amount));
    window.location.href = `http://localhost:3000/dashboard/paypal/success?datasetId=${datasetId}&payment_id=${payment.id}`;
  };

  return (
    <form onSubmit={handlePay}>
      <button
        type="submit"
        className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center ${(!isCheckboxChecked || isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isCheckboxChecked || isButtonDisabled} // Disable button if checkbox is not checked
      >
        {isButtonDisabled ? (
          <>
            Loading...
            <div className="spinner"></div>
          </>
        ) : (
          "Get Access"
        )}
      </button>
    </form>
  );
}
