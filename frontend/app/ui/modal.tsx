"use client";

import { useState } from "react";
import { ButtonComponent } from "./button";

interface ModalProps {
  description: any;
}

export default function Modal({ description }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const descriptionJson = typeof description === "object" ? JSON.stringify(description, null, 2) : description;

  return (
    <div>
      <ButtonComponent
        className="bg-gray-400 hover:bg-gray-500 active:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-5"
        onClick={toggleModal}
      >
        Show JSON schema
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
            <h2 className="text-xl font-bold mb-4">Dataset Description</h2>
            <div className="bg-gray-200 p-4 rounded overflow-y-auto max-h-96">
              <pre className="text-sm">
                {descriptionJson}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
