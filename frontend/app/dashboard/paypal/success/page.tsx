import {
  findById,
  generate,
  getPaymentById,
  updateToken,
  updateStatus,
  updateTokenCreatedAt,
} from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import PaymentSuccess from "@/app/ui/showToken";
import Link from "next/link";

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
    access_token = await generate(dataset.accessToken, dataset.duration);
    await updateToken(payment_id);
    await updateTokenCreatedAt(payment_id);
  }

  if (access_token == null) {
    return (
      <div>
        <h1 className="text-left font-normal text-gray-500 mb-4" style={{ fontSize: '1.375rem' }}>Token Generation Issue</h1>
        <div className="rounded-lg p-6 bg-[#f9fafb]">
          <div className="mt-6 animate-bounce">
            <p className="text-center mt-10 text-xl text-grey-500">
              Uh-oh! ☹ You came across a problem. It looks like you've already generated an access token. If you need a new one, just click the button below to proceed. 
            </p>
          </div>
          <div className="flex justify-center mt-10 mb-8">
            <Link href={`/dashboard/datasets/purchased/${datasetId}`}>
              <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-[#60a5fa]">
                Request New Access Token
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PaymentSuccess
        access_token={access_token.access_token}
        dataset={dataset}
      />
    </div>
  );
}
