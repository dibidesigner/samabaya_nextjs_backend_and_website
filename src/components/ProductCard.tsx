"use client";

import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { useRouter } from "next/navigation";
import ApiList from "@/Apicall/ApiList";
import axiosInstance from "@/Apicall/apiInstance";
import { ProductItem } from "@/redux/productType";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { setRegistrationStep } from "@/redux/pageSwitch";
import { fetchaddtocartList } from "@/redux/orderListSlice";
import { wishListSliceFetch } from "@/redux/wishListSlice";
import { toast } from "react-toastify";
import ReactIcons from "@/Collections/ReactIcons";
import { LuPlus, LuCheck } from "react-icons/lu";

interface ProductCartProps {
  item: ProductItem;
  titlename?: string;
}

export default function ProductCart({ item }: ProductCartProps) {
  const { token } = useAppSelector((state: any) => state.tokenSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { wishList = [] } = useAppSelector((state: any) => state.wishliststore) || {};

  const isLiked = wishList.some((wItem: any) => wItem._id === item._id);

  const addToCart = async (itemId: string) => {
    if (!token?.success) {
      toast.info("Please login to add items to cart");
      dispatch(setRegistrationStep("login"));
      return;
    }

    setAdding(true);
    const payload = {
      itemid: itemId,
      quantity: 1,
      itemPrice: item.price,
    };

    try {
      const res = await axiosInstance.post(ApiList.addToCart, payload);
      if (res.data.success) {
        dispatch(fetchaddtocartList());
        setAdded(true);
        toast.success(`${item.productName || "Item"} added to cart!`);
        setTimeout(() => setAdded(false), 2000);
      } else {
        dispatch(setRegistrationStep("login"));
        toast.error("Could not add item");
      }
    } catch (error) {
      dispatch(setRegistrationStep("login"));
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token?.success) {
      toast.info("Please login to save favorites");
      dispatch(setRegistrationStep("login"));
      return;
    }

    try {
      await axiosInstance.post(ApiList.like, { itemid: item._id });
      dispatch(wishListSliceFetch());
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const isOutOfStock = Number(item?.stock || 0) <= 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative p-3.5">
      {/* Stock & Wishlist Floating Badges */}
      <div className="flex justify-between items-center w-full z-10">
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            isOutOfStock
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Fresh"}
        </span>

        <button
          onClick={handleLikeToggle}
          className="p-1.5 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors shadow-xs"
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLiked ? (
            <IoMdHeart className="w-4 h-4 text-rose-500" />
          ) : (
            <CiHeart className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Product Image Container */}
      <Link
        href={`/productview/${item._id}`}
        className="my-3 flex justify-center items-center h-36 w-full overflow-hidden relative cursor-pointer"
      >
        <img
          src={item.imageBase641 || "/faviconsamabaya.png"}
          alt={item.productName || item.itemName || "Product Image"}
          className="object-contain h-full max-h-36 group-hover:scale-108 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <Link
            href={`/productview/${item._id}`}
            className="font-semibold text-slate-800 text-sm hover:text-emerald-700 transition-colors line-clamp-2 leading-snug block"
          >
            {item.productName || item.itemName}
          </Link>

          <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
            <span>{item.quantity}</span>
            <span>{item.productUnit}</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Price</div>
            <div className="text-base font-extrabold text-emerald-800 flex items-baseline">
              <span className="text-xs mr-0.5">₹</span>
              <span>{item.price}</span>
              <span className="text-xs text-slate-400 font-normal ml-0.5">.00</span>
            </div>
          </div>

          <button
            disabled={isOutOfStock || adding}
            onClick={() => addToCart(item._id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1 shadow-xs active:scale-95 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : added
                ? "bg-emerald-800 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white border border-emerald-200/60"
            }`}
          >
            {adding ? (
              <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
            ) : added ? (
              <>
                <LuCheck className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <LuPlus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

