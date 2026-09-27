"use client";

import { useEffect, useState } from "react";
import {
  LuUser,
  LuLock,
  LuEye,
  LuEyeOff,
  LuX,
  LuLoader,
  LuLogIn,
  LuKeyRound,
  LuMail,
  LuUserPlus,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../redux/hook/hooks";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import Register from "./Register";
import ForgotScreen from "./ForgotScreen";
import LoginWithOtp from "./LoginWithOtp";

interface LoginProps {
  onClose?: () => void;
}

export default function Login({ onClose }: LoginProps) {
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [loginresponse, setLoginresponse] = useState(false);
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [screen, setScreen] = useState<"login" | "otp" | "forgot" | "register">("login");
  const [loading, setLoading] = useState(false);

  // Redux Data
  const pagename = useAppSelector((state: any) => state.whichpage);

  useEffect(() => {
    if (pagename?.field) {
      setScreen(pagename.field);
    }
  }, [pagename?.field]);

  const loginFunction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username || !passcode) {
      toast.error("Please enter your credentials");
      return;
    }

    try {
      setLoading(true);
      setLoginresponse(false);

      const payload = { email: username, password: passcode };
      const res = await axiosInstance.post(ApiList.userLogin, payload, {
        withCredentials: true,
      });

      if (res.data.success === true) {
        toast.success("Welcome back! Logged in successfully.");
        if (onClose) {
          onClose();
        }
        window.location.href = "/";
      } else {
        setLoginresponse(true);
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong during login");
      setLoginresponse(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
        >
          <LuX size={18} />
        </button>

        {/* Tab Switcher Header */}
        <div className="w-full bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setScreen("login")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${screen === "login"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <LuLogIn size={14} />
            <span>Password</span>
          </button>

          <button
            onClick={() => setScreen("otp")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${screen === "otp"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <LuMail size={14} />
            <span>OTP Code</span>
          </button>

          <button
            onClick={() => setScreen("register")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${screen === "register"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <LuUserPlus size={14} />
            <span>Register</span>
          </button>
        </div>

        {/* Content Body */}
        <AnimatePresence mode="wait">
          {screen === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={loginFunction}
              className="w-full flex flex-col gap-4"
            >
              <div className="text-center mb-1">
                <h2 className="text-xl font-extrabold text-slate-900">Welcome Back</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Sign in to your Sisupalgarh Cooperative Store account.
                </p>
              </div>

              {loginresponse && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold text-center">
                  Invalid email/mobile or password. Please try again.
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email or Mobile Number
                </label>
                <div className="relative flex items-center">
                  <LuUser className="absolute left-3.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter email or mobile"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setScreen("forgot")}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <LuLock className="absolute left-3.5 text-slate-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter account password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <LuLoader size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LuLogIn size={16} />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>

              {/* Register Switcher */}
              <div className="mt-2 text-center text-xs text-slate-500 font-semibold">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setScreen("register")}
                  className="text-emerald-700 hover:text-emerald-800 font-extrabold cursor-pointer hover:underline ml-0.5"
                >
                  Create One Now
                </button>
              </div>
            </motion.form>
          )}

          {screen === "otp" && (
            <LoginWithOtp
              key="otp"
              onSuccess={onClose}
              onBackToLogin={() => setScreen("login")}
            />
          )}

          {screen === "forgot" && (
            <ForgotScreen
              key="forgot"
              onBackToLogin={() => setScreen("login")}
            />
          )}

          {screen === "register" && (
            <Register
              key="register"
              onclick={() => setScreen("login")}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
