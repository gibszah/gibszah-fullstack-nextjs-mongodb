// components/UI/DailyResultsChart.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DailyResultsChart = ({ data }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const labels = data.map((entry) => entry.date);
    const quantities = data.map((entry) => entry.result); // Tidak perlu lagi melakukan parsing di sini

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Quantity",
            data: quantities,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
            position: "bottom",
            title: {
              display: true,
              text: "Tanggal",
            },
          },
          y: {
            type: "linear",
            position: "left",
            title: {
              display: true,
              text: "Total Quantity",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} width={600} height={400}></canvas>;
};

export default DailyResultsChart;
