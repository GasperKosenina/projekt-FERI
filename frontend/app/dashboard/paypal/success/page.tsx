import { createPayment, findById, generate } from "@/lib/data";
import { Dataset } from "@/lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const datasetId = searchParams?.datasetId;

  if (datasetId == null) {
    return <p>Dataset not found</p>;
  }

 const paymentId = await createPayment(datasetId);

 // get by id

 // 

  const dataset: Dataset = await findById(datasetId);
  console.log(dataset.description);


  const access_token = await generate(dataset.accessToken);

  if (access_token == null) {
    return <p>Napaka</p>;
  }

  console.log(access_token);
  return (
    <div>
      <h1>Payment successful!</h1>
      <p>Thank you for your payment.</p>
      {access_token.access_token}
    </div>
  );
}
