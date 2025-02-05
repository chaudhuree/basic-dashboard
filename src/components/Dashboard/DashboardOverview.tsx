'use client';

import { useState } from "react";
import DeliveryChart from "@/components/allchart/CompletedChart";
import LineChart from "@/components/allchart/LineChart";
// import { useGetAllOrdersQuery } from "../Redux/Api/eventApi";
import CountUp from "react-countup";
import CompletedChart from "@/components/allchart/CompletedChart";
import { useOrderHistoryQuery } from "@/Redux/Api/productApi";
// import { useGetAllOrdersQuery } from "@/Redux/Api/eventApi";

export default function DashboardOverview() {
  const [selectedValue, setSelectedValue] = useState<string>('this-month');
  // const { data } = useGetAllOrdersQuery({})
  const today = new Date().toISOString()
  const runningEvent = 0;
  const completedEvent = 0;

  const { allOrder, isloading } = useOrderHistoryQuery("", {
    selectFromResult: ({ data, isLoading }) => ({
      allOrder: data?.data?.length,
      isloading: data?.isLoading
    })
  })
  const { completedOrder } = useOrderHistoryQuery("DELIVERED", {
    selectFromResult: ({ data }) => ({
      completedOrder: data?.data?.length,
      // isloading: data?.isLoading
    })
  })
  const { shippedOrder } = useOrderHistoryQuery("SHIPPED", {
    selectFromResult: ({ data }) => ({
      shippedOrder: data?.data?.length,
      // isloading: data?.isLoading
    })
  })
  const { pendingOrder } = useOrderHistoryQuery("PENDING", {
    selectFromResult: ({ data }) => ({
      pendingOrder: data?.data?.length,
      // isloading: data?.isLoading
    })
  })


  console.log(completedOrder, shippedOrder, pendingOrder, allOrder);
  

  


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="pt-8 pb-32 lg:px-0 px-3">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-2  gap-6 ">
          {/* Card 1 */}
          <div className="w-full bg-white rounded-xl shadow-md">
            <div className="relative p-6 border-2 h-full rounded-xl">
              <div className="space-y-4 font-poppins">
                <h3 className="text-xl font-medium text-gray-900">Total Order Created</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold tracking-tight"> <CountUp end={allOrder} /></span>
                  <span className="text-lg text-gray-500">Orders</span>
                </div>
                {/* <p className="text-base text-gray-600">Total 10 services are featured</p> */}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full bg-white l rounded-xl shadow-md">
            <div className="relative p-6 border-2 h-ful rounded-xl">
              <div className="space-y-4 font-poppins">
                <h3 className="text-xl font-medium text-gray-900">Total Completed Order</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold tracking-tight"><CountUp end={completedOrder} /></span>
                  <span className="text-lg text-gray-500">Orders</span>
                </div>
                {/* <p className="text-base text-gray-600">Across all categories</p> */}
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full bg-white rounded-xl shadow-md">
            <div className="relative p-6 border-2 h-ful rounded-xl">
              <div className="space-y-4 font-poppins">
                <h3 className="text-xl font-medium text-gray-900">Total Pending Order</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold tracking-tight"><CountUp end={pendingOrder} duration={3}></CountUp></span>
                  <span className="text-lg text-gray-500">Orders</span>
                </div>
                {/* <p className="text-base text-gray-600">Orders waiting for approval</p> */}
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-xl shadow-md">
            <div className="relative p-6 border-2 h-ful rounded-xl">
              <div className="space-y-4 font-poppins">
                <h3 className="text-xl font-medium text-gray-900">Total Shipped Order</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold tracking-tight"><CountUp end={shippedOrder} duration={3}></CountUp></span>
                  <span className="text-lg text-gray-500">Orders</span>
                </div>
                {/* <p className="text-base text-gray-600">Orders waiting for approval</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <CompletedChart totalEvent={allOrder} completedEvent={completedOrder} />
        </div>
        <div className="mt-8">
          <LineChart />
        </div>
      </div>
    </div>
  );
}
