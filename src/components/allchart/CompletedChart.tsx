
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactApexChart with ssr: false
const ReactApexChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts'; 

const CompletedChart = ({ totalEvent, completedEvent }: { totalEvent: number, completedEvent: number }) => {

  // Define options with the correct type
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar', // Ensure type matches the literal type
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
      },
    },
    labels: ['Complete Order'],
    colors: ['#269612'],
  };

  return (
    <div className="w-[200px]">
      <div id="chart">
        {/* Use dynamically imported ReactApexChart component */}
        <ReactApexChartNoSSR options={options} series={[parseFloat(totalEvent && completedEvent ? ((completedEvent / totalEvent) * 100).toFixed(0) : "" ) || 0]} type="radialBar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default CompletedChart;
