"use client";

export default function CarouselSkeleton() {
  return (
    <div className="relative w-full overflow-x-auto">
      <div className="flex space-x-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-64 h-72 rounded-xl bg-gray-200 animate-pulse flex-shrink-0"
          >
            {/* Image placeholder */}
            <div className="h-48 w-full bg-gray-300 rounded-t-xl" />

            {/* Text placeholder */}
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-1/2 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Fake navigation arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
