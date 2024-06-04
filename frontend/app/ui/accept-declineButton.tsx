"use client";

import { updateTokenRequestStatus } from "@/lib/data";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal2 from "./modal_unsucces";
import { Dataset } from "@/lib/definitions";

interface AcceptDeclineButtonProps {
  id: string | undefined;
  paymentId: string | undefined;
  datasetId: string | undefined;
  dataset: Dataset | undefined;
  reqUser: string | null;
}

export default function AcceptDeclineButton(props: AcceptDeclineButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(event: any) {
    event.preventDefault();
    const buttonType = event.nativeEvent.submitter.value;

    if (props.id === undefined) {
      console.error("No ID found");
      return;
    }

    if (props.datasetId === undefined) {
      console.error("No dataset ID found");
      return;
    }

    if (props.paymentId === undefined) {
      console.error("No payment ID found");
      return;
    }

    if (buttonType === "accept") {
      setIsModalOpen(true);
    }

    if (buttonType === "decline") {
      updateTokenRequestStatus(
        props.id,
        props.datasetId,
        props.paymentId,
        "declined",
        0
      );
      toast.success("Token request declined");
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (props.dataset === undefined) {
    console.error("No dataset found");
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          name="accept"
          value="accept"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Accept
        </button>
        <button
          type="submit"
          name="decline"
          value="decline"
          className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
        >
          Decline
        </button>
      </form>
      <Modal2
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        tokenReqId={props.id as string}
        datasetId={props.datasetId as string}
        paymentId={props.paymentId as string}
        reqUser={props.reqUser}
        duration={props.dataset.duration}
      />
    </div>
  );
}
