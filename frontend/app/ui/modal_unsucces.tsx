import { useState } from "react";
import CheckmarkSuccess from "./checkmark-logo"; // Uvoz CheckmarkSuccess
import { ButtonComponent } from "./button";
import { getUser, updateTokenRequestStatus } from "@/lib/data";

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  tokenReqId: string;
  paymentId: string;
  datasetId: string;
  reqUser: string | null;
}

export default function Modal2(props: ModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  if (props.tokenReqId === undefined) {
    console.error("No ID found");
    return null;
  }

  const handleSubmit = () => {
    if (selectedOption === "paid") {
      updateTokenRequestStatus(
        props.tokenReqId,
        props.datasetId,
        props.paymentId,
        "accepted",
        parseFloat(price)
      );
    } else if (selectedOption === "free") {
      updateTokenRequestStatus(
        props.tokenReqId,
        props.datasetId,
        props.paymentId,
        "accepted",
        0
      );
    }
    props.toggleModal();
  };

  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="relative bg-white p-6 rounded shadow-lg w-3/4 max-w-2xl">
            <button
              className="absolute top-2 right-6 text-gray-500 hover:text-red-600 text-4xl"
              onClick={props.toggleModal}
            >
              &times;
            </button>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-500">
                Token Requested
              </h2>
              <p className="text-lg mb-6">
                <strong>{props.reqUser}</strong> has requested a token. Please
                choose one of the following options to proceed:
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tokenOption"
                    value="paid"
                    checked={selectedOption === "paid"}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  Give Token for a Price
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tokenOption"
                    value="free"
                    checked={selectedOption === "free"}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  Give Token for Free
                </label>
              </div>
              {selectedOption === "paid" && (
                <div className="flex justify-center mt-4">
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="Enter price in $"
                    className="border rounded p-2"
                  />
                </div>
              )}
              <div className="flex justify-center space-x-4 mt-8">
                <ButtonComponent
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-16 py-2 rounded"
                >
                  Proceed
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
