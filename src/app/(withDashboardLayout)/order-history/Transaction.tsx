'use client'
import TransactionTable from '@/components/Table/TransactionTable';
import React from 'react';

const Transaction = () => {
    return (
        <div className='p-10 relative'>
        <h1 className='text-3xl font-semibold text-center mb-8'>Users Details</h1>
       <TransactionTable></TransactionTable>
    </div>
    );
};

export default Transaction;