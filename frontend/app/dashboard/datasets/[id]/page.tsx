import Breadcrumbs from "@/app/ui/breadcrumbs";
import {
  findById,
  generate,
  getDataProviderName,
  getPaymentByDataset,
  getUser,
} from "@/lib/data";
import { Dataset, Payment } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Modal1 from "@/app/ui/modal_jsonschema";
import PaymentButton from "@/components/ui/paypalButton";
import RequestAccess from "@/app/ui/request-access";
import RequestFreeAccess from "@/app/ui/request-free-access";
import Link from "next/link";

async function getDataProvider(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.username;
  } catch (error) {
    return "No Data Provider";
  }
}

function formatDate(dateString: any) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return <div>Check your connection</div>;
  }
  const id = params.id;

  let purpose = searchParams?.purpose;
  let price = searchParams?.price;

  const dataset: Dataset | undefined = await findById(id);

  if (dataset == undefined) {
    return <p>Dataset not found</p>;
  }

  const mongoUser = await getUser(dataset.userID);

  const payment: Payment = await getPaymentByDataset(
    dataset.id as string,
    userId
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Datasets", href: "/dashboard/datasets" },
          {
            label: "Details",
            href: `/dashboard/datasets/${id}`,
            active: true,
          },
        ]}
      />

      <div>
        <div className="mt-8 mx-auto w-full max-w-full bg-white overflow-hidden sm:rounded-lg outline outline-1 outline-gray-200">
          <div className="outline outline-1 border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {dataset.name}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">URL</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={dataset.url}
                    className="text-blue-500 hover:underline"
                  >
                    {dataset.url}
                  </a>
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Data Provider
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {await getDataProviderName(dataset.userID)}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {dataset.category}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {dataset.duration == -1
                    ? "Unlimited"
                    : dataset.duration + " hours"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {purpose}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {price === "0" ? "Free" : price + "$"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(dataset.createdAt)}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Dataset description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Modal1 description={dataset.description} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {payment.id ? (
          <div className="flex flex-col mt-8">
            <span>You have already purchased this dataset. </span>
            <Link href={`/dashboard/datasets/purchased/${dataset.id}`}>
              <span className="text-blue-500 hover:underline">
                If you want to request access again, click here
              </span>
            </Link>
          </div>
        ) : price === "0" ? (
          <RequestFreeAccess
            dataset={dataset}
            datasetId={id}
            amount={price}
            mongoUser={mongoUser}
            userId={userId}
            purpose={purpose}
            dataProvider={(await getDataProviderName(dataset.userID)) || ""}
          />
        ) : (
          <RequestAccess
            dataset={dataset}
            datasetId={id}
            amount={price}
            mongoUser={mongoUser}
            userId={userId}
            purpose={purpose}
            dataProvider={(await getDataProviderName(dataset.userID)) || ""}
          />
        )}
      </div>
    </main>
  );
}
