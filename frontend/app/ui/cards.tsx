import { getDatasetsLengthByUser } from '@/lib/data';
import { Dataset } from '@/lib/definitions';
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
  const numberOfInvoices = 5;
  const numberOfCustomers = 10;
  const totalPaidInvoices ="70.99€";
  const totalPendingInvoices = 67;


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



  return (
    <>
      <Card title="Total Datasets" value={dolzina} type="invoices" />
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Total Invoices" value={totalPendingInvoices} type="pending" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
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
