'use client'
import React from 'react';
import Image from 'next/image';
// import Link from 'next/link';
// import { ProductCardInterFace } from '@/interface/table.type';
import Swal from 'sweetalert2';
import { ProductInterFace } from '@/Interfaces/InterFaces';
import { useDeleteProductMutation } from '@/Redux/Api/productApi';
import { useRouter } from 'next/navigation';
// import { useProductDeleteMutation } from '@/redux/features/products/productsApi';

const ProductCard = ({ item }: { item: ProductInterFace }) => {

    const route = useRouter()

    const [deleteFn] = useDeleteProductMutation()


    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            const { data, error } = await deleteFn(id)

            if (data) {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }
            }
            if (error) {
                Swal.fire({
                    title: "Unsuccessful",
                    text: "Your file has not deleted.",
                    icon: "error"
                });
            }


        });
    }

    return (
        <div key={item.id} className='w-72 p-2 bg-white border-2 rounded-lg space-y-2 border-color/30 flex flex-col overflow-hidden relative'>

            <Image src={item?.productImage} width={100} height={80} alt={`${item?.name}`} className='w-full h-60 object-contain' />
            <h1 className='text-lg '><span className='font-semibold'>Name: </span>{item?.name}</h1>
            <p className=''><span className='font-semibold'>Price: </span>{item?.price}</p>
            <p className=''><span className='font-semibold'>Stock: </span>{item?.inStock}</p>
            {/* <h1 className='font-semibold flex-1 h-full'>{item?.category?.categoryName}</h1> */}
            <button onClick={() => handleDelete(item.id.toString())} className='w-full py-2 rounded-lg bg-green-600 text-white font-semibold'>Delete</button>
            <button onClick={()=> route.push(`/update/${item?.id}`)} className='w-full py-2 rounded-lg bg-green-600 text-white font-semibold'>Update</button>
        </div>
    );
};

export default ProductCard;