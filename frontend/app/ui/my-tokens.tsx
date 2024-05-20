import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getPurchasedDatasets } from '@/lib/data';
import { Dataset } from '@/lib/definitions';
import { auth, clerkClient } from '@clerk/nextjs/server';


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


  const datasetsLength = purchasedDatasets.length;



  return (
    <div className="flex w-full flex-col md:col-span-4">
      <strong className="mb-4 text-lg text-blue-600">
        Purchased Datasets
      </strong>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {purchasedDatasets.map(async (dataset, i) => {
            return (
              <div
                key={dataset.id}
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
                      {dataset.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      <span>{(await getDataProvider(dataset.userID))}</span>
                    </p>
                  </div>
                </div>
                <p
                  className={`truncate text-sm font-medium md:text-base`}
                >
                  {dataset.category}
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
