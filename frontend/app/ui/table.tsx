import { Dataset } from "@/lib/definitions";
import { listAll } from "@/lib/data";
import Link from "next/link";




function formatDate(dateString: any) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


export default async function Table({ query }: { query: string; }) {

  const datasets: Dataset[] = await listAll();
  //console.log(datasets)


  const filteredDatasets = datasets.filter(dataset => dataset.name.toLowerCase().includes(query.toLowerCase()));

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
                    <p className="text-xl">
                      {dataset.price} €
                    </p>
                    <p>{formatDate(dataset.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-8 font-medium sm:pl-6 text-blue-900">

                </th>
                <th scope="col" className="px-4 py-8 font-medium sm:pl-6 text-blue-900">
                  Category
                </th>
                <th scope="col" className="px-3 py-8 font-medium text-blue-900">
                  Data Provider
                </th>
                <th scope="col" className="px-3 py-8 font-medium text-blue-900">
                  Price
                </th>
                <th scope="col" className="px-3 py-8 font-medium text-blue-900">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredDatasets?.map((dataset) => (
                <tr
                  key={dataset.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <Link href={`/dashboard/datasets/${dataset.id}`}>
                    <td className="whitespace-nowrap py-10 pl-6 pr-3">
                      <div className="flex items-center gap-3 hover:text-slate-500">
                        <strong>{dataset.name}</strong>
                      </div>
                    </td>
                  </Link>

                  <td className="whitespace-nowrap px-3 py-10">
                    Izpis kategorije
                  </td>
                  <td className="whitespace-nowrap px-3 py-10">
                    {dataset.userID}
                  </td>
                  <td className="whitespace-nowrap px-3 py-10">
                    {dataset.price} €
                  </td>
                  <td className="whitespace-nowrap px-3 py-10">
                    {formatDate(dataset.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
