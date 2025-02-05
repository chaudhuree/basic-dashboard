'use client'
// import { OrderInterFace, PaymentTableInterFace } from '@/utils/Interfaces';
import React, { useState } from 'react';
// import { UserInterFace } from '@/utils/InterFaces';
import { motion } from 'framer-motion'
// import {  useUserStatusUpdateMutation } from '../Redux/Api/userApi';
import Lottie from 'lottie-react';
import loader from '@/assests/loader.json'
// import Loader from '../Loader/Loader.json';
import { useUserStatusUpdateMutation } from '@/Redux/Api/userApi';
import { UserInterFace } from '@/Interfaces/InterFaces';
import ShowToastify from '@/utils/ShowToastify';
import { ToastContainer } from 'react-toastify';
import Loader from '../Loader/Loader';

const UserTable = ({ userData, isLoading, serial }: { userData: UserInterFace[], isLoading: boolean, serial: number }) => {

    const [updateStatus] = useUserStatusUpdateMutation()

    const handleStatus = async (id: string, status: string) => {

        if (status == "BLOCKED") {
            const { error, data } = await updateStatus({ id, status: "ACTIVATE" })
            console.log(data);

            if (error) {
                return ShowToastify({ error: "Unsuccessful to block or active the user" })
            }
            ShowToastify({ success: "User is active now" })
            return
        }
        const { error, data } = await updateStatus({ id, status: "BLOCKED" })
        console.log(data);
        if (error) {
            return ShowToastify({ error: "Unsuccessful to block or active the user" })
        }
        ShowToastify({ success: "User is blocked now" })

    }

    return (
        <div className="overflow-x-auto overflow-hidden">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Serial</th>
                        <th className="px-4 py-2 border">User Email</th>
                        <th className="px-4 py-2 border">User Name</th>
                        <th className="px-4 py-2 border">Role</th>
                        <th className="px-4 py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ?
                        <tr>
                            <td colSpan={7} className='text-center'>
                                <Loader className={`w-36`}></Loader>
                            </td>
                        </tr>
                        :
                        userData?.map((item: UserInterFace, index: number) => (
                            <motion.tr initial={{ y: 100 * (index + 1), opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }} key={index} className="border-b text-center">
                                <td className="px-4 text-nowrap py-2">{serial + index + 1}</td>
                                <td className="px-4 text-nowrap py-2">{item?.email}</td>
                                <td className="px-4 text-nowrap py-2">{item?.phone}</td>
                                <td className="px-4 text-nowrap py-2">{item?.role}</td>
                                <td className="px-4 text-nowrap py-2"><button onClick={() => handleStatus(item?.id, item?.status)} className='px-4 py-1 hover:scale-105 transition-transform font-semibold rounded-lg bg-primary text-white'>{item.status == "BLOCKED" ? "Active" : "Block"}</button></td>

                                {/* <td className="px-4 py-2">{item.createdAt.split("T")[0]}</td> */}
                            </motion.tr>
                        ))}
                </tbody>
            </table>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default UserTable;



