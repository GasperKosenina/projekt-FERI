"use client";

import { useState } from "react";
import { ButtonComponent } from "./button";
import PaymentButton from "@/components/ui/paypalButton";
import { Dataset } from "@/lib/definitions";

interface ModalProps {
  dataset: Dataset;
  datasetId: string;
  amount: string | undefined;
  mongoUser: any;
  userId: any;
  purpose: string | undefined;
  dataProvider: string | undefined
}

export default function RequestAccess({
  dataset,
  datasetId,
  amount,
  mongoUser,
  userId,
  purpose,
  dataProvider
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(event.target.checked);
  };

  return (
    <div>
      {mongoUser.id !== userId && (
        <ButtonComponent className="mt-5" onClick={toggleModal}>
          Request access
        </ButtonComponent>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="relative bg-white p-6 rounded shadow-lg w-3/4 max-w-2xl">
            <button
              className="absolute top-2 right-6 text-gray-500 hover:text-red-600 text-4xl"
              onClick={toggleModal}
            >
              &times;
            </button>
            <h2 className="font-bold mb-5">Are you absolutely sure?</h2>
            <p className="text-sm text-gray-500">
              Data provider: <strong>{dataProvider}</strong>
            </p>
            <p className="text-sm text-gray-500">
              The dataset may only be used for <strong>{purpose}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-3">
              After successful payment you will have access to data for {" "}
              <strong>
                {dataset.duration == -1
                  ? "unlimited time"
                  : dataset.duration + " hours"}
              </strong>
            </p>
            <p className="text-sm text-gray-500">
              By clicking the button below you will be redirected to Paypal
              where you will make the payment in the amount of{" "}
              <strong>{amount}$</strong>.
            </p>
            <div className="mt-5">
              <input
                type="checkbox"
                id="gdprCheckbox"
                checked={isCheckboxChecked}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="gdprCheckbox" className="text-sm text-gray-500">
                I agree to the{" "}
                <a
                  href="/gdpr"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  GDPR terms and conditions
                </a>
                .
              </label>
            </div>
            <div className="mt-5">
              {mongoUser.id !== userId && (
                <PaymentButton
                  datasetId={datasetId}
                  payee={mongoUser.email}
                  amount={amount}
                  isCheckboxChecked={isCheckboxChecked}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
