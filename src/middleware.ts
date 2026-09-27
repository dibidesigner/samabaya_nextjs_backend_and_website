import { NextRequest, NextResponse } from "next/server";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [     
        "https://samabayasmartbazar.com",
        "https://store.samabayasmartbazar.com" ,
      ]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://192.168.29.78:3000",
        "http://192.168.29.78:5173",
        "http://10.136.81.25:5173",
        "http://10.136.81.259:3000",
        "http://172.31.0.1:3000",
        "http://10.72.112.47:5173"
        

      ];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const response = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
