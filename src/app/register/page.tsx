"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Image from "next/image";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { useRouter } from "next/navigation";
import Loader from '@/components/UI/Loader';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const formFields = [
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      type: "text",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
        }
      },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters"
        }
      },
    }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await login(data.email, data.password);
      
      // Check if OTP verification is required
      if (response.requiresOtp) {
        // Redirect to OTP verification page with email
        const encodedEmail = encodeURIComponent(data.email);
        router.push(`/verify/${encodedEmail}`);
      } else {
        // Direct login successful, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-[50%] w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-[40px] w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full text-base"
        >
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="logo" width={137} height={130} className='' />
            <h2 className="text-[32px] font-bold mt-4">Welcome back!</h2>
            <p className="text-gray-600 mt-2 text-center">
              Login to access all your data
            </p>
          </div>

          <div className='flex flex-col gap-[24px]'>
            {formFields.map((field, index) => (
              <Input key={index} field={field} index={index} errors={errors} register={register} col={18} />
            ))}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}

          <div className="mt-6 flex justify-center">
            <Button bg="dark-blue" text="white" type="submit">
              {isLoading ? <Loader /> : "Login"}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account? 
              <span
                className="text-blue-600 ml-1 cursor-pointer"
                onClick={() => router.push('/register')}
              >
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <div className="px-4 mx-auto sm:px-8 flex justify-center bg-[url('/Marble_bg.png')] bg-cover bg-center min-h-screen min-w-1/3 items-center">
      <LoginForm />
    </div>
  );
};

export default Page;



