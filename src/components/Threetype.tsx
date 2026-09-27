"use client";

import Link from "next/link";
import fresh from "@/Assets/whychoose/fresh.png";
import grocery from "@/Assets/whychoose/grocerybanner.png";
import personal from "@/Assets/whychoose/care.png";
import { LuArrowRight } from "react-icons/lu";

const Threetype = () => {
  const bannerdata = [
    {
      image: fresh,
      title: "Fresh Fruits & Vegetables",
      subtitle: "100% Organic & Farm Fresh",
      gradient: "from-emerald-500/10 via-emerald-100/50 to-green-50",
      border: "border-emerald-200/60",
      badgeBg: "bg-emerald-600",
      badgeText: "Fresh Offer",
      textColor: "text-emerald-950",
    },
    {
      image: grocery,
      title: "Grocery Staples Store",
      subtitle: "Best Price Guaranteed Daily",
      gradient: "from-amber-500/10 via-amber-100/50 to-orange-50",
      border: "border-amber-200/60",
      badgeBg: "bg-amber-600",
      badgeText: "Best Savings",
      textColor: "text-amber-950",
    },
    {
      image: personal,
      title: "Personal Care Essential",
      subtitle: "Top Brands & Daily Care",
      gradient: "from-sky-500/10 via-sky-100/50 to-blue-50",
      border: "border-sky-200/60",
      badgeBg: "bg-sky-600",
      badgeText: "Wellness",
      textColor: "text-sky-950",
    },
  ];

  return (
    <section className="w-full flex justify-center items-center py-8 lg:py-12 bg-white">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bannerdata.map((item, idx) => (
          <Link
            href="/allproduct"
            key={idx}
            className={`relative bg-gradient-to-br ${item.gradient} border ${item.border} rounded-3xl p-6 lg:p-7 flex items-center justify-between shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden`}
          >
            {/* Left Content */}
            <div className="flex flex-col justify-between h-full z-10 max-w-[60%]">
              <div>
                <span
                  className={`${item.badgeBg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3 shadow-xs`}
                >
                  {item.badgeText}
                </span>
                <h3 className={`font-extrabold text-lg lg:text-xl ${item.textColor} leading-snug`}>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                <span>Shop Now</span>
                <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Right Image */}
            <div className="w-32 lg:w-36 h-32 flex items-center justify-center relative z-10">
              <img
                src={item.image.src}
                alt={item.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Threetype;