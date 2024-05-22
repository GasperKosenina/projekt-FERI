"use client";

import { useState } from "react";
import { ButtonComponent } from "./button";
import FreeAccessButton from "./freeAccessButton";

interface ModalProps {
  dataset: any;
  datasetId: string;
  amount: string | undefined;
  mongoUser: any;
  userId: any;
  purpose: string | undefined;
}
export default function RequestFreeAccess({
  dataset,
  datasetId,
  amount,
  mongoUser,
  userId,
  purpose,
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const payee = mongoUser.email;

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
              The dataset may only be used for: <strong>{purpose}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-3">
              After successfully generated access token you will have access to
              data for: <strong>{dataset.duration} hours</strong>
            </p>
            <p className="text-sm text-gray-500">
              By clicking the button below you will be generated perosnal access
              token
            </p>
            <div className="mt-10">
              {mongoUser.id !== userId && (
                <FreeAccessButton
                  datasetId={datasetId}
                  payee={mongoUser.email}
                  amount={amount}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
