import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { getDatasetsByUser } from "@/lib/data";
import { Dataset } from "@/lib/definitions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

function formatDate(dateString: any) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MyDatasets() {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  let datasets: Dataset[] = [];
  const data = await getDatasetsByUser(userId);
  if (data) {
    datasets = data;
  }

  const datasetsLength = datasets?.length;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <strong className="mb-4 text-lg text-blue-500">Published Datasets</strong>
      <div className="flex-grow bg-gray-50 p-4 rounded-xl">
        {datasetsLength === 0 ? (
          <p className="truncate text-sm font-semibold md:text-base">
            You do not have any datasets published!
          </p>
        ) : (
          <div className="bg-white flex flex-col px-4">
            {datasets.map((dataset, i) => (
              <div
                key={dataset.id}
                className={clsx("flex items-center justify-between py-4", {
                  "border-t": i !== 0,
                })}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/datasets/published/${dataset.id}`}
                    >
                      <p className="truncate text-sm font-semibold md:text-base hover:text-gray-500">{dataset.name}</p>
                    </Link>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {formatDate(dataset.createdAt)}
                    </p>
                  </div>
                </div>
                <p className={`truncate text-sm font-medium md:text-base`}>
                  {dataset.category}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
