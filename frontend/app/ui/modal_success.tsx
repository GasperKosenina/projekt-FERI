"use client";

import { useState } from "react";
import { ButtonComponent } from "./button";
import CheckmarkSuccess from './checkmark-logo'; // Uvoz CheckmarkSuccess

interface ModalProps {
  accessToken: string;
}

export default function Modal2({ accessToken }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <ButtonComponent
        className="bg-gray-400 hover:bg-gray-500 active:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-5"
        onClick={toggleModal}
      >
        Open Modal
      </ButtonComponent>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="relative bg-white p-6 rounded shadow-lg w-3/4 max-w-2xl">
            <button
              className="absolute top-2 right-6 text-gray-500 hover:text-red-600 text-4xl"
              onClick={toggleModal}
            >
              &times;
            </button>
            <div className="p-4 text-center">
              <div className="flex justify-center mb-4">
                <CheckmarkSuccess /> {/* Zamenjava CheckCircleIcon z CheckmarkSuccess */}
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment successful</h2>
              <h3 className="text-xl font-semibold mb-2">Your access token</h3>
              <strong className="break-words">{accessToken}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}