// src/app/verify/[email]/page.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/UI/Button";
import { useParams, useRouter } from "next/navigation";
import OtpInput from "./Input";
import Loader from "@/components/UI/Loader";
import { useAuth } from "@/context/AuthContext";

function OTPForm() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { verifyOtp, initiateLogin } = useAuth();

  const onOtpSubmit = async (otp) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await verifyOtp(email, otp.toString());
      router.push("/"); // Redirect to homepage after successful verification
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMessage(error?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await initiateLogin(email);
      alert("OTP has been resent to your email");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setErrorMessage(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-[50%] w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-[40px] w-full">
        <div className="flex flex-col items-center p-6 rounded w-full">
          <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="logo" width={137} height={130} className='' />
            <h2 className="text-[32px] font-bold mt-4">OTP Verification</h2>
            <p className="text-gray-600 mt-2 text-center">
              Enter the verification code we just sent to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <OtpInput onOtpSubmit={onOtpSubmit} />

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}

          <div className="mt-6 flex justify-center w-full">
            <Button 
              bg="dark-blue" 
              text="white" 
              onClick={() => {}} // The OtpInput component will handle submission
              type="button"
            >
              {isLoading ? <Loader /> : "Verify"}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Didn't receive the code? 
              <span 
                className="text-blue-600 ml-1 cursor-pointer" 
                onClick={handleResendOtp}
              >
                Resend
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <div className="px-4 mx-auto sm:px-8 flex justify-center bg-[url('/Marble_bg.png')] bg-cover bg-center min-h-screen min-w-1/3 items-center">
      <OTPForm />
    </div>
  );
};

export default Page;



