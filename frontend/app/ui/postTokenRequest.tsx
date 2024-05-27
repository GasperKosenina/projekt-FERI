"use client";
import { useState } from "react";
import { postTokenRequest } from "@/lib/data";
import { TokenRequest } from "@/lib/definitions";
import toast from "react-hot-toast";
import { ButtonComponent } from "./button";

interface PostTokenFormProps {
  datasetId: string;
  userId: string;
  providerId: string;
  paymentId: string;
}

export default function PostTokenForm({
  datasetId,
  userId,
  providerId,
  paymentId,
}: PostTokenFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (reason.length > 200) {
      toast.error("Reason must be less than 200 characters");
      return;
    }

    setIsSubmitting(true);
    const tokenrequest: TokenRequest | undefined = await postTokenRequest(
      datasetId,
      userId,
      providerId,
      paymentId,
      reason
    );

    if (tokenrequest) {
      toast.success("Your token request has been sent. Redirecting...");
      setReason(""); // Clear the input
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      window.location.href = "/dashboard/notifications";
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ButtonComponent onClick={toggleModal} disabled={isSubmitting}>
        Request New Token
      </ButtonComponent>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="relative bg-white p-6 rounded shadow-lg w-3/4 max-w-2xl">
            <button
              className="absolute top-2 right-6 text-gray-500 hover:text-red-600 text-4xl"
              onClick={toggleModal}
              disabled={isSubmitting}
            >
              &times;
            </button>
            <h2 className="font-bold mb-5">Reason for Token Request</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for your token request"
                required
                className="w-full p-2 border rounded mb-4"
                disabled={isSubmitting}
              />
              <div className="flex justify-end space-x-4">
                <ButtonComponent type="submit" disabled={isSubmitting}>
                  Submit
                </ButtonComponent>
                <ButtonComponent onClick={toggleModal} disabled={isSubmitting}>
                  Cancel
                </ButtonComponent>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
