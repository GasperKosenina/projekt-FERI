import { getDatasetsLengthByUser } from '@/lib/data';
import { Dataset, Payment } from '@/lib/definitions';
import { getPaymentsByUser, getPurchasedDatasets } from '@/lib/data';
import { auth } from '@clerk/nextjs/server';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const numberOfCustomers = 10;



  const { userId } = auth();
  if (!userId) {
    console.error("No user ID found");
    return;
  }


  let datasets: Dataset[] = [];
  const data = await getDatasetsLengthByUser(userId);
  if (data) {
    datasets = data;
  }

  let dolzina = datasets.length;

  const payments: Payment[] = await getPaymentsByUser(userId);




  let vsota = 0;
  const unikatniKupci = new Set<string>();

  if (payments) {
    for (const i of payments) {
      vsota = vsota + i.amount;
      unikatniKupci.add(i.userId)
    }
  }

  const zasluzek = vsota + "$";

  let purchasedDatasets: Dataset[] = [];
  const data2 = await getPurchasedDatasets(userId);
  if (data2) {
    purchasedDatasets = data2;
  }


  const purchasedDatasetsLength = purchasedDatasets.length;




  return (
    <>
      <Card title="Total Datasets" value={dolzina} type="invoices" />
      <Card title="Earned" value={zasluzek} type="collected" />
      <Card title="You have access to" value={purchasedDatasetsLength} type="invoices" />
      <Card
        title="Unique customers"
        value={unikatniKupci.size}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
