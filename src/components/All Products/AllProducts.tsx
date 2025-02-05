"use client"
import { useAllProductsQuery } from '@/Redux/Api/productApi';
import React from 'react';
import Loader from '../Loader/Loader';
import ProductCard from '../ProductCard/ProductCard';
import { ProductInterFace } from '@/Interfaces/InterFaces';

const AllProducts = () => {

    const { result, isLoading } = useAllProductsQuery({},
        {
            selectFromResult: ({ data, isLoading }) => ({
                result: data?.data,
                isLoading: isLoading
            })
        }
    )
    console.log(result);


    return (
        <div className='my-10'>
            <h1 className='text-3xl font-semibold text-center my-5'>All Products</h1>
            <div className=' lg:px-10 md:px-7 px-4'>
            {
                isLoading ?
                    <Loader className='w-96 flex justify-center mx-auto'></Loader>
                    :
                    result?.length > 0 ?
                        <div className='flex flex-wrap justify-start gap-5'>
                            {
                                result.map((item: ProductInterFace, index: number) =>
                                    <ProductCard key={index} item={item}></ProductCard>
                                )
                            }
                        </div>
                        :
                        <h1 className='text-center text-lg mt-5'>No Product Found</h1>
            }
            </div>
        </div>
    );
};

export default AllProducts;