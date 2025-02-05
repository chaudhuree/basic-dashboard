"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUploadMutation } from "@/Redux/Api/uploadApi";
import Image from "next/image";
import { X } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { useAddblogMutation, useUpdateBlogMutation } from "@/Redux/Api/blogApi";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddBlog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const blogId = searchParams.get("id");
  const blogTitle = searchParams.get("title") || "";
  const blogImage = searchParams.get("image") || "";

  const [addBlog] = useAddblogMutation();
  const [upload] = useUploadMutation();
  const [updateBlogFn] = useUpdateBlogMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    blogImage || null
  );
  const [imageName, setImageName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (blogId) {
      setFormData({ title: blogTitle, image: blogImage, description: "" });
    }
  }, [blogId, blogTitle, blogImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    setImagePreview(URL.createObjectURL(file));

    const formDataImage = new FormData();
    formDataImage.append("file", file);

    try {
      const response = await upload(formDataImage).unwrap();
      const imageUrl = response?.data?.url;
      if (imageUrl) {
        setImageName(imageUrl);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image URL provided in the response.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  const handleCancelImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (blogId) {
        await updateBlogFn({ id: blogId, data: formData }).unwrap();
        toast.success("Blog updated successfully!");
      } else {
        await addBlog(formData).unwrap();
        toast.success("Blog added successfully!");
        setFormData({ title: "", image: "", description: "" });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      router.push("/blog")
    } catch (error: any) {
      toast.error("Failed to add blog");
    }
  };

  return (
    <div className="p-6 mx-auto rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-[17px] leading-6 mb-6">
        {blogId ? "Edit Blog" : "Create Blog"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-20">
          <div className="relative w-full mx-auto">
            <label className="text-[17px] leading-6 mb-2 block">Blog Image</label>
            <div className="relative w-full h-60 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center hover:border-gray-600 transition bg-white">
              {imagePreview ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-gray-600">Drag and drop or</span>
                  <span className="mt-2 px-4 py-2 bg-primary text-white rounded-lg">Select</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 col-span-2">
            <div>
              <label htmlFor="name" className="text-[17px] leading-6">
                Blog Title
              </label>
              <input
                id="name"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full"
                placeholder="Blog Title"
              />
            </div>
            <div>
              <label className="text-[17px] leading-6">Blog Description</label>
              <div className="mt-1 rounded-lg border border-gray-300">
                <Editor
                  apiKey="g68nc1d1w7r6ws2cu6q6c6trlsejbpqf5dylpj1b8hjeoc7d"
                  initialValue="Blog description"
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 
                      'charmap', 'preview', 'anchor', 'help',
                      'searchreplace', 'media', 'table', 'code',
                      'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
              >
                {blogId ? "Update Blog" : "Add Blog"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
