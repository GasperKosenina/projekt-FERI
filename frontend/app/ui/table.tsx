import { Dataset } from "@/lib/definitions";
import {
  getDataProviderName,
  getDataProviderPicture,
  listAll,
} from "@/lib/data";
import Link from "next/link";
import { clerkClient } from "@clerk/nextjs/server";
import { getUser } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

function formatDate(dateString: any) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Table({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  const { userId } = auth();

  if (!userId) {
    console.error("No user ID found");
    return;
  }

  const mongoUser = await getUser(userId);
  const tipUserja = mongoUser.type;

  let datasets: Dataset[] = [];

  const data = await listAll();
  if (data) {
    datasets = data;
  }

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.show === true &&
      dataset.name.toLowerCase().includes(query.toLowerCase()) &&
      (category ? dataset.category === category : true)
  );

  if (filteredDatasets.length === 0) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-2xl">No datasets found</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {filteredDatasets?.map((dataset) => (
              <div
                key={dataset.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <Link href={`/dashboard/datasets/${dataset.id}`}>
                      <div className="mb-2 flex items-center">
                        <strong>{dataset.name}</strong>
                      </div>
                    </Link>
                    <p className="text-sm text-gray-500">{dataset.userID}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDate(dataset.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-sm text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-4 sm:pl-6 text-grey-800"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 sm:pl-6 text-grey-800"
                >
                  Category
                </th>
                <th scope="col" className="px-3 py-4 text-grey-800">
                  Data Provider
                </th>
                <th scope="col" className="px-3 py-4 text-grey-800">
                  Purpose
                </th>
                <th scope="col" className="px-3 py-4 text-grey-800">
                  Price
                </th>
                <th scope="col" className="px-3 py-4 text-grey-800">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredDatasets?.map(async (dataset) => (
                <>
                  {dataset.price.map(async (priceItem, index) => {
                    if (
                      (tipUserja === "individual" &&
                        priceItem.purpose === "Machine learning") ||
                      (tipUserja === "company" &&
                        priceItem.purpose ===
                        "Business analytics (commercial)") ||
                      (tipUserja === "research-institution" &&
                        priceItem.purpose ===
                        "Research (using dataset for scientific research)" ||
                        priceItem.purpose ===
                        "Machine Learning") ||
                      ((tipUserja === "public-administration" ||
                        tipUserja === "state-administration") &&
                        priceItem.purpose === "Public administration processes")
                    ) {
                      return (
                        <tr
                          key={`${dataset.id}_${index}`}
                          className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                          <td className="whitespace-nowrap py-5 pl-6 pr-3">
                            <div className="flex items-center gap-3 hover:text-gray-500">
                              <Link
                                href={`/dashboard/datasets/${dataset.id}?purpose=${priceItem.purpose}&price=${priceItem.price}`}
                              >
                                <strong>{dataset.name}</strong>
                              </Link>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-5">
                            {dataset.category.charAt(0).toUpperCase() +
                              dataset.category.slice(1)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5">
                            <span className="flex items-center gap-2">
                              <Image
                                src={await getDataProviderPicture(
                                  dataset.userID
                                )}
                                alt="Picture of the data provider"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                              {await getDataProviderName(dataset.userID)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5">
                            {priceItem.purpose}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5">
                            {priceItem.price === 0
                              ? "Free"
                              : priceItem.price + " $"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5">
                            {formatDate(dataset.createdAt)}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
