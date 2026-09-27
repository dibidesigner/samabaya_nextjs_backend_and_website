import { connectDB } from "@/app/db/dbconnection"
import { verifyToken } from "../../verifyToken"
import CustomerOrder from "../../Models/orderSchema"
import getUserFromToken from "../../userdata"
import { NextResponse } from "next/server"
import userModel from "../../Models/userSchema"

type QueryType ={
    status?:string,
    deliveryby?:string,
    createdAt?:{
        $gte: Date,
        $lte: Date,
    }
    
}


export async function POST(req:Request){
    try {
        await verifyToken()
        await connectDB()

        const {timefilter,status} = await req.json()


        

        const user = await getUserFromToken()

        const userdata = await userModel.findById(user?.id)


        let query:QueryType = {
            deliveryby:userdata?.fullname,
        }

        if(status){
            if(status !== "All")
            query.status = status
        }


        if (timefilter) {
            const startDate = new Date(timefilter);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(timefilter);
            endDate.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
        }
      
        const orderlist = await CustomerOrder.find(query).sort({ createdAt: -1 }).populate("userid").populate("products.productId"); 

        if(!orderlist){
            return NextResponse.json({
                message:"No Order to you"
            },{
                status:401
            })
        }

        return NextResponse.json({
            orderlist,
            success:true
        },{
            status:200
        }
    )
    } catch (error) {
        return NextResponse.json(error)
    }
}