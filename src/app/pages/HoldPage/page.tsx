import Image from "next/image";

export default function HoldPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#166534] via-[#209632] to-[#74A35B] flex items-center justify-center px-6 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

            {/* Main Card */}
            <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl flex flex-col items-center shadow-2xl px-8 py-16 md:px-12 text-center">

                {/* Status Icon */}
                {/* <div className="mx-auto mb-7 w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#209632] flex items-center justify-center shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14M12 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div> */}
                <Image
                    src="/Demologo.png"
                    alt="Logo"
                    width={200}
                    height={80}
                    priority
                />

                {/* Small Label */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-green-50 border border-green-100 text-[#209632] text-xs font-semibold uppercase tracking-wider mt-3">
                    <span className="w-2 h-2 rounded-full bg-[#209632] animate-pulse" />
                    Offline Store
                </span>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                    We’re Currently Serving
                    <span className="block text-[#209632] mt-1">
                        Offline Stores Only
                    </span>
                </h1>

                {/* Description */}
                <p className="mt-5 text-gray-500 text-sm md:text-base leading-7 max-w-md mx-auto">
                    Our online store is currently unavailable. You can still
                    visit our physical store and continue shopping with us.
                </p>

                {/* Divider */}
                <div className="my-8 h-px bg-gray-100" />

                {/* Store Status */}
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span>Physical stores are open and serving customers</span>
                </div>

            </div>
        </div>
    );
}