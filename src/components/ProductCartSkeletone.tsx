const ProductCardSkeleton = () => {
  return (
    <div className="w-full lg:w-[300px] 2xl:w-[320px] h-[300px] lg:h-[400px] flex flex-col justify-start items-center bg-white rounded-lg border pb-4 lg:pb-0 border-gray-200 relative overflow-hidden">
      
      {/* Heart icon skeleton */}
      <div className="absolute top-5 right-5 w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>

      {/* Product image skeleton */}
      <div className="2xl:w-full lg:w-56 w-full h-48 lg:h-40 2xl:h-48 flex justify-center items-center bg-gray-200 animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      </div>

      {/* Category & Name skeleton */}
      <div className="w-full flex flex-col items-start justify-start mt-4 px-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>

     
      
      {/* Quantity + Add to Cart skeleton */}
      <div className="w-full flex flex-row justify-center items-center gap-2 px-4 mt-2">
        {/* Quantity Box skeleton */}
        <div className="w-[40%] h-10 bg-gray-200 rounded-md animate-pulse"></div>
        
        {/* Add to Cart Button skeleton */}
        <div className="w-[60%] h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;