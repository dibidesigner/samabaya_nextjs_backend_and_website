"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLoader,
  LuCheck,
  LuArrowRight,
  LuKeyRound,
  LuCircleAlert,
} from "react-icons/lu";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";

interface ForgotScreenProps {
  onBackToLogin?: () => void;
}

export default function ForgotScreen({ onBackToLogin }: ForgotScreenProps) {
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [email, setEmail] = useState("");
  const [otpfield, setOtpfield] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [mailresponse, setmailresponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Password fields
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  // Default field step
  const [field, setField] = useState<"mail" | "otp" | "changepassword" | "success">("mail");

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

  const getotp = async () => {
    try {
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }
      setLoading(true);
      const res = await axiosInstance.post(ApiList.forgotpassword, email);
      if (res?.data?.success) {
        setmailresponse(res?.data?.message || "OTP code sent to your email!");
        setOtpfield(true);
        setField("otp");
      } else {
        toast.error(res?.data?.message || "Failed to send reset code");
        setField("mail");
      }
    } catch (error: any) {
      toast.error("Something went wrong requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const newotp = otp.join("");

    if (newotp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    const payload = { email, newotp };

    try {
      setLoading(true);
      const res = await axiosInstance.post(ApiList.registerotpverification, payload);
      if (res?.data?.success) {
        setOtpSuccess(true);
        toast.success("OTP verified!");
        setField("changepassword");
      } else {
        toast.error("Invalid OTP code");
        setField("otp");
      }
    } catch (error) {
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const changepassword = async () => {
    try {
      if (!password || !cpassword) {
        toast.error("Please fill in both password fields");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      if (password !== cpassword) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);
      const payload = { emailid: email, password, cpassword };

      const res = await axiosInstance.post(ApiList.changepassword, payload);

      if (res?.data?.success) {
        setmailresponse(res?.data?.message || "Password changed successfully!");
        setField("success");
      } else {
        toast.error(res?.data?.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Something went wrong updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center"
    >
      {field === "mail" && (
        <div className="w-full flex flex-col gap-4">
          <div className="text-center mb-1">
            <h3 className="text-base font-extrabold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Enter your registered email address to receive password recovery code.
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
                <span>Send Reset Code</span>
                <LuArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      )}

      {field === "otp" && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-center mb-1">
            <h3 className="text-base font-extrabold text-slate-900">Enter Reset OTP</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Enter 6-digit verification code sent to <span className="font-bold text-slate-700">{email}</span>
            </p>
          </div>

          {mailresponse && (
            <div className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold text-center">
              {mailresponse}
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
                  <span>Verify Code</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between px-1 mt-1">
              <button
                type="button"
                onClick={() => setField("mail")}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                ← Back
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

      {field === "changepassword" && (
        <div className="w-full flex flex-col gap-4">
          <div className="text-center mb-1">
            <h3 className="text-base font-extrabold text-slate-900">Create New Password</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Set your new password to secure your account.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              New Password
            </label>
            <div className="relative flex items-center">
              <LuLock className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <LuLock className="absolute left-3.5 text-slate-400" size={16} />
              <input
                type={showCPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showCPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={changepassword}
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <LuLoader size={16} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <LuKeyRound size={16} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      )}

      {field === "success" && (
        <div className="w-full flex flex-col items-center text-center p-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-3">
            <LuCheck size={28} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">
            Password Updated!
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-5 max-w-xs">
            Your password has been reset successfully. You can now log in using your new credentials.
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </motion.div>
  );
}