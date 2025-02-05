'use client'
import React, { useState } from 'react';
import { motion } from "motion/react"
import Loader from '../Loader/Loader';
import { useOrderHistoryQuery, useOrderStatusMutation } from '@/Redux/Api/productApi';
import ModalData from '../ModalData/ModalData';
import ShowToastify from '@/utils/ShowToastify';
import { ToastContainer } from 'react-toastify';

const TransactionTable = () => {
    const [status, setStatus] = useState<string>("");
    const [modal, setModal] = useState(false);
    const [orderId, setOrderId] = useState<number>(0);

    const { result: orderTable, isLoading } = useOrderHistoryQuery("",
        {
            selectFromResult: ({ data, isLoading }) => ({
                result: data?.data,
                isLoading: isLoading
            })
        }
    )

    const [orderStatusFn] = useOrderStatusMutation()

console.log(orderTable);


    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState<number>(1);
    // const today = new Date().toISOString().split("T")[0]

    const totalPages = orderTable && Math.ceil(orderTable?.length / itemsPerPage);

    const currentPageData = orderTable && orderTable?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleModal = (e: number) => {
        setOrderId(e)
        setModal(!modal)
    }

    const handleStatus = async (e: string, id: string) => {
        console.log(e);
        const status = {
            status: e
        }

        const { data, error } = await orderStatusFn({ id, status })
        if (data) {
            console.log(data);
            ShowToastify({ success: "Status Updated" })
        }
        if (error) {
            console.log(error);
            ShowToastify({ error: "Failed to update status" })
        }
    }

    return (
        <div className="overflow-x-auto ">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Serial</th>
                        <th className="px-4 py-2 border">Product Name</th>
                        <th className="px-4 py-2 border">Quantity</th>
                        <th className="px-4 py-2 border">Amount</th>
                        <th className="px-4 py-2 border">User Details</th>
                        <th className="px-4 py-2 border">Payment Date</th>
                        <th className="px-4 py-2 border">Action</th>
                        {/* <th className="px-4 py-2 border">Total Ticket</th>
                        <th className="px-4 py-2 border">Event Date</th> */}
                        {/* <th className="px-4 py-2 border">Amount</th> */}
                        {/* <th className="px-4 py-2 border">Purchase Date</th> */}
                    </tr>
                </thead>
                <tbody aria-colspan={15}>
                    {isLoading ?
                        <tr>
                            <td colSpan={7} className='text-center'>
                                <Loader className={`w-36`}></Loader>
                            </td>
                        </tr>
                        :
                        currentPageData?.map((item: any, index: number) => (
                            <motion.tr initial={{ y: 100 * (index + 1), opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }} key={index} className="border-b text-center">
                                <td className="px-4 text-nowrap py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 text-nowrap py-2">{item?.products[0]?.name}</td>
                                <td className="px-4 text-nowrap py-2">{item?.products[0]?.quantity}</td>
                                {/* <td className=" text-nowrap px-4 py-2">{item.order_id}</td> */}
                                <td className="px-4 text-nowrap py-2">{item.totalAmount}</td>
                                <td className="px-4 text-nowrap py-2"><span>Address: </span>{item?.address} <br /> <span>Phone: </span> {item?.phone}</td>

                                <td className="px-4 text-nowrap py-2">{item.createdAt.split("T")[0]}</td>
                                <td className="px-4 text-nowrap py-2">
                                    <select defaultValue={item?.status} name="" id="" onChange={(e) => handleStatus(e.target.value, item?.id)} className="px-2 py-1 border border-gray-300 rounded">
                                        <option value="">Select Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCEL">Cancel</option>
                                    </select>
                                </td>

                                {/* <td className="px-4 py-2">{item.total_tickets}</td>
                            <td className="px-4 py-2">{item.date}</td> */}

                                {/* <td className="px-4 py-2">{item.createdAt.split("T")[0]}</td> */}
                            </motion.tr>
                        ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded-l"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    {/* Page {currentPage} of {totalPages} */}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded-r"
                >
                    Next
                </button>
            </div>

            <dialog className='backdrop-blur-lg bg-transparent h-screen top-0 w-full' open={modal}>
                <div className='bg-green-600/10 text-black  rounded-xl border-2 w-fit mx-auto top-1/4 p-5 relative '>
                    <div className='text-lg font-extrabold text-end mt-5 mr-5'>
                        <button onClick={() => setModal(!modal)}>X</button>
                    </div>
                    {/* <UpdateSubscription id={id} /> */}
                    <ModalData address={currentPageData && currentPageData[orderId]?.shippingAddress} userInfo={currentPageData && currentPageData[orderId]?.userDetails}></ModalData>
                </div>
            </dialog>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default TransactionTable;

