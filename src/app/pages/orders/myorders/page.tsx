"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { fetchCustomerOrderlist } from "@/redux/userprofile/customerorderlist";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import imageObj from "@/Collections/imgObj";
import useOrder from "@/app/hooks/order";
import { toast } from "react-toastify";
import MobileNavigation from "../MobileNavigation";
import Link from "next/link";
import { LuShoppingBag, LuDownload, LuBan, LuCheck, LuClock, LuX, LuMapPin, LuPackage } from "react-icons/lu";

export default function MyOrders() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { printBill } = useOrder();

  // Redux Data
  const { token } = useAppSelector((state: any) => state.tokenSlice);
  const { customerorderlist = [], customerorderloading } = useAppSelector((state) => state.customerorder) || {};

  useEffect(() => {
    if (token?.success) {
      if (customerorderlist.length === 0) {
        dispatch(fetchCustomerOrderlist());
      }
    }
  }, [dispatch, customerorderlist, token?.success]);

  const orderCancel = async (orderid: string) => {
    try {
      await axiosInstance.post(ApiList.ordercancel, orderid);
      dispatch(fetchCustomerOrderlist());
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const openSingleDetails = (itemid: any) => {
    router.push(`/productview/${itemid}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <MobileNavigation />

      <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-soft">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              My Orders & Purchase History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              View your past grocery orders, track delivery status, and download tax invoices.
            </p>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-100">
            {customerorderlist?.length || 0} Total Orders
          </span>
        </div>

        {/* Orders List Container */}
        <div className="flex flex-col gap-5">
          {customerorderloading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 animate-pulse"
                key={index}
              >
                <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))
          ) : customerorderlist.length > 0 ? (
            customerorderlist.map((item: any, index: number) => {
              const status = item?.status;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-5 shadow-xs transition-all flex flex-col gap-4"
                >
                  {/* Top Order Meta Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                        <LuPackage className="text-emerald-600" />
                        <span>Order #{item?.orderid}</span>
                        <span className="text-xs font-normal text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.products?.length} Items
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-1">
                        Placed on {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
                      </div>
                    </div>

                    {/* Actions: Download Bill & Cancel */}
                    <div className="flex items-center gap-2">
                      {status === "delivered" && (
                        <button
                          onClick={() => printBill(item._id)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <LuDownload size={14} />
                          <span>Download Invoice</span>
                        </button>
                      )}

                      {status === "pending" && (
                        <button
                          onClick={() => orderCancel(item._id)}
                          className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-full text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <LuBan size={13} />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status & Delivery Address Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500">Status:</span>
                        {status === "cancelled" ? (
                          <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 text-[11px]">
                            <LuX size={13} />
                            <span>Cancelled</span>
                          </span>
                        ) : status === "delivered" ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 text-[11px]">
                            <LuCheck size={13} />
                            <span>Delivered</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 text-[11px]">
                            <LuClock size={13} />
                            <span>Processing / Out for Delivery</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-600 mt-1">
                        <LuMapPin size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>
                          {item.address?.fullname}, {item.address?.address}, {item.address?.city} - {item.address?.pincode}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-semibold">Total Paid</div>
                      <div className="text-base font-extrabold text-emerald-800">
                        ₹{(item.totalprice || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Products Items List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.products?.map((p: any, pIndex: number) => (
                      <div
                        key={pIndex}
                        onClick={() => p?.productId?._id && openSingleDetails(p.productId._id)}
                        className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 hover:border-emerald-200 cursor-pointer transition-all group"
                      >
                        <div className="w-14 h-14 bg-slate-50 rounded-lg p-1 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <img
                            src={p?.productId?.imageBase641 || imageObj.noproductimage.src}
                            alt="Product"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex flex-col flex-1 overflow-hidden">
                          <h5 className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                            {p?.productId?.productName || "Product Item"}
                          </h5>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Qty: {p.quantity}
                          </div>
                          <div className="text-xs font-extrabold text-emerald-800 mt-0.5">
                            ₹{p.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <img src={imageObj.emptycart.src} alt="No Orders" className="w-32 h-auto opacity-70 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                You haven&apos;t placed any grocery orders yet. Start shopping to enjoy fresh produce delivered to your doorstep!
              </p>
              <Link
                href="/allproduct"
                className="mt-4 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2"
              >
                <LuShoppingBag size={15} />
                <span>Start Shopping</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

