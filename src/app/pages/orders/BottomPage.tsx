"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { tokenSliceapicall } from "@/redux/token";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { toast } from "react-toastify";
import { LuUser, LuShoppingBag, LuKeyRound, LuMapPin, LuLogOut, LuChevronRight, LuShieldCheck } from "react-icons/lu";

export default function BottomPage() {
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { userdata } = useAppSelector((state) => state.userprofileSlice) || {};

  const bottomlink = [
    {
      label: "Personal Information",
      link: "/pages/orders",
      icon: LuUser,
    },
    {
      label: "My Orders History",
      link: "/pages/orders/myorders",
      icon: LuShoppingBag,
    },
    // {
    //   label: "Saved Addresses",
    //   link: "/pages/orders/address",
    //   icon: LuMapPin,
    // },
    {
      label: "Password Manager",
      link: "/pages/orders/password",
      icon: LuKeyRound,
    },
  ];

  const logout = async () => {
    try {
      await axiosInstance.post(ApiList.logout);
      dispatch(tokenSliceapicall());
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to Logout");
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-5 shadow-soft flex flex-col gap-6">
      {/* Account User Card Header */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-md overflow-hidden ring-2 ring-emerald-500/20">
            {userdata?.profileImage ? (
              <img src={userdata.profileImage} alt="User" className="w-full h-full object-cover" />
            ) : (
              userdata?.fullname?.slice(0, 1).toUpperCase() || "U"
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <LuShieldCheck className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <div className="overflow-hidden flex-1">
          <h3 className="font-extrabold text-sm text-slate-900 truncate">
            {userdata?.fullname || "Account Details"}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
            {userdata?.email || userdata?.mobile || "Customer Profile"}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5">
        {bottomlink.map((item, index) => {
          const isActive = pathName === item.link;
          const Icon = item.icon;
          return (
            <Link
              href={item.link}
              key={index}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${isActive
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 translate-x-1"
                : "text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={17} className={isActive ? "text-white" : "text-emerald-600"} />
                <span>{item.label}</span>
              </div>
              <LuChevronRight size={14} className={isActive ? "opacity-100" : "opacity-40"} />
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <LuLogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Log Out Account</span>
          </div>
          <LuChevronRight size={14} className="opacity-40" />
        </button>
      </div>
    </div>
  );
}

