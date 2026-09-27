"use client";

import React, { useEffect } from 'react';
import Footer from '@/components/Footer'; 
import dynamic from "next/dynamic";
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import ReactIcons from '@/Collections/ReactIcons';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';
import { homeproductlist } from '@/redux/homeProductList';
import CategoryFilter from '@/components/CategoryFilter';
import MobileCarusel from '../../../components/MobileCarausel';
import Threetype from '@/components/Threetype';
import Whychoose from '@/components/Whychoose';
import ProductCart from '@/components/ProductCard';
import { LuMapPin, LuArrowRight, LuSparkles } from 'react-icons/lu';

const Header = dynamic(() => import('@/components/header/page'), {
  loading: () => (
    <div className='w-full py-12 flex justify-center items-center bg-slate-50'>
      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

const MainCarousel = dynamic(() => import('../../../components/Maincarausel'), {
  loading: () => (
    <div className='w-full py-16 flex justify-center items-center bg-slate-100 animate-pulse'>
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

function Home() {
  const dispatch = useAppDispatch();
  const { productList = [], homeproductloading } = useAppSelector((state) => state.Homepageproduct) || {};

  useEffect(() => {
    if (productList.length === 0) {
      dispatch(homeproductlist());
    }
  }, [dispatch, productList]);

  return (
    <div className='flex flex-col min-h-screen bg-slate-50/50 text-slate-800 antialiased'>
      <Header />
      <ToastContainer />

      {/* Main Carousels */}
      <div className='w-full hidden lg:block overflow-hidden shadow-soft'>
        <MainCarousel />
      </div>
      <div className='w-full lg:hidden block overflow-hidden shadow-soft'>
        <MobileCarusel />
      </div>

      {/* Location Service Banner */}
      <div className='w-full bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 font-medium shadow-inner'>
        <LuMapPin className="text-amber-400 w-4 h-4 animate-bounce" />
        <span>Currently serving daily fresh deliveries in</span>
        <span className='font-bold text-white bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1'>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Bhubaneswar Only
        </span>
      </div>

      {/* Category Section */}
      <CategoryFilter />

      {/* Featured Products Section */}
      <section className="w-full flex justify-center items-center py-10 lg:py-14 bg-white">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] flex flex-col gap-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                <LuSparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured Collection</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-2">
                Popular & Fresh Products
              </h2>
            </div>

            <Link
              href="/allproduct"
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 border border-emerald-200/60 group"
            >
              <span>View All Products</span>
              <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
            {homeproductloading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full h-72 bg-slate-100 animate-pulse rounded-2xl border border-slate-100"
                />
              ))
            ) : productList.length > 0 ? (
              productList.map((item: any) => (
                <ProductCart key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400 font-medium">
                No featured products currently available. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Types Section */}
      <Threetype />

      {/* Why Choose Section */}
      <Whychoose />

      {/* Main Footer */}
      <Footer />
    </div>
  );
}

export default Home;