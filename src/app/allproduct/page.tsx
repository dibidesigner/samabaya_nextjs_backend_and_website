"use client";

import Header from "@/components/header/page";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import {
  fetchProductList,
  toggleCategory,
  clearFilters,
  setPage,
} from "@/redux/productSlice";
import { fetchProductCategory } from "@/redux/productCategorySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { ProductItem } from "@/redux/productType";
import { ToastContainer } from "react-toastify";
import ProductCart from "@/components/ProductCard";
import { LuFilter, LuRotateCcw, LuChevronLeft, LuChevronRight, LuPackageX, LuSlidersHorizontal } from "react-icons/lu";

export default function Allproduct() {
  const dispatch = useAppDispatch();

  // Redux Data
  const { token } = useAppSelector((state) => state.tokenSlice);
  const { products = [], filters, pagination, loading } = useAppSelector((state) => state.productList);
  const { productCategoryList = [], categoryloading } = useAppSelector((state) => state.productCategory);

  // States
  const [filterMobileOpen, setFilterMobileOpen] = useState(false);

  useEffect(() => {
    if (token?.success) {
      dispatch(fetchProductList());
    }
  }, [dispatch, filters, pagination.page, token?.success]);

  useEffect(() => {
    if (token?.success) {
      dispatch(fetchProductCategory());
    }
  }, [dispatch, token?.success]);

  const activeCategoryCount = filters.categories.length;

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Header />
      <ToastContainer />

      {/* Main Container */}
      <main className="flex-1 w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-6 lg:py-10">
        
        {/* Page Title & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200/70">
          <div>
            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
              Catalog
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">
              All Products & Groceries
            </h1>
          </div>

          <button
            onClick={() => setFilterMobileOpen(!filterMobileOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-full text-xs font-bold shadow-xs active:scale-95"
          >
            <LuSlidersHorizontal size={16} />
            <span>Filters {activeCategoryCount > 0 && `(${activeCategoryCount})`}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Filter Panel */}
          <aside className={`lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-soft lg:block ${filterMobileOpen ? "block" : "hidden"}`}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 font-extrabold text-slate-800 text-sm">
                <LuFilter className="text-emerald-600" />
                <span>Filter Options</span>
                {activeCategoryCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {activeCategoryCount}
                  </span>
                )}
              </div>

              {activeCategoryCount > 0 && (
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <LuRotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter Group */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Categories
              </h3>

              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                {categoryloading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-6 bg-slate-100 animate-pulse rounded-md" />
                    ))
                  : productCategoryList.map((item, i) => {
                      const isChecked = filters.categories.includes(item.prouctCategory);
                      return (
                        <label
                          key={i}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => dispatch(toggleCategory(item.prouctCategory))}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span>{item.prouctCategory}</span>
                          </div>
                        </label>
                      );
                    })}
              </div>
            </div>
          </aside>

          {/* Main Product Grid & Controls */}
          <section className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Grid Container */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 bg-slate-100 animate-pulse rounded-2xl border border-slate-100"
                  />
                ))
              ) : products.length > 0 ? (
                products.map((item: ProductItem) => (
                  <ProductCart key={item._id} item={item} titlename="All Product" />
                ))
              ) : (
                <div className="col-span-full py-20 bg-white rounded-3xl border border-slate-100 shadow-soft flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <LuPackageX size={32} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    We couldn&apos;t find any items matching your selected category filters. Try clearing filters to see all available stock.
                  </p>
                  <button
                    onClick={() => dispatch(clearFilters())}
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Control */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-200/60">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => dispatch(setPage(pagination.page - 1))}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    pagination.page === 1
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 shadow-xs"
                  }`}
                >
                  <LuChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pagination.page === pageNum;
                  return (
                    <button
                      key={i}
                      onClick={() => dispatch(setPage(pageNum))}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-md scale-105"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => dispatch(setPage(pagination.page + 1))}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    pagination.page === pagination.totalPages
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 shadow-xs"
                  }`}
                >
                  <span>Next</span>
                  <LuChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

