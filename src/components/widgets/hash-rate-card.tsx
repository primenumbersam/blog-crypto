"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function HashRateCard() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHashRateChart = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("https://api.blockchain.info/charts/hash-rate?timespan=3years&format=json&sampled=true&cors=true");
      const data = await response.json();
      
      const labels = data.values.map((v: any) => {
        const date = new Date(v.x * 1000);
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      });

      const values = data.values.map((v: any) => v.y / 1000000); // Convert TH/s to EH/s

      setChartData({
        labels,
        datasets: [
          {
            label: "Hash Rate (EH/s)",
            data: values,
            borderColor: "rgb(249, 115, 22)", // orange-500
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to fetch hash rate chart:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHashRateChart();
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
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            return `Hash Rate: ${val !== null ? val.toFixed(2) : "N/A"} EH/s`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { size: 10 },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { size: 10 },
          maxTicksLimit: 6,
        },
      },
    },
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" /> Hash Rate (3Y)
          </div>
          <button onClick={() => fetchHashRateChart()} disabled={loading}>
            <RefreshCcw className={loading ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] pt-4">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
            Failed to load chart data
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </CardContent>
    </Card>
  );
}
