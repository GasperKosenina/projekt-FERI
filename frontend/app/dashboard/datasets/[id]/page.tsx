import Breadcrumbs from "@/app/ui/breadcrumbs";
import { findById, generate, getUser} from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Modal from "@/app/ui/modal";
import PaymentButton from "@/components/ui/paypalButton";


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

  const dataset: Dataset = await findById(id);

  const mongoUser = await getUser(dataset.userID);

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
        <div className="mt-20 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Dataset
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataset.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                URL
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataset.url}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Data Provider
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <span>{await getDataProvider(dataset.userID)} </span>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Category
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataset.category}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Duration
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {dataset.duration} seconds
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Purpose
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {purpose}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Price
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {price}€
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Date
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {formatDate(dataset.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        <Modal description={dataset.description} />
      </div>
      <div className="mt-10">
        {mongoUser.id !== userId && (
          <PaymentButton
            datasetId={id}
            payee={mongoUser.email}
            amount={price}
          />
        )}
      </div>
    </main>
  );
}
