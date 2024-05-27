import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getPurchasedDatasets, getPaymentByDataset } from '@/lib/data';
import { Dataset, Payment } from '@/lib/definitions';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';


async function getDataProvider(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user.username;
  }
  catch (error) {
    return ("No Data Provider")
  }
}




export default async function MyTokens() {
  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  let purchasedDatasets: Dataset[] = [];
  const data = await getPurchasedDatasets(userId);
  if (data) {
    purchasedDatasets = data;
  }





  const payments: Payment[] = await Promise.all(
    purchasedDatasets.map(async (dataset) => {
      return await getPaymentByDataset(dataset.id || '', userId);
    })
  );


  let validPurchasedDatasets: Dataset[] = [];

  validPurchasedDatasets = purchasedDatasets.filter(dataset => {
    const payment = payments.find(p => p.datasetId === dataset.id);
    if (!payment || !payment.tokenCreatedAt) return false;

    const tokenExpirationTime = new Date(payment.tokenCreatedAt).getTime() + dataset.duration * 60 * 60 * 1000;
    const currentTime = Date.now();

    return currentTime < tokenExpirationTime;
  });

  const datasetsLength = validPurchasedDatasets.length;



  return (
    <div className="flex w-full flex-col md:col-span-4">
      <strong className="mb-4 text-lg text-blue-600">
        Dataset Access
      </strong>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {datasetsLength === 0 ? (
          <p className="truncate text-sm font-semibold md:text-base">
            You do not have access to any datasets!
          </p>
        ) : (
          <div className="bg-white px-6">
            {validPurchasedDatasets.map(async (dataset, i) => {
              return (
                <div
                  key={dataset.id}
                  className={clsx('flex flex-row items-center justify-between py-4', {
                    'border-t': i !== 0,
                  })}
                >
                  <div className="flex items-center">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/datasets/purchased/${dataset.id}`}
                      >
                        <p className="truncate text-sm font-semibold md:text-base hover:text-gray-500">{dataset.name}</p>
                      </Link>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        <span>{await getDataProvider(dataset.userID)}</span>
                      </p>
                    </div>
                  </div>
                  <p className={`truncate text-sm font-medium md:text-base`}>{dataset.category}</p>
                </div>
              );
            })}
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
