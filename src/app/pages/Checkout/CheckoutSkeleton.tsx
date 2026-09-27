export default function CheckoutSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-3 animate-pulse">
      <div className="2xl:w-[70%] w-[90%] grid grid-cols-12 gap-[15px]">
        
        {/* Left side */}
        <div className="col-span-8 bg-white p-4 rounded-lg shadow-md">
          {/* Checkout table skeleton */}
          <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>

          {/* Delivery Address */}
          <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-5">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>

            {/* Address list skeleton */}
            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="w-full flex flex-row justify-between items-center p-4 border border-gray-200 rounded-lg mb-2"
              >
                <div className="w-full flex flex-col gap-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            ))}

            {/* New address form skeleton */}
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-5">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Order Summary */}
        <div className="col-span-4 bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>

          <div className="h-8 w-32 mx-auto bg-gray-200 rounded mb-6"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
