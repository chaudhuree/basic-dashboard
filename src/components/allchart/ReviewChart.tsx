import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts'; // Import the type for proper typing

// Dynamically load ReactApexChart to prevent SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ReviewChart: React.FC = () => {
  const [series] = useState<number[]>([90, 31, 10]); // Define series as an array of numbers

  // Define options with correct types
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar', // Correctly specify type as "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '50%', // You can adjust the size as needed
        },
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: () => {
              // Custom formatter
              return '249';
            },
          },
        },
      },
    },
    labels: ['Apples', 'Oranges', 'Bananas'],
    colors: ['#A75AE6', '#FF8C00', '#FF2E31'],
  };

  return (
    <div className="w-[200px]">
      <div id="chart">
        {/* Pass options and series correctly */}
        <ReactApexChart options={options} series={series} type="radialBar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ReviewChart;
