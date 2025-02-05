"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddProductMutation, useSingleProductQuery, useUpdateProductMutation } from "@/Redux/Api/productApi";
import ShowToastify from "@/utils/ShowToastify";
import { ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
const schema = z.object({
    name: z.string().min(1, "Product Name is required"),
    category: z.string().min(1, "Category is required"),
    color: z.string().min(1, "Color is required"),
    size: z.string().min(1, "Size is required"),
    price: z
        .number({ invalid_type_error: "Price must be a number" })
        .positive("Price must be greater than zero")
        .nonnegative("Price must be a positive number"),
    inStock: z
        .number({ invalid_type_error: "In Stock must be a number" })
        .nonnegative("In Stock must be a non-negative number"),
    description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;


export default function AddProduct() {
    const { id } = useParams()
    const { result } = useSingleProductQuery(id, {
        selectFromResult: ({ data }) => ({
            result: data?.data
        })
    })



    const [image, setImage] = useState<string | null>(null);
    const [productImage, setProductImage] = useState<File | null>();
    const fromData = new FormData()
    const [addProductFn] = useAddProductMutation()
    const [updateProductFn] = useUpdateProductMutation()

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            category: "",
            color: "",
            size: "",
            price: undefined,
            inStock: undefined,
            description: "",
        },
    });

    useEffect(() => {
        if (result) {
            reset({
                name: result.name || "",
                category: result.category || "",
                color: result.color || "",
                size: result.size.join(",") || "",
                price: result.price || undefined,
                inStock: result.inStock || undefined,
                description: result.description || "",
            });
            setImage(result?.productImage)
        }
    }, [result, reset]);

    const onSubmit = async (data: FormData) => {
        console.log(data);

        if (result) {
            console.log(data);
            const { size } = data
            const sizeArray = size.split(",")
            // data?.size = sizeArray
            fromData.append("bodyData", JSON.stringify({ ...data, size: sizeArray }))
            if (productImage) {
                fromData.append("productImage", productImage as File)
            }
            const { error, data: res } = await updateProductFn({ id: result?.id, data:fromData })
            if (error) {
                console.log(error);
                ShowToastify({ error: "Failed to update product" })
                return
            }
            if (res) {
                // reset()
                console.log(res);
                
                ShowToastify({ success: "Product update successfully" })
                return
            }
            return

        }

        const { size } = data
        const sizeArray = size.split(",")
        // data?.size = sizeArray
        fromData.append("bodyData", JSON.stringify({ ...data, size: sizeArray }))
        fromData.append("productImage", productImage as File)
        const { error, data: res } = await addProductFn(fromData)
        if (error) {
            console.log(error);
            ShowToastify({ error: "Failed to add product" })
            return
        }
        if (res) {
            reset()
            ShowToastify({ success: "Product added successfully" })
            return
        }

    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setProductImage(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => setImage(null);

    return (
        <div className="p-6  mx-auto  rounded-lg ">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-20">
                {/* Image Upload */}
                <div className="relative w-full mx-auto">
                    {image ? (
                        <div className="relative w-full h-60 border border-gray-300 rounded-lg overflow-hidden">
                            <Image src={image} alt="Preview" width={300} height={300} className="w-full h-full object-cover" />
                            <button
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                                type="button"
                                onClick={removeImage}
                            >
                                <MdDelete size={24} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition">
                            <span className="text-gray-600">Drag and drop or</span>
                            <span className="mt-2 px-4 py-2 bg-primary text-white rounded-lg">Select</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>

                {/* Form Inputs */}
                <div className="flex flex-col gap-4 col-span-2">
                    <div>
                        <label className="text-[17px] leading-6">Product Name</label>
                        <input
                            {...register("name")}
                            placeholder="Product Name"
                            defaultValue={result?.name}
                            className="p-3 border border-gray-300 rounded-lg w-full"
                        />
                        {errors.name && <p className="text-red-500">{errors?.name?.message}</p>}
                    </div>

                    <div>
                        <label className="text-[17px] leading-6">Product Category</label>
                        <select {...register("category")} className="p-3 border border-gray-300 rounded-lg w-full">
                            <option value="">Select a category</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Weed">Weed</option>
                        </select>
                        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[17px] leading-6">Product Color</label>
                            <input
                                {...register("color")}
                                placeholder="Color"
                                className="p-3 border border-gray-300 rounded-lg w-full"
                            />
                            {errors.color && <p className="text-red-500">{errors.color.message}</p>}
                        </div>
                        <div>
                            <label className="text-[17px] leading-6">Product Size (S, M, L, XL etc..)</label>
                            <input
                                {...register("size")}
                                placeholder="Size"
                                className="p-3 border border-gray-300 rounded-lg w-full"
                            />
                            {errors.size && <p className="text-red-500">{errors.size.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[17px] leading-6">Product Price</label>
                            <input
                                {...register("price", { valueAsNumber: true })}
                                placeholder="Price"
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg w-full"
                            />
                            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="text-[17px] leading-6">Product in Stock</label>
                            <input
                                {...register("inStock", { valueAsNumber: true })}
                                placeholder="In Stock"
                                type="number"
                                className="p-3 border border-gray-300 rounded-lg w-full"
                            />
                            {errors.inStock && <p className="text-red-500">{errors.inStock.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-[17px] leading-6">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Description"
                            className="p-3 border border-gray-300 rounded-lg w-full h-24"
                        />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                    >
                        Save
                    </button>
                </div>
            </form>
            <ToastContainer></ToastContainer>
        </div>
    );
}
