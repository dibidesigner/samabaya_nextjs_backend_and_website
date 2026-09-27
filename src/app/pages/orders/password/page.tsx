"use client";

import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { useState, useRef } from "react";
import MobileNavigation from "../MobileNavigation";
import {
  LuLock,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuKeyRound,
  LuCheck,
  LuCircleAlert,
  LuLoader,
  LuArrowRight,
} from "react-icons/lu";

export default function Password() {
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [otpnumber, setOtpNumber] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const passwordChange = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!password || !confirmpassword) {
        setMessage("Please enter both password fields.");
        setSuccess(false);
        return;
      }
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters long.");
        setSuccess(false);
        return;
      }
      if (password !== confirmpassword) {
        setMessage("Passwords do not match. Please verify.");
        setSuccess(false);
        return;
      }

      const payload = { password, confirmpassword };
      const res = await axiosInstance.put(ApiList.password, payload);

      setMessage(res.data.message || "OTP has been sent to your registered contact.");
      setSuccess(true);
      setOtpNumber(true);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const OtpVerification = async () => {
    try {
      setLoading(true);
      setMessage("");

      const otpValue = otp.join(""); // Convert array to string

      if (!password || !confirmpassword || otpValue.length < 6) {
        setMessage("Please enter the complete 6-digit OTP code.");
        setSuccess(false);
        return;
      }
      if (password !== confirmpassword) {
        setMessage("Passwords do not match.");
        setSuccess(false);
        return;
      }

      const payload = { password, confirmpassword, otp: otpValue };
      const res = await axiosInstance.post(ApiList.password, payload);

      if (res.data.success === true) {
        setOtpNumber(false);
        setConfirmPassword("");
        setPassword("");
        setOtp(Array(6).fill("")); // reset OTP
        setMessage(res.data.message || "Password updated successfully!");
        setSuccess(true);
      } else {
        setMessage("Verification failed. Please check the OTP and try again.");
        setSuccess(false);
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "OTP verification failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace key for OTP
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <MobileNavigation />

      <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-soft">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-3 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Password & Security Manager
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Update your account login password with 2-Factor OTP verification.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <LuShieldCheck size={15} className="text-emerald-600" />
            <span>Encrypted & Secure</span>
          </div>
        </div>

        {/* Center Container */}
        <div className="max-w-md mx-auto w-full flex flex-col items-center">
          
          {/* Security Header Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
            <LuKeyRound size={28} />
          </div>

          <h3 className="text-base font-extrabold text-slate-900 text-center mb-1">
            Change Account Password
          </h3>
          <p className="text-xs text-slate-400 text-center mb-6 max-w-xs font-medium">
            Enter a new strong password below. An OTP verification code will be dispatched to your account.
          </p>

          {/* Feedback Message Alert */}
          {message && (
            <div
              className={`w-full mb-6 p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {success ? (
                <LuCheck size={16} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <LuCircleAlert size={16} className="text-rose-600 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <div className="w-full flex flex-col gap-4">
            
            {/* New Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <LuLock className="absolute left-3.5 text-slate-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={otpnumber}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <LuLock className="absolute left-3.5 text-slate-400" size={16} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={otpnumber}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              </div>
            </div>

            {/* OTP Verification Section */}
            {otpnumber && (
              <div className="mt-2 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col items-center gap-3">
                <label className="text-xs font-extrabold text-emerald-900">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputsRef.current[index] = el;
                      }}
                      placeholder="0"
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 h-12 text-center border border-emerald-200 bg-white rounded-xl text-base font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            {otpnumber ? (
              <button
                onClick={OtpVerification}
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <LuLoader size={16} className="animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <LuCheck size={16} />
                    <span>Verify & Confirm Password</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={passwordChange}
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <LuLoader size={16} className="animate-spin" />
                    <span>Generating OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Request Security OTP</span>
                    <LuArrowRight size={16} />
                  </>
                )}
              </button>
            )}

            {otpnumber && (
              <button
                type="button"
                onClick={() => setOtpNumber(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold text-center mt-1 cursor-pointer"
              >
                ← Back to edit password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
