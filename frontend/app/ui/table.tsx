export default async function InvoicesTable({ query }: { query: string; }) {


  const datasets = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      amount: '€500',
      date: '2024-04-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      amount: '€750',
      date: '2024-04-05',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      amount: '€1200',
      date: '2024-04-10',
    }
  ];


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
                    <div className="mb-2 flex items-center">
                      <p>{dataset.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{dataset.email}</p>
                  </div>

                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {dataset.amount}
                    </p>
                    <p>{dataset.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Dataset
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Data Provider
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
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
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{dataset.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dataset.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dataset.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {dataset.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
