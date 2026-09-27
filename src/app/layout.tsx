
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "./Providers";
import "@/app/index.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Samabaya Smart Bazar",
  description: "Buy groceries online",
  icons: {
    icon: "/faviconsamabaya.png",
    shortcut: "/faviconsamabaya.png",
    apple: "/faviconsamabaya.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className}`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


