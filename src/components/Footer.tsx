"use client";

import storelogo from "@/Assets/logo/storelogo.png";
import Image from "next/image";
import facebook from "@/Assets/logo/facebook.png";
import instagram from "@/Assets/logo/instagram.png";
import twitter from "@/Assets/logo/twitter.png";
import Link from "next/link";
import { useAppSelector } from "../redux/hook/hooks";
import { LuPhone, LuMail, LuMapPin, LuShieldCheck, LuSparkles } from "react-icons/lu";

export default function Footer() {
  const { details } = useAppSelector((state: any) => state.contactdetails);

  const socialLinks = [
    { image: facebook, alt: "Facebook", link: "#" },
    { image: instagram, alt: "Instagram", link: "#" },
    { image: twitter, alt: "Twitter", link: "#" },
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80">
      {/* Upper Main Footer Grid */}
      <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Store Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={storelogo}
              alt="Sisupalgarh Cooperative Logo"
              className="h-12 w-auto object-contain bg-white/10 p-1.5 rounded-xl backdrop-blur-xs border border-white/10"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                Cooperative Store
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {details?.storename || "Samabaya Smart Bazar"}
              </h3>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mt-1">
            Empowering local communities in Bhubaneswar with fresh organic produce, daily groceries, and cooperative savings delivered directly to your doorstep.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mt-1">
            <LuShieldCheck className="w-4 h-4" />
            <span>Government Registered Cooperative</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 w-fit">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2 mt-1">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>• Home Page</span>
              </Link>
            </li>
            <li>
              <Link href="/allproduct" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>• All Product Catalog</span>
              </Link>
            </li>
            <li>
              <Link href="/pages/orders/myorders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>• Track My Orders</span>
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>• Shopping Cart & Checkout</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact & Store Support */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 w-fit">
            Contact & Support
          </h4>
          <div className="flex flex-col gap-2.5 mt-1">
            <div className="flex items-center gap-2.5 text-slate-300">
              <LuMapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sisupalgarh, Bhubaneswar, Odisha</span>
            </div>
            {details?.mobile && (
              <a href={`tel:${details.mobile}`} className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors">
                <LuPhone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 {details.mobile}</span>
              </a>
            )}
            {details?.emailid && (
              <a href={`mailto:${details.emailid}`} className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors">
                <LuMail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{details.emailid}</span>
              </a>
            )}
          </div>
        </div>

        {/* Col 4: Social & Community */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 w-fit">
            Connect With Us
          </h4>
          <p className="text-slate-400 text-xs">
            Follow our official social pages for daily fresh arrivals, seasonal discounts, and special offers!
          </p>
          <div className="flex items-center gap-3 mt-1">
            {socialLinks.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-700 border border-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Image src={item.image} alt={item.alt} className="w-4 h-4 object-contain brightness-125" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="w-full bg-slate-900/90 border-t border-slate-800/60 py-4 px-4 text-center text-[11px] text-slate-500">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Samabaya Smart Bazar</span>. All rights reserved.
          </div>
          <div className="text-slate-400">
            Developed & Maintained by <span className="text-emerald-400 font-medium">{details?.developerInformation || "Development Team"}</span> under <span className="text-slate-300">{details?.copyrightDetails || "Sisupalgarh Cooperative"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}