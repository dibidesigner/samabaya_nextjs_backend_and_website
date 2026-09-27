"use client";

import React from "react";
import { useCart } from "@/app/hooks/clearCart";
import useProduct from "@/app/hooks/product";
import imageObj from "@/Collections/imgObj";
import Link from "next/link";
import { LuTrash2, LuMinus, LuPlus, LuShoppingBag } from "react-icons/lu";

const CheckoutTable = ({ product = [], totalPrice, load, cartid }: any) => {
  const { clearCart, increaseQuantity, decreaseQuantity, deleteAddToCartItem } = useCart();
  const { openSingleDetails } = useProduct();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <span>Your Shopping Cart</span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {product?.length || 0} Items
          </span>
        </div>

        {product.length > 0 && (
          <button
            onClick={() => clearCart()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <LuTrash2 size={14} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="flex flex-col gap-3">
        {product.length <= 0 ? (
          <div className="w-full bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <img
              src={imageObj.emptyCart.src}
              alt="Empty Cart"
              className="w-36 h-auto opacity-80 mb-3"
            />
            <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              You haven&apos;t added any grocery items to your cart yet. Explore our store catalog to find fresh produce and daily staples.
            </p>
            <Link
              href="/allproduct"
              className="mt-4 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <LuShoppingBag size={15} />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          product.map((item: any) => {
            const isStockAvailable = Number(item?.product?.stock || 0) > 0;
            return (
              <div
                key={item._id}
                className={`w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all hover:border-slate-200 ${
                  !isStockAvailable ? "opacity-60 bg-slate-50" : ""
                }`}
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    onClick={() => openSingleDetails(item?.product?._id)}
                    className="w-16 h-16 bg-slate-50 rounded-xl p-1.5 border border-slate-100 flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={item?.product?.imageBase641 || "/faviconsamabaya.png"}
                      alt={item?.product?.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4
                      onClick={() => openSingleDetails(item?.product?._id)}
                      className="font-bold text-sm text-slate-800 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1"
                    >
                      {item?.product?.productName}
                    </h4>

                    <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                      <span>
                        {item?.product?.quantity} {item?.product?.productUnit}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-700">₹{item?.product?.price} each</span>
                    </div>

                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isStockAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {isStockAvailable
                          ? `In Stock (${item?.product?.stock} left)`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center gap-4 mx-6">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => decreaseQuantity(item.quantity, item._id)}
                      className="w-7 h-7 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors shadow-xs"
                    >
                      <LuMinus size={12} />
                    </button>
                    <span className="px-3 font-extrabold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.quantity, item._id, item?.product?.stock)
                      }
                      className="w-7 h-7 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors shadow-xs"
                    >
                      <LuPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Delete Action */}
                <div className="flex flex-col items-end gap-1 min-w-[90px]">
                  <div className="text-sm font-extrabold text-emerald-800">
                    ₹{(item.priceAtAddTime * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => deleteAddToCartItem(item._id)}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CheckoutTable;

