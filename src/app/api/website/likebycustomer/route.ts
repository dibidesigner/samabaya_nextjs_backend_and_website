import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/app/db/dbconnection"
import getUserFromToken from "../../userdata"
import { verifyToken } from "../../verifyToken"
import wishListModel from "../../Models/wishListSchema"



export async function POST(req:NextRequest){
    try {
        
        await verifyToken()
        await connectDB()

        const { itemid } = await req.json()
        const user = await getUserFromToken()

        if (!user || !user.id) {
            return NextResponse.json({
                message: "Authentication required."
            }, {
                status: 401
            })
        }
        
        const userid = user.id
        const productToAdd = itemid 

        if (!productToAdd) {
             return NextResponse.json({
                message: "Product ID is required."
            }, {
                status: 400
            })
        }


        let wishlist = await wishListModel.findOne({ user: userid });
        let updateOperation: any;
        let message: string;

        if (!wishlist) {
            wishlist = await wishListModel.create({
                user: userid,
                product: [productToAdd]
            });
            message = "Product added to a newly created wishlist.";


            return NextResponse.json({
                message: message,
                wishlist: wishlist
            }, {
                status: 200
            });
        }
        
 
        const isProductOnWishlist = wishlist.product.some((id: string) => id.toString() === productToAdd.toString());
        
        if (isProductOnWishlist) {
            updateOperation = { $pull: { product: productToAdd } };
            message = "Product removed from wishlist successfully.";
        } else {
            updateOperation = { $push: { product: productToAdd } };
            message = "Product added to wishlist successfully.";
        }
        

        const updatedWishlist = await wishListModel.findOneAndUpdate(
            { user: userid }, 
            updateOperation,
            { new: true } 
        );

        return NextResponse.json({
            message: message,
            wishlist: updatedWishlist || []
        }, {
            status: 200
        });

    } catch (error) {

        return NextResponse.json({
            message: "An internal server error occurred.",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    } 
}


export async function GET(){
    try {
        await verifyToken()
        await connectDB()

        

        const user = await getUserFromToken()

        if (!user) {
            return NextResponse.json({
                message: "Authentication required."
            }, {
                status: 401
            })
        }

        const userid = user.id

        const wishlist = await wishListModel.find({user:userid}).populate("product")
        

        if(!wishlist){
            return NextResponse.json({
                message:"Wish List not found"
            },{
                status:401
            })
        }

        return NextResponse.json({
            wishlist
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json(
            {
                "message":"Technical Issue is there",
                "success":false
            },
            {
                status:500
            }
        )
    }
}
