import { NextResponse } from "next/server";
import { verifyToken } from "../../verifyToken";

export async function POST() {
    try {
        await verifyToken()
        const response = await fetch(
            "https://developers.hostinger.com/api/vps/v1/virtual-machines",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.HOSTINGER_API_TOKEN}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to connect to Hostinger API",
            },
            { status: 500 }
        );
    }
}