"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuUser, LuShoppingBag, LuMapPin, LuKeyRound } from "react-icons/lu";

export default function MobileNavigation() {
  const pathName = usePathname();

  const btn = [
    {
      name: "Profile",
      link: "/pages/orders",
      icon: LuUser,
    },
    {
      name: "Orders",
      link: "/pages/orders/myorders",
      icon: LuShoppingBag,
    },
    // {
    //   name: "Addresses",
    //   link: "/pages/orders/address",
    //   icon: LuMapPin,
    // },
    {
      name: "Password",
      link: "/pages/orders/password",
      icon: LuKeyRound,
    },
  ];

  return (
    <div className="lg:hidden w-full mb-6">
      <div className="w-full bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/80 shadow-inner overflow-x-auto no-scrollbar">
        {btn.map((bt, index) => {
          const isActive = pathName === bt.link;
          const Icon = bt.icon;
          return (
            <Link
              href={bt.link}
              key={index}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 ${isActive
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Icon size={14} className={isActive ? "text-emerald-600" : "opacity-60"} />
              <span>{bt.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

