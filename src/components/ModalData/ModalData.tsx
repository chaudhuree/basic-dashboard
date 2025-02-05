/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react';

const ModalData = ({address, userInfo}: {address:any, userInfo:any}) => {
    return (
        <section className='space-y-3 text-xl'>
            <h1><span className='font-semibold'>Name: </span>{userInfo?.name}</h1>
            <h1><span className='font-semibold'>Email: </span>{userInfo?.email}</h1>
            <h1><span className='font-semibold'>Address: </span>{address?.address}</h1>
            <h1><span className='font-semibold'>City: </span>{address?.city}</h1>
            <h1><span className='font-semibold'>Country: </span>{address?.country}</h1>
            <h1><span className='font-semibold'>Phone: </span>{address?.phone}</h1>
        </section>
    );
};

export default ModalData;