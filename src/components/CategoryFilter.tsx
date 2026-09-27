"use client";

import Link from "next/link";
import fruits from "@/Assets/categoryimages/Fruits.png";
import dairy from "@/Assets/categoryimages/dairy.png";
import grocery from "@/Assets/categoryimages/grocery.png";
import snacks from "@/Assets/categoryimages/snacks.png";
import personal from "@/Assets/categoryimages/personal.png";
import household from "@/Assets/categoryimages/household.png";

const CategoryFilter = () => {
  const categories = [
    {
      image: fruits,
      name: "Fruit & Vegetables",
      color: "from-emerald-50 to-green-100/60",
      border: "border-emerald-200/50",
      tag: "Fresh Harvest",
    },
    {
      image: dairy,
      name: "Dairy & Eggs",
      color: "from-amber-50 to-orange-100/60",
      border: "border-amber-200/50",
      tag: "Farm Fresh",
    },
    {
      image: grocery,
      name: "Grocery & Staples",
      color: "from-yellow-50 to-amber-100/60",
      border: "border-yellow-200/50",
      tag: "Daily Needs",
    },
    {
      image: snacks,
      name: "Snacks & Beverages",
      color: "from-rose-50 to-pink-100/60",
      border: "border-rose-200/50",
      tag: "Crispy & Sweet",
    },
    {
      image: personal,
      name: "Personal Care",
      color: "from-blue-50 to-indigo-100/60",
      border: "border-blue-200/50",
      tag: "Self Care",
    },
    {
      image: household,
      name: "Household Needs",
      color: "from-teal-50 to-cyan-100/60",
      border: "border-teal-200/50",
      tag: "Home Care",
    },
  ];

  return (
    <section className="w-full flex justify-center items-center py-10 lg:py-14 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Categories
            </span>
            <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 mt-2">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/allproduct"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((item, idx) => (
            <Link
              href="/allproduct"
              key={idx}
              className={`bg-gradient-to-b ${item.color} border ${item.border} rounded-2xl p-4 flex flex-col items-center text-center justify-between shadow-soft hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative overflow-hidden`}
            >
              <div className="w-full flex justify-end">
                <span className="text-[10px] font-bold text-slate-500 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  {item.tag}
                </span>
              </div>

              <div className="my-3 relative w-20 h-20 flex items-center justify-center">
                <img
                  src={item.image.src}
                  alt={item.name}
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                />
              </div>

              <span className="font-bold text-xs lg:text-sm text-slate-800 group-hover:text-emerald-800 transition-colors leading-snug">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;