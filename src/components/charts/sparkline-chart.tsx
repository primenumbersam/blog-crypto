"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface SparklineChartProps {
  data: number[];
  color: string;
}

export default function SparklineChart({ data, color }: SparklineChartProps) {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2, // 곡선 처리
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: {
        fill: false,
      },
    },
    animation: false, // 성능을 위해 애니메이션 비활성화
  };

  return (
    <div className="h-8 w-24">
      <Line data={chartData} options={options} />
    </div>
  );
}
