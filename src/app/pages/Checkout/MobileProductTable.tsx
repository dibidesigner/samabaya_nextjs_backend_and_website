"use client";


import React from "react";
import Link from "next/link";
import useProduct from "@/app/hooks/product";
import { useCart } from "@/app/hooks/clearCart";
import imageObj from "@/Collections/imgObj";

const MobileProductTable = ({ product,cartid,cartloading }: any) => {


  //custom hook
  const {clearCart,increaseQuantity,decreaseQuantity,deleteAddToCartItem} = useCart()
  const {openSingleDetails} = useProduct()




  return (
    <div className="w-full  text-black">

    <div className="w-full px-2 flex flex-row justify-between items-center mb-5">
        <div>Checkout List</div>
        <button
            className="text-red-500 text-light hover:text-red-700 cursor-pointer"
            onClick={()=>clearCart()}
            >
            Clear Cart
        </button>
    </div>
        
    {

      cartloading ? 

      <div>
         Cart List loading
      </div>
      
      :

   
    ((product.length || [] )<= 0 ? (
            <div className="w-full flex flex-col justify-center items-center py-4">
              <img src={imageObj.emptyCart.src} alt="Empty Cart Image" className="w-36 h-auto"/>
              <h1 className="text-lg font-semibold mt-2">Your cart is Empty</h1>
              <p className="text-center text-gray-400 text-xs">
                  Looks like you haven't added any products yet.
                  <br />Browse our collection and find something you love.
              </p>
            </div>
          ) 

          : 

          (
            product?.map((item: any, index: number) => (
              <div key={item._id} className={`border-b my-4 border-gray-100 ${item?.product?.stock <= 0 ? "opacity-25" : "opacity-100"}`}>
                <div className="px-2 py-2 text-gray-400 lg:block hidden">{index + 1}</div>
                <div className="flex flex-row justify-start items-center gap-2">
                <div className="w-full flex flex-row justify-start items-center gap-5">
                    <div className="">
                        <img
                            src={item?.product?.imageBase641}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                        />
                    </div>
                    <div>
                        <div className="font-medium hover:text-green-600 transition-all duration-300 cursor-pointer hover:underline" onClick={() => openSingleDetails(item.product._id)}>
                        {item.product.productName}
                        </div>
                        <div className=" font-medium text-sm">₹{item.product.price} * {item.quantity} = <span className="px-2 py-2 font-semibold text-green-600">₹{item.priceAtAddTime * item.quantity}</span>{}</div>
                        <div className=" font-medium text-gray-400 text-xs">{item.product.stock} {item.product.productUnit} left{}</div>
                    </div>
                </div>
                <div className="flex h-full flex-col justify-between items-start gap-4">


                   <div className="px-3 text-right">
                        <button
                            className="text-red-500 hover:text-red-700 cursor-pointer text-sm"
                            onClick={() => deleteAddToCartItem(item._id)}
                        >
                            Remove
                        </button>
                    </div>


                    <div className="">
                        <div className="flex items-center">
                            <button className="px-2  bg-gray-200 rounded-l hover:bg-gray-300 cursor-pointer" onClick={()=>decreaseQuantity(item.quantity,item._id)}>
                            -
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button className="px-2  bg-gray-200 rounded-r hover:bg-gray-300 cursor-pointer" onClick={()=>increaseQuantity(item.quantity,item._id,item?.product?.stock)}>
                            +
                            </button>
                        </div>
                    </div>
                    
                    
                    
                   
                </div>    
              </div>
              </div>
            ))
          ))

          }
        

    
    </div>
  );
};

export default MobileProductTable;
