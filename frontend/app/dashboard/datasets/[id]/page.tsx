import Breadcrumbs from "@/app/ui/breadcrumbs";
import { findById, generate, getUser} from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Modal1 from "@/app/ui/modal_jsonschema";
import Modal2 from "@/app/ui/modal_success";
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
                  <a href={dataset.url} className="text-blue-500 hover:underline">
                    {dataset.url}
                  </a>
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Data Provider</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {await getDataProvider(dataset.userID)}
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
                  {dataset.duration} seconds
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
                  {price}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(dataset.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Vključitev prve modalne komponente */}
        <Modal1 description={dataset.description} />


        <div className="flex flex-col items-start mt-10">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg inline-flex items-center">
            Buy now with 
            <span className="ml-2 text-blue-700 font-bold italic" style={{ fontFamily: "Arial" }}>Pay</span>
            <span className="text-blue-400 font-bold italic" style={{ fontFamily: "Arial" }}>Pal</span>
          </button>
        </div>
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
