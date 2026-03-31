"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FngData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export default function FearGreedChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFng = async () => {
      try {
        const response = await fetch("https://api.alternative.me/fng/?limit=30");
        const json = await response.json();
        const rawData: FngData[] = json.data;

        // Data is usually newest first, so reverse it for the chart
        const sortedData = [...rawData].reverse();

        const labels = sortedData.map((d) => {
          const date = new Date(parseInt(d.timestamp) * 1000);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const values = sortedData.map((d) => parseInt(d.value));

        setChartData({
          labels,
          datasets: [
            {
              label: "Fear & Greed Index",
              data: values,
              borderColor: "rgb(59, 130, 246)", // primary color (blue-500)
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 5,
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch Fear & Greed data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFng();
  }, []);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const val = context.parsed.y;
            if (val === null || val === undefined) return "";
            
            let status = "";
            if (val <= 25) status = "Extreme Fear";
            else if (val <= 45) status = "Fear";
            else if (val <= 55) status = "Neutral";
            else if (val <= 75) status = "Greed";
            else status = "Extreme Greed";
            
            return `Value: ${val} (${status})`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
    },
  };

  if (loading) {
    return <Skeleton className="w-full h-full rounded-xl" />;
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[250px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
