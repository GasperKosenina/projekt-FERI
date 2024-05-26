"use client";

import { updateTokenRequestStatus } from "@/lib/data";
import toast from "react-hot-toast";

interface AcceptDeclineButtonProps {
  id: string | undefined;
}

export default function AcceptDeclineButton(props: AcceptDeclineButtonProps) {
  function handleSubmit(event: any) {
    event.preventDefault();
    const buttonType = event.nativeEvent.submitter.value;

    if (props.id === undefined) {
      console.error("No ID found");
      return;
    }

    if (buttonType === "accept") {
      updateTokenRequestStatus(props.id, "accepted");
      toast.success("Token request accepted");
    }

    if (buttonType === "decline") {
      updateTokenRequestStatus(props.id, "declined");
      toast.success("Token request declined");
    }
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
    </div>
  );
}
