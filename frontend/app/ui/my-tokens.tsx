import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';




export default async function MyTokens() {

  const latestInvoices = [
    { id: 1, name: "John Doe", email: "john@example.com", amount: "$500.00", image_url: "/john.jpg" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", amount: "$750.00", image_url: "/jane.jpg" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", amount: "$600.00", image_url: "/alice.jpg" },
    { id: 4, name: "Bob Brown", email: "bob@example.com", amount: "$900.00", image_url: "/bob.jpg" },
    { id: 5, name: "Eve White", email: "eve@example.com", amount: "$800.00", image_url: "/eve.jpg" }
  ];



  return (
    <div className="flex w-full flex-col md:col-span-4">
      <strong className="mb-4 text-lg text-blue-700">
        Purchased Datasets
      </strong>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`truncate text-sm font-medium md:text-base`}
                >
                  {invoice.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
