"use client";

import maleprofile from "@/Assets/images/maleprofile.jpg";
import femaleprofile from "@/Assets/images/femaleprofile.jpg";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { fetchUserInformation } from "@/redux/userprofile/peronalInformationSlice";
import Skeleton from "./Skeleton";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import MobileNavigation from "../MobileNavigation";
import { toast } from "react-toastify";
import { LuUser, LuMail, LuPhone, LuCamera, LuCheck, LuCircleAlert, LuPencil, LuSave } from "react-icons/lu";

export interface UserForm {
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  provider: string;
  profileImage: string | null;
}

export default function PersonalInformation() {
  const dispatch = useAppDispatch();

  const { userdata, loading } = useAppSelector((state) => state.userprofileSlice);
  const { token } = useAppSelector((state) => state.tokenSlice);

  useEffect(() => {
    if (!userdata) {
      dispatch(fetchUserInformation());
    }
  }, [dispatch, userdata, token?.success]);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [failUpdate, setFailUpdate] = useState(false);

  const [form, setForm] = useState<UserForm>({
    firstName: "",
    email: "",
    phone: "",
    gender: "",
    provider: "",
    profileImage: null,
  });

  const [editProfile, setEditProfile] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (userdata) {
      setForm({
        firstName: userdata?.fullname || "",
        email: userdata?.email || "",
        phone: userdata?.mobile || "",
        gender: userdata?.gender || "",
        provider: userdata?.authProvider || "",
        profileImage:
          userdata?.profileImage ||
          (userdata?.gender === "Female" ? femaleprofile.src : maleprofile.src),
      });
    }
  }, [userdata]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(ApiList.userpersonalinformation, form);
      if (res.data.success === true) {
        setUpdateSuccess(true);
        setEditProfile(false);
        dispatch(fetchUserInformation());
        toast.success("Profile updated successfully!");
        setTimeout(() => setUpdateSuccess(false), 4000);
      } else {
        setFailUpdate(true);
        toast.error("Failed to update profile");
        setTimeout(() => setFailUpdate(false), 4000);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateImage = async () => {
    try {
      if (!image) return;
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", image);

      await axiosInstance.put(ApiList.userpersonalinformation, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchUserInformation());
      setImage(null);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <MobileNavigation />

      <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-soft">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Personal Profile Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Manage your identity, email preferences, and personal contact details.
            </p>
          </div>

          {!editProfile ? (
            <button
              onClick={() => setEditProfile(true)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-200/60"
            >
              <LuPencil size={14} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setEditProfile(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Alert Notifications */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <LuCheck size={16} className="text-emerald-600 flex-shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {failUpdate && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-semibold">
            <LuCircleAlert size={16} className="text-rose-600 flex-shrink-0" />
            <span>Failed to update profile. Please try again later.</span>
          </div>
        )}

        {/* Grid Container: Left Form + Right Avatar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Side Form */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                {loading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <div className="relative flex items-center">
                    <LuUser className="absolute left-3.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      readOnly={!editProfile}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${editProfile
                          ? "bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-900"
                          : "bg-slate-50 border border-slate-100 text-slate-700"
                        }`}
                    />
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                {loading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <div className="relative flex items-center">
                    <LuMail className="absolute left-3.5 text-slate-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      readOnly={form.provider === "google" || !editProfile}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${editProfile && form.provider !== "google"
                          ? "bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-900"
                          : "bg-slate-50 border border-slate-100 text-slate-500"
                        }`}
                    />
                  </div>
                )}
                {editProfile && form.provider === "google" && (
                  <p className="text-[11px] text-amber-600 mt-1 font-medium flex items-center gap-1">
                    <span>⚠ Email is managed via Google Single Sign-On and cannot be changed here.</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                {loading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : (
                  <div className="relative flex items-center">
                    <LuPhone className="absolute left-3.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      readOnly={!editProfile}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition-all ${editProfile
                          ? "bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-900"
                          : "bg-slate-50 border border-slate-100 text-slate-700"
                        }`}
                    />
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gender
                </label>
                {loading ? (
                  <Skeleton className="h-11 w-full rounded-xl" />
                ) : editProfile ? (
                  <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name="gender"
                    value={form.gender || "Not Specified"}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                  />
                )}
              </div>

              {/* Submit Save Button */}
              {editProfile && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
                  >
                    <LuSave size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Side Avatar Uploader Card */}
          <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-3xl border border-slate-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200">
                <img
                  src={form.profileImage || maleprofile.src}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="absolute bottom-1 right-1 p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110">
                <LuCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <p className="text-xs font-extrabold text-slate-800 mt-3">Profile Picture</p>
            <p className="text-[11px] text-slate-400 text-center mt-0.5">
              Supports JPG, PNG or WEBP up to 5MB
            </p>

            {image && (
              <button
                onClick={updateImage}
                disabled={uploadingImage}
                className="mt-4 w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {uploadingImage ? "Uploading..." : "Upload Selected Image"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

