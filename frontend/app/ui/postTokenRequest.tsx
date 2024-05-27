"use client";
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
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tokenrequest: TokenRequest | undefined = await postTokenRequest(
      datasetId,
      userId,
      providerId,
      paymentId
    );

    if (tokenrequest) {
      toast.success("Your token request has been sent. Redirecting...");
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      window.location.href = "/dashboard/notifications";
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <ButtonComponent type="submit">Request New Token</ButtonComponent>
    </form>
  );
}
