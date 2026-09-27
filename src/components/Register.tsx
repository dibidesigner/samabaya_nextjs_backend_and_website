"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import {
  LuMail,
  LuUser,
  LuPhone,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLoader,
  LuCheck,
  LuArrowRight,
  LuSparkles,
} from "react-icons/lu";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";

export default function Register({ onclick }: { onclick: () => void }) {
  const [email, setEmail] = useState("");
  const [otpfield, setOtpfield] = useState(false);
  const [field, setField] = useState<"email" | "personaldetails">("email");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const [fullname, setFullName] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [pass, setPass] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [gender, setGender] = useState("Male");
  const [errormsg, setErrormsg] = useState("");
  const [loading, setLoading] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleGetOtp = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setErrormsg("");
      const res = await axiosInstance.post(ApiList.registerotp, email);
      if (res?.data?.error) {
        setErrormsg(res?.data?.error);
      }
      if (res?.data?.success) {
        setOtpfield(true);
        toast.success("OTP verification code sent!");
      }
    } catch (error) {
      toast.error("OTP Request Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const newotp = otp.join("");

    if (newotp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    const payload = { email, newotp };

    try {
      setLoading(true);
      const res = await axiosInstance.post(ApiList.registerotpverification, payload);
      if (res?.data?.success) {
        setOtpSuccess(true);
        toast.success("Email verified successfully!");
        setTimeout(() => setField("personaldetails"), 1000);
      } else {
        toast.error("Invalid OTP code. Please check and try again.");
      }
    } catch (error) {
      toast.error("OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const registernow = async () => {
    try {
      if (!fullname || !mobileno || !pass || !confirmpass || !gender) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (pass.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      if (pass !== confirmpass) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);
      const payload = { email, fullname, mobileno, gender, pass, confirmpass };
      const res = await axiosInstance.post(ApiList.register, payload);

      if (res?.data?.success) {
        toast.success("Account created successfully! Please log in.");
        onclick();
      } else {
        toast.error(res?.data?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center"
    >
      <div className="text-center mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">Create Account</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Join Sisupalgarh Cooperative Store for fresh groceries & member discounts.
        </p>
      </div>

      {field === "email" && (
        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <LuMail className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpfield}
              />
            </div>
          </div>

          {errormsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
              {errormsg}
            </div>
          )}

          {otpfield && (
            <div className="flex flex-col items-center gap-2 my-1">
              <span className="text-xs font-bold text-slate-700">Enter 6-Digit Email Verification Code</span>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    placeholder="0"
                    className={`w-10 h-12 border ${
                      otpSuccess ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-slate-300 bg-slate-50 text-slate-900"
                    } font-bold rounded-xl text-center text-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none shadow-xs transition-all`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
            </div>
          )}

          {!otpfield ? (
            <button
              type="button"
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <LuLoader size={16} className="animate-spin" />
                  <span>Sending OTP Code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP Verification Code</span>
                  <LuArrowRight size={15} />
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <LuLoader size={16} className="animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <LuCheck size={16} />
                    <span>Verify Code & Continue</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGetOtp}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold text-center mt-1 cursor-pointer"
              >
                Didn&apos;t receive code? Resend OTP
              </button>
            </div>
          )}
        </div>
      )}

      {field === "personaldetails" && (
        <div className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <LuUser className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Enter full name"
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number *
            </label>
            <div className="relative flex items-center">
              <LuPhone className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Enter 10-digit mobile number"
                onChange={(e) => setMobileno(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative flex items-center">
                <LuLock className="absolute left-3.5 text-slate-400" size={15} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min 6 chars"
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <LuEyeOff size={14} /> : <LuEye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative flex items-center">
                <LuLock className="absolute left-3.5 text-slate-400" size={15} />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPass ? <LuEyeOff size={14} /> : <LuEye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    gender === g
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={registernow}
            disabled={loading}
            className="w-full mt-3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <LuLoader size={16} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <LuSparkles size={16} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-5 text-center text-xs text-slate-500 font-semibold">
        Already have an account?{" "}
        <button
          onClick={onclick}
          className="text-emerald-700 hover:text-emerald-800 font-extrabold cursor-pointer hover:underline ml-1"
        >
          Sign In Here
        </button>
      </div>
    </motion.div>
  );
}
