import { createPayment, findById, generate, getPaymentById, updateToken } from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import { getPayment } from "@/app/ui/paymentOnlyOnce";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const datasetId = searchParams?.datasetId;

  if (datasetId == null) {
    return <p>Dataset not found</p>;
  }

  const createPayment = await getPayment(datasetId);
  console.log(createPayment)


  const dataset: Dataset = await findById(datasetId);


  const payment = await getPaymentById(createPayment.id)

  let access_token;


  if (!payment.accessToken) {
    access_token = await generate(dataset.accessToken);
    updateToken(createPayment.id);
  }




  if (access_token == null) {
    return <p>You have already receive your access token!</p>;
  }

  return (
    <div>
      <h1>Payment successful!</h1>
      <p>Thank you for your payment.</p>
      {access_token.access_token}
    </div>
  );
}