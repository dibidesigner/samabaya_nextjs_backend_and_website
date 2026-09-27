"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { LuMail, LuLoader, LuCheck, LuArrowRight, LuLock } from "react-icons/lu";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";

interface LoginWithOtpProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export default function LoginWithOtp({ onSuccess, onBackToLogin }: LoginWithOtpProps) {
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [field, setField] = useState<"mail" | "otp">("mail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mailResponse, setMailResponse] = useState("");

  const router = useRouter();

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setError("");
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

  const getotp = async () => {
    try {
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }

      setLoading(true);
      setError("");
      const res = await axiosInstance.post(ApiList.forgotpassword, email);
      if (res?.data?.success) {
        setMailResponse(res?.data?.message || "OTP code sent to your email!");
        setField("otp");
      } else {
        toast.error(res?.data?.message || "Failed to send OTP code");
        setField("mail");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const Login = async () => {
    try {
      const otpValue = otp.join("");
      if (!email || otpValue.length < 6) {
        toast.error("Please enter the complete 6-digit OTP code");
        return;
      }

      setLoading(true);
      setError("");
      const payload = { email, otp: otpValue };

      const res = await axiosInstance.post(ApiList.otplogin, payload);
      if (res?.data?.success) {
        toast.success("Logged in successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/");
          window.location.reload();
        }
      } else {
        setError(res?.data?.message || "Invalid OTP code");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "OTP Verification failed");
      toast.error("Something went wrong verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center"
    >
      {field === "mail" ? (
        <div className="w-full flex flex-col gap-4">
          <div className="text-center mb-1">
            <h3 className="text-base font-extrabold text-slate-900">OTP Quick Login</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Enter your registered email address to receive a 6-digit access code.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <LuMail className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={getotp}
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <LuLoader size={16} className="animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Get OTP Code</span>
                <LuArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-center mb-1">
            <h3 className="text-base font-extrabold text-slate-900">Verify OTP Code</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Enter the 6-digit verification code sent to <span className="font-bold text-slate-700">{email}</span>
            </p>
          </div>

          {mailResponse && (
            <div className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold text-center">
              {mailResponse}
            </div>
          )}

          {error && (
            <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-center my-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                placeholder="0"
                className="w-10 h-12 border border-slate-300 bg-slate-50 text-slate-900 font-bold rounded-xl text-center text-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none shadow-xs transition-all"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-2">
            <button
              type="button"
              onClick={Login}
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <LuLoader size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LuCheck size={16} />
                  <span>Verify & Login</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between px-1 mt-1">
              <button
                type="button"
                onClick={() => setField("mail")}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                ← Change Email
              </button>
              <button
                type="button"
                onClick={getotp}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}