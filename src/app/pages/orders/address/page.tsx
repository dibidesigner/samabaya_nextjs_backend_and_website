"use client";

import React, { useEffect, useState } from "react";
import AddressListSkeleton from "./AddressListSkeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { addressSliceapicall } from "@/redux/userprofile/addressSlice";
import MobileNavigation from "../MobileNavigation";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { toast } from "react-toastify";
import {
  LuMapPin,
  LuPlus,
  LuUser,
  LuPhone,
  LuMail,
  LuBuilding,
  LuTrash2,
  LuCheck,
  LuX,
  LuSparkles,
} from "react-icons/lu";

interface AddrType {
  _id?: string;
  id?: string;
  fullname: string;
  email?: string;
  mobileno?: string;
  address: string;
  city: string;
  landmark: string;
  pincode: string;
}

export default function AddressTable() {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redux state
  const { recordedaddress = [], cartloading } = useAppSelector(
    (state: any) => state.userAddress || state.addressslice || {}
  );

  const [formData, setFormData] = useState<AddrType>({
    fullname: "",
    mobileno: "",
    email: "",
    address: "",
    city: "Bhubaneswar",
    landmark: "",
    pincode: "",
  });

  useEffect(() => {
    dispatch(addressSliceapicall());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullname ||
      !formData.mobileno ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post(ApiList.useraddress, formData);
      toast.success("New delivery address added!");
      setShowForm(false);
      setFormData({
        fullname: "",
        mobileno: "",
        email: "",
        address: "",
        city: "Bhubaneswar",
        landmark: "",
        pincode: "",
      });
      dispatch(addressSliceapicall());
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save new address"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <MobileNavigation />

      <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-soft">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Saved Delivery Addresses
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                {recordedaddress.length} Saved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Manage your saved home, office, and delivery locations for fast grocery checkout.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {showForm ? (
              <>
                <LuX size={15} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <LuPlus size={15} />
                <span>Add New Address</span>
              </>
            )}
          </button>
        </div>

        {/* Add Address Form Drawer / Section */}
        {showForm && (
          <form
            onSubmit={handleSaveAddress}
            className="mb-8 p-6 bg-slate-50/80 rounded-3xl border border-slate-200/80 flex flex-col gap-4 shadow-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <LuBuilding className="text-emerald-700" size={17} />
                <span>New Address Details</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">
                * Required Fields
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <LuUser className="absolute left-3.5 text-slate-400" size={15} />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter recipient's full name"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <LuPhone className="absolute left-3.5 text-slate-400" size={15} />
                  <input
                    type="text"
                    name="mobileno"
                    placeholder="10-digit mobile number"
                    value={formData.mobileno}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address / Flat / Building *
                </label>
                <div className="relative flex items-center">
                  <LuMapPin className="absolute left-3.5 text-slate-400" size={15} />
                  <input
                    type="text"
                    name="address"
                    placeholder="House No, Apartment, Street name"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark (Optional)
                </label>
                <div className="relative flex items-center">
                  <LuBuilding className="absolute left-3.5 text-slate-400" size={15} />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near temple, park, school etc."
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="751002"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                {saving ? "Saving Address..." : "Save Address"}
              </button>
            </div>
          </form>
        )}

        {/* Address Cards List */}
        {cartloading ? (
          <AddressListSkeleton />
        ) : recordedaddress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recordedaddress.map((item: AddrType, index: number) => (
              <div
                key={item._id || item.id || index}
                className="group relative bg-white border border-slate-100 hover:border-emerald-300/80 rounded-3xl p-5 shadow-xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Card Header: Icon + Name + Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <LuBuilding size={18} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">
                          {item.fullname}
                        </h4>
                        {item.mobileno && (
                          <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                            <LuPhone size={11} />
                            <span>{item.mobileno}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {index === 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <LuCheck size={11} />
                        <span>Default</span>
                      </span>
                    )}
                  </div>

                  {/* Address Body */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-700 flex flex-col gap-1.5 font-medium">
                    <p className="leading-relaxed font-semibold text-slate-800">
                      {item.address}
                    </p>
                    {item.landmark && (
                      <p className="text-[11px] text-slate-500 font-normal">
                        <span className="font-bold text-slate-600">Landmark:</span> {item.landmark}
                      </p>
                    )}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 text-[11px] font-bold text-slate-600">
                      <span>{item.city}</span>
                      <span>•</span>
                      <span>PIN: {item.pincode}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <LuSparkles className="text-amber-500" size={12} />
                    <span>Verified Delivery Location</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl text-emerald-700 flex items-center justify-center mb-3">
              <LuMapPin size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Delivery Addresses Saved</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Save your delivery addresses now to enjoy fast 1-click checkout for all your daily grocery orders.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <LuPlus size={15} />
              <span>Add Your First Address</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
