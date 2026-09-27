
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { fetchProductCategory } from "@/redux/productCategorySlice";
import { tokenSliceapicall } from "@/redux/token";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import Login from "../Login";
import { admindetails } from "@/redux/contactDetailsSlice";
import SearchField from "../SearchField";
import { fetchProductList } from "@/redux/productSlice";
import { IoIosArrowDown, IoIosArrowUp, IoMdCart, IoMdPower } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GiBeachBag } from "react-icons/gi";
import { setRegistrationStep } from "@/redux/pageSwitch";
import { fetchaddtocartList } from "@/redux/orderListSlice";
import { wishListSliceFetch } from "@/redux/wishListSlice";
import { ToastContainer, toast } from "react-toastify";
import { fetchCustomerOrderlist } from "@/redux/userprofile/customerorderlist";
import { fetchUserInformation } from "@/redux/userprofile/peronalInformationSlice";
import imageObj from "@/Collections/imgObj";
import ReactIcons from "@/Collections/ReactIcons";
import { LuPhone, LuMail, LuHeart, LuUser, LuShoppingBag, LuShoppingCart } from "react-icons/lu";

function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux Data
  const { token } = useAppSelector((state: any) => state.tokenSlice);
  const { userdata } = useAppSelector((state) => state.userprofileSlice);
  const { customerorderlist = [] } = useAppSelector((state) => state.customerorder || {});
  const { details, contactdetailsloading } = useAppSelector((state: any) => state.contactdetails);
  const { cartList } = useAppSelector((state: any) => state.fetchaddtocartList) || {};

  // States
  const [hide, setHide] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [loginpage, setLoginPage] = useState(false);
  const [profileextend, setProfileextend] = useState(false);

  // Authenticate
  const isLoggedIn = token?.success;
  const cartCount = cartList?.totalItems || cartList?.products?.length || 0;

  useEffect(() => {
    if (isLoggedIn) {
      if (customerorderlist.length === 0) {
        dispatch(fetchCustomerOrderlist());
      }
      if (!userdata) {
        dispatch(fetchUserInformation());
      }
    }
  }, [dispatch, isLoggedIn, customerorderlist, userdata]);

  useEffect(() => {
    dispatch(fetchProductList());
    dispatch(fetchProductCategory());
    dispatch(tokenSliceapicall());

    if (!details && !contactdetailsloading) {
      dispatch(admindetails());
    }
  }, [dispatch, details, contactdetailsloading]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchaddtocartList());
      dispatch(wishListSliceFetch());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const handleResize = () => {
      setThreshold(window.innerHeight * 0.15);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setHide(true);
      } else {
        setHide(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const logout = async () => {
    try {
      await axiosInstance.post(ApiList.logout);
      dispatch(tokenSliceapicall());
      setProfileextend(false);
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="w-full flex flex-col z-50 sticky top-0 bg-white shadow-sm">
      <ToastContainer />

      {/* Top Announcement & Contact Bar */}
      <div
        className={`w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-900 text-white text-xs transition-all duration-300 overflow-hidden ${hide ? "max-h-0 py-0 opacity-0 pointer-events-none" : "max-h-12 py-2 opacity-100"
          }`}
      >
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto flex justify-between items-center px-2">
          <div className="hidden lg:flex items-center gap-2 text-emerald-200">
            <LuHeart className="text-emerald-400 w-3.5 h-3.5 animate-pulse" />
            <span className="font-medium tracking-wide">
              Delivering Happiness & Fresh Groceries to Your Home
            </span>
          </div>

          <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-6 text-emerald-100">
            {details?.mobile && (
              <a
                href={`tel:${details.mobile}`}
                className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
              >
                <LuPhone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 {details.mobile}</span>
              </a>
            )}

            {details?.emailid && (
              <a
                href={`mailto:${details.emailid}`}
                className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
              >
                <LuMail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{details.emailid}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="w-full bg-white border-b border-slate-100 py-2.5 lg:py-3.5 transition-all">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Image
              src={imageObj.logo}
              alt="Samabaya Smart Bazar Logo"
              className="h-9 lg:h-11 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          {/* Center Search Input */}
          <div className="flex-1 max-w-2xl px-2">
            <SearchField />
          </div>

          {/* Right Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Account Link */}
            {isLoggedIn ? (
              <button
                onClick={() => router.push("/pages/orders")}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors py-1.5 px-3 rounded-full hover:bg-emerald-50"
              >
                <LuUser className="w-4 h-4 text-emerald-600" />
                <span>Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch(setRegistrationStep("login"));
                  setLoginPage(true);
                }}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors py-1.5 px-3 rounded-full hover:bg-emerald-50"
              >
                <LuUser className="w-4 h-4 text-emerald-600" />
                <span>Account</span>
              </button>
            )}

            {/* My Orders Link */}
            {isLoggedIn ? (
              <button
                onClick={() => router.push("/pages/orders/myorders")}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors py-1.5 px-3 rounded-full hover:bg-emerald-50"
              >
                <LuShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>My Orders</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch(setRegistrationStep("login"));
                  setLoginPage(true);
                }}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors py-1.5 px-3 rounded-full hover:bg-emerald-50"
              >
                <LuShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>My Orders</span>
              </button>
            )}

            {/* Cart Button */}
            {isLoggedIn ? (
              <button
                onClick={() => router.push("/checkout")}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-6 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 relative"
              >
                <LuShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {/* {cartCount > 0 && (
                  <span className="bg-amber-400 text-slate-900 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-700 -mr-1">
                    {cartCount}
                  </span>
                )} */}
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch(setRegistrationStep("login"));
                  setLoginPage(true);
                }}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-4 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <LuShoppingCart className="w-4 h-4" />
                <span>Cart</span>
              </button>
            )}
          </div>

          {/* Mobile Profile / Auth Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileextend(!profileextend)}
                  className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white overflow-hidden flex items-center justify-center text-xs font-bold">
                    {userdata?.profileImage ? (
                      <img
                        src={userdata.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userdata?.name?.slice(0, 1) || "U"
                    )}
                  </div>
                  {profileextend ? (
                    <IoIosArrowUp className="text-slate-600 text-xs" />
                  ) : (
                    <IoIosArrowDown className="text-slate-600 text-xs" />
                  )}
                </button>

                {profileextend && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-slate-800">
                        {userdata?.fullname || "Account"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {userdata?.email || userdata?.mobile || ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/pages/orders"
                        onClick={() => setProfileextend(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <FaUser className="text-emerald-600" />
                        <span>Profile & Address</span>
                      </Link>

                      <Link
                        href="/checkout"
                        onClick={() => setProfileextend(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <IoMdCart className="text-emerald-600" />
                        <span>My Cart ({cartCount})</span>
                      </Link>

                      <Link
                        href="/pages/orders/myorders"
                        onClick={() => setProfileextend(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <GiBeachBag className="text-emerald-600" />
                        <span>My Orders</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <IoMdPower />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  dispatch(setRegistrationStep("login"));
                  setLoginPage(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xs active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Popup Modal */}
      {loginpage && <Login onClose={() => setLoginPage(false)} />}
    </header>
  );
}

export default Header;

