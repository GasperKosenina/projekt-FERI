"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { TokenRequest } from "@/lib/definitions";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface TokenChartProps {
  tokenRequests: TokenRequest[];
}

const TokenChart: React.FC<TokenChartProps> = ({ tokenRequests }) => {
  const [statusData, setStatusData] = useState<{ [status: string]: number }>(
    {}
  );

  useEffect(() => {
    const aggregateByStatus: { [status: string]: number } = {};

    tokenRequests.forEach((request) => {
      const status = request.status;
      aggregateByStatus[status] = (aggregateByStatus[status] || 0) + 1;
    });

    setStatusData(aggregateByStatus);
  }, [tokenRequests]);

  // Data for the pie chart
  const pieChartData = {
    labels: Object.keys(statusData),
    datasets: [
      {
        label: "Token Requests by Status",
        data: Object.values(statusData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)", // Pending
          "rgba(75, 192, 192, 0.6)", // Accepted
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Declined
          "rgba(255, 206, 86, 1)", // Pending
          "rgba(75, 192, 192, 1)", // Accepted
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Token requests by status",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw as number;
            const total = Object.values(statusData).reduce(
              (acc, v) => acc + v,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "500px", height: "500px", marginTop: "50px" }}>
      <Pie data={pieChartData} options={pieChartOptions} />
    </div>
  );
};

export default TokenChart;
