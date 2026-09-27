import React from "react";

const AddressListSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-3 w-64 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-full"></div>
      </div>

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-full bg-slate-100 rounded-md"></div>
            <div className="h-4 w-1/2 bg-slate-100 rounded-md"></div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
              <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressListSkeleton;