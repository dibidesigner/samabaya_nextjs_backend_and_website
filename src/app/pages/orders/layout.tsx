"use client";

import { ReactNode, useEffect } from "react";
import BottomPage from "./BottomPage";
import Header from "@/components/header/page";
import Footer from "@/components/Footer";
import CardCarausel from "../home/CardCarausel";
import { useAppSelector } from "@/redux/hook/hooks";
import { useRouter } from "next/navigation";

export default function OrdersLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.tokenSlice);

  useEffect(() => {
    if (!token?.success) {
      router.replace("/");
    }
  }, [token?.success, router]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Header />

      <main className="flex-1 w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <BottomPage />
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 w-full">
            {children}
          </div>
        </div>

        {/* Carousel / Suggested Section */}
        <div className="mt-12 pt-8 border-t border-slate-200/70">
          <CardCarausel />
        </div>
      </main>

      <Footer />
    </div>
  );
}

