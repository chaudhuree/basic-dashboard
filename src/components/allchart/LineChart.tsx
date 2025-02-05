import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactApexChart with ssr: false
const ReactApexChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts'; // Import ApexOptions type

const LineChart: React.FC = () => {
  // State for series data
  const [series] = useState([
    {
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100],
      color: '#269612',
    },
    // {
    //   name: 'series2',
    //   data: [11, 32, 45, 32, 34, 52, 41],
    //   color: '#cc2182',
    // },
  ]);

  // Define options with the correct type
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area', // Ensure type matches the literal type
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime', // 'datetime', 'category', or 'numeric' are valid
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
    },
  };

  return (
    <div className="w-full">
      <div id="chart">
        {/* Dynamically imported ReactApexChart component */}
        <ReactApexChartNoSSR
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default LineChart;
