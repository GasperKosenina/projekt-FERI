"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Payment } from "@/lib/definitions";
import { getDataProviderName } from "@/lib/data"; // Import the function to get provider names

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PaymentsChartProps {
  payments: Payment[];
}

const PaymentsChart: React.FC<PaymentsChartProps> = ({ payments }) => {
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const names: { [userId: string]: string } = {};
      await Promise.all(
        payments.map(async (payment) => {
          if (!names[payment.userId]) {
            const name = await getDataProviderName(payment.userId);
            names[payment.userId] = name ?? "Unknown User";
          }
        })
      );
      setUserNames(names);
    };

    fetchUserNames();
  }, [payments]);

  // Aggregate payments by user
  const aggregatedPayments: { [userId: string]: number } = payments.reduce(
    (acc, payment) => {
      if (payment.paymentStatus === false) {
        return acc;
      }
      if (!acc[payment.userId]) {
        acc[payment.userId] = 0;
      }
      acc[payment.userId] += payment.amount;
      return acc;
    },
    {} as { [userId: string]: number }
  );

  const userIds = Object.keys(aggregatedPayments);
  const userNamesList = userIds.map((userId) => userNames[userId] ?? userId);
  const amounts = Object.values(aggregatedPayments);

  const data = {
    labels: userNamesList,
    datasets: [
      {
        label: "Payments by User",
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "How much each user has spent",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default PaymentsChart;
