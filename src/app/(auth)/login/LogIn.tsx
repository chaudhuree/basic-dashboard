"use client";
import React, { FormEvent, useState } from "react";
import logo from "@/assests/logo.png";
import Image from "next/image";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
// import { useLoginUserMutation } from "@/components/Redux/Api/userApi";
import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/components/Redux/store";
// import { setUser } from "@/components/Redux/ReduxFunction";
import Cookies from "js-cookie"
import { useLoginUserMutation } from "@/Redux/Api/userApi";
import { AppDispatch } from "@/Redux/store";
import { logOut, setUser } from "@/Redux/ReduxFunction";
import ShowToastify from "@/utils/ShowToastify";
import { ToastContainer } from "react-toastify";

const LogIn = () => {
    const [checked, setChecked] = useState<boolean>(false);
    const [logIn, setLogIn] = useState<string>('Log in');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginFun] = useLoginUserMutation()
    const dispatch = useDispatch<AppDispatch>()
    const route = useRouter()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // e.stopPropagation()
        // const fromData = new FormData(e.currentTarget)
        // setLogIn("loading ...")
        // const email = fromData.get("email")
        // const password = fromData.get("password")
        // const loginData = { email, password }

        // const { data, error } = await loginFun(loginData)

        // if (error) {
        //     ShowToastify({ error: "Check your password or email address" })
        //     setLogIn("Log in")
        // }
        // if (data) {
        //     console.log(data);
            
        //     if (data?.data?.role != "SUPERADMIN") {
        //         ShowToastify({ error: "You are not authorize" })
        //         setLogIn("Log in")
        //         dispatch(logOut())
        //         return
        //     }
        //     dispatch(setUser({ name: data?.data?.name, role: data?.data?.role }))
        //     Cookies.set("accessToken", data?.data?.accessToken)
        //     route.push("/")
        // }
        route.push("/")
    }

    const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="w-full max-w-md p-6 ">
                <div className="flex flex-col items-center ">
                    <Image src={logo} alt="logo" className="mx-auto " width={300} />
                </div>

                <h2 className="text-4xl text-center my-4">Hi, Welcome Back! 👋</h2>
                <p className="text-center text-gray-600 mb-8">
                    Lets explore <span className='text-primary font-semibold text-lg'>Vegabuds</span> diversely
                </p>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-base font-medium text-gray-700"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full px-4 py-2 border bg-[#FCFCFD] border-gray-300 focus:outline-double rounded-md shadow-sm  focus:border-primary"
                            placeholder="georgia.young@example.com"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-base font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword == true ? "text" : "password"}
                                name="password"
                                required
                                className="mt-1 block w-full px-4 py-2 border bg-[#FCFCFD] focus:outline border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="Enter your password"
                            />
                            <div className='absolute right-3 top-3'>
                                <button type='button' className='text-xl' onClick={handleShowPassword}>{showPassword == false ? <IoEyeSharp /> : <FaEyeSlash />}</button>
                            </div>
                        </div>
                    </div>
                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                onChange={() => setChecked(!checked)}
                                className="h-4 w-4 text-primary border-gray-300 rounded bg-primary focus:ring-primary"
                                style={{
                                    backgroundColor: "#A554E6"
                                }}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember Me</span>
                        </label>
                        <a
                            href="/forget-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <button className="w-full bg-primary py-2 text-lg font-semibold text-white rounded-lg">{logIn}</button>
                </form>
                {/* Register Link */}
                
            </div>
            <ToastContainer />
        </div>
    );
};

export default LogIn;
