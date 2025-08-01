"use client";

import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ onOtpSubmit }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow one digit
    if (value.length > 1) return;
    
    // Check if input is a number
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // If input filled, move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // If all inputs are filled, submit the OTP
    if (index === 5 && value) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 6) {
        onOtpSubmit(completeOtp);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted data is numeric and of expected length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus on appropriate input
      if (digits.length < 6) {
        inputRefs.current[digits.length].focus();
      } else {
        // Submit if full OTP is pasted
        onOtpSubmit(newOtp.join(''));
      }
    }
  };

  return (
    <div className="flex justify-center space-x-3 my-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-xl border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OtpInput;