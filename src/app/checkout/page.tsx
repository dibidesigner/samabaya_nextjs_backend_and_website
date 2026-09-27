"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useAuthGuard } from "@/app/useAuthGuard";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { addressSliceapicall } from "@/redux/userprofile/addressSlice";
import { fetchUserInformation } from "@/redux/userprofile/peronalInformationSlice";
import { fetchaddtocartList } from "@/redux/orderListSlice";
import Header from "@/components/header/page";
import CheckoutTable from "@/app/pages/Checkout/CheckoutTable";
import MobileProductTable from "@/app/pages/Checkout/MobileProductTable";
import Footer from "@/components/Footer";
import { fetchCustomerOrderlist } from "@/redux/userprofile/customerorderlist";
import ReactIcons from "@/Collections/ReactIcons";
import { LuMapPin, LuPlus, LuLock, LuShieldCheck, LuPhone, LuUser } from "react-icons/lu";

export default function Checkout() {
  useAuthGuard();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux Data
  const { token } = useAppSelector((state) => state.tokenSlice);
  const { cartList, cartloading } = useAppSelector((state: any) => state.fetchaddtocartList);
  const { recordedaddress = [] } = useAppSelector((state) => state.userAddress) || {};

  // States
  const [missingfield, setMissingfield] = useState(false);
  const [newTotalPrice, setNewTotalPrice] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [newaddress, setNewAddress] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [cartid, setCartId] = useState("");

  const isLoggedIn = token?.success;

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    dispatch(addressSliceapicall());
    dispatch(fetchaddtocartList());
  }, [dispatch]);

  useEffect(() => {
    if (token?.success) {
      dispatch(fetchUserInformation());
    }
  }, [dispatch, token]);

  const [addressForm, setAddressForm] = useState({
    fullname: "",
    mobileno: "",
    emailid: "",
    address: "",
    city: "",
    landmark: "",
    pincode: "",
  });

  const payload = {
    totalPrice: newTotalPrice,
    ...addressForm,
    products,
  };

  const placeorder = async () => {
    if (!token?.success) {
      toast.error("Please Login");
      return;
    }

    if (
      !addressForm.fullname ||
      !addressForm.mobileno ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.landmark ||
      !addressForm.pincode ||
      products.length === 0
    ) {
      setMissingfield(true);
      toast.error("Please fill all required delivery fields");
      return;
    }

    try {
      await axiosInstance.post(ApiList.placeorder, payload);
      dispatch(fetchCustomerOrderlist());
      toast.success("Order placed successfully!");
      router.push("/pages/orders/myorders");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const deleteSavedAddress = async (addressid: any) => {
    try {
      await axiosInstance.delete(`${ApiList.useraddress}/${addressid}`);
      dispatch(addressSliceapicall());
      toast.success("Address removed");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  useEffect(() => {
    if (!cartloading) {
      setNewAddress(recordedaddress.length <= 0);
      const availableProduct =
        cartList?.products?.filter(
          (item: any) =>
            (item.product?.stock || 0) > 0 && (item.product?.price || 0) > 0
        ) || [];
      const validProducts =
        cartList?.products?.filter((item: any) => (item.product?.price || 0) > 0) || [];
      const totalPrice = availableProduct.reduce(
        (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

      setNewTotalPrice(totalPrice);
      setCartId(cartList?.[0]?._id || "");
      setProducts(validProducts);
    }
  }, [cartloading, cartList, recordedaddress]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Header />
      <ToastContainer />

      <main className="flex-1 w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-6 lg:py-10">

        {/* Checkout Header / Step Progress */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200/70">
          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Secure Checkout
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
              Review & Place Order
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <LuShieldCheck size={16} />
            <span>100% Guaranteed Safe Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Main Left Content: Items & Address Form */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Products Table Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft">
              <div className="lg:block hidden">
                <CheckoutTable
                  product={cartList?.products || []}
                  load={cartloading}
                  totalPrice={newTotalPrice}
                  cartid={cartid}
                />
              </div>

              <div className="lg:hidden block">
                <MobileProductTable
                  product={cartList?.products || []}
                  load={cartloading}
                  totalPrice={newTotalPrice}
                  cartid={cartid}
                />
              </div>
            </div>

            {/* Delivery Address Selection Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft flex flex-col gap-4">
              <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
                <LuMapPin className="text-emerald-600" />
                <span>Select Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recordedaddress.map((item: any, index: number) => {
                  const isSelected = selectedAddressIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAddressIndex(null);
                          setAddressForm({
                            fullname: "",
                            mobileno: "",
                            emailid: "",
                            address: "",
                            city: "",
                            landmark: "",
                            pincode: "",
                          });
                        } else {
                          setSelectedAddressIndex(index);
                          setAddressForm({
                            fullname: item?.address[0]?.fullname || "",
                            mobileno: item?.address[0]?.mobileno || "",
                            emailid: item?.address[0]?.email || "",
                            address: item?.address[0]?.address || "",
                            city: item?.address[0]?.city || "",
                            landmark: item?.address[0]?.landmark || "",
                            pincode: item?.address[0]?.pincode || "",
                          });
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <LuUser className="w-4 h-4 text-emerald-600" />
                            <span>{item?.address[0]?.fullname}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item?.address[0]?.address}, {item?.address[0]?.landmark},{" "}
                            {item?.address[0]?.city} - {item?.address[0]?.pincode}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2 font-medium">
                            <LuPhone size={12} className="text-emerald-600" />
                            <span>+91 {item?.address[0]?.mobileno}</span>
                          </div>
                        </div>

                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => { }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 mt-1"
                        />
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedAddress(item?._id);
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add New Address Button Card */}
                <div
                  onClick={() => setNewAddress(!newaddress)}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-center gap-3 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <LuPlus size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm text-emerald-800">
                      {newaddress ? "Close Form" : "Add New Address"}
                    </div>
                    <div className="text-xs text-slate-400">
                      Deliver to a new location in Bhubaneswar
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Address Form Container */}
              {newaddress && (
                <div className="mt-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
                  <h3 className="font-extrabold text-sm text-slate-800 mb-4">
                    Enter New Delivery Address Details
                  </h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={addressForm.fullname}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, fullname: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          10-Digit Mobile Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          maxLength={10}
                          value={addressForm.mobileno}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setAddressForm({ ...addressForm, mobileno: val });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Street Address / Apartment *
                      </label>
                      <textarea
                        placeholder="House/Plot No., Street Name, Area"
                        rows={2}
                        value={addressForm.address}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Landmark *
                        </label>
                        <input
                          type="text"
                          placeholder="Near Temple / School"
                          value={addressForm.landmark}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, landmark: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="Bhubaneswar"
                          value={addressForm.city}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          placeholder="751002"
                          maxLength={6}
                          value={addressForm.pincode}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl text-xs font-medium outline-none"
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, pincode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-soft sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-xs mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Total Items</span>
                <span className="font-bold text-slate-800">{cartList.totalItems || products.length || 0}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">₹{(newTotalPrice || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge (Bhubaneswar)</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>GST & Taxes</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-black">
                <span className="text-slate-900">Total Payable Amount</span>
                <span className="text-emerald-700 text-lg">₹{(newTotalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            {missingfield && (
              <div className="mb-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-semibold text-center">
                Please complete and select a delivery address to proceed.
              </div>
            )}

            <button
              onClick={placeorder}
              disabled={products.length === 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 ${products.length === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
            >
              <LuLock size={16} />
              <span>Proceed to Pay</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

