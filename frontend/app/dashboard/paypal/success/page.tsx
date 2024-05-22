import { findById, generate, getPaymentById, updateToken, updateStatus, updateTokenCreatedAt } from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import PaymentSuccess from "@/app/ui/showToken";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const datasetId = searchParams?.datasetId;
  const payment_id = searchParams?.payment_id;
  console.log(payment_id);

  if (datasetId == null) {
    return <p>Dataset not found</p>;
  }
  if (payment_id == null) {
    return <p>Payment not found</p>;
  }

  const dataset: Dataset = await findById(datasetId);
  const payment = await getPaymentById(payment_id);

  await updateStatus(payment_id);


  let access_token;

  if (!payment.accessToken) {
    access_token = await generate(dataset.accessToken);
    await updateToken(payment_id);
    await updateTokenCreatedAt(payment_id)
  }


  if (access_token == null) {
    return <p>You have already generated your access token!</p>;
  }

  //novo kompone

  return (
    <PaymentSuccess access_token={access_token.access_token} dataset={dataset} />
  );
}
