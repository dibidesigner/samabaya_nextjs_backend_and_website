"use client";

import { LuSearch, LuX } from "react-icons/lu";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";

export default function SearchField() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchedProduct, setSearchProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productId, setProductId] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchProduct([]);
      setOpenDropdown(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/productsearch?q=${debouncedQuery}`
        );
        setSearchProduct(response.data || []);
        setOpenDropdown(true);
      } catch (error) {
        toast.error("Search temporarily unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (productId) {
      router.push(`/productview/${productId}`);
      setOpenDropdown(false);
    } else if (query.trim()) {
      router.push(`/pages/Search?query=${encodeURIComponent(query)}`);
      setOpenDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setSearchProduct([]);
    setOpenDropdown(false);
    setProductId("");
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <div className="relative w-full flex items-center group">
        <div className="absolute left-4 text-emerald-600 transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
          <LuSearch size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedProduct("");
            setProductId("");
          }}
          placeholder="Search fresh groceries, organic vegetables, daily needs..."
          className="w-full h-12 pl-12 pr-24 bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-full text-sm font-medium transition-all duration-300 shadow-xs outline-none"
          onFocus={() => query.trim() && setOpenDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Clear search"
            >
              <LuX size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-1 active:scale-95"
          >
            Search
          </button>
        </div>
      </div>

      {openDropdown && (
        <div className="absolute left-0 right-0 w-full mt-2 max-h-80 overflow-y-auto z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="py-6 flex justify-center items-center gap-2 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching products...</span>
            </div>
          ) : searchedProduct.length > 0 ? (
            searchedProduct.map((item, index) => (
              <div
                key={item._id || index}
                className="w-full p-3 hover:bg-emerald-50/70 transition-colors cursor-pointer flex items-center justify-between group"
                onClick={() => {
                  setQuery(item.productName);
                  setSelectedProduct(item.productName);
                  setProductId(item._id);
                  setOpenDropdown(false);
                  router.push(`/productview/${item._id}`);
                }}
              >
                <div className="flex items-center gap-3">
                  {item.imageBase641 ? (
                    <img
                      src={item.imageBase641}
                      alt={item.productName}
                      className="w-10 h-10 object-contain rounded-md bg-white p-1 border border-slate-100 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {item.productName?.slice(0, 2)?.toUpperCase() || "SS"}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {item.productName}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      {item.quantity && (
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-600">
                          {item.quantity} {item.productUnit}
                        </span>
                      )}
                      {item.stock !== undefined && (
                        <span
                          className={`text-[10px] font-medium ${
                            Number(item.stock) > 0
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {Number(item.stock) > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {item.price && (
                  <div className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    ₹{item.price}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-slate-400 text-sm">
              No products found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

