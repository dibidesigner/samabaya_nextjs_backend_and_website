import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { toast } from "react-toastify";
import axiosInstance from "@/Apicall/apiInstance";
import { fetchaddtocartList } from "@/redux/orderListSlice";
import ApiList from "@/Apicall/ApiList";


const useCart =()=>{

     const {token}= useAppSelector((state:any)=>state.tokenSlice)
     const dispatch = useAppDispatch();


     const clearCart = async () => {
   
          try {
            if(token?.success){
                  await axiosInstance.delete(ApiList.cartclear);
                  dispatch(fetchaddtocartList());
                  toast.success("Successfully Cleared Cart")
            }
            else{
              toast.error("Please login")
            }

          } catch (error) {
            toast.error("Something went Wrong")
          }

    };

    const increaseQuantity = async (baseQuantity: number, itemid: string,itemstock:number) => {
        
        
           if(baseQuantity > (itemstock - 1)){
             return;
        }
    
        const updatedQuantity = baseQuantity + 1; 
          
        const payload = { newquantity: updatedQuantity };
      
    
        try {
          if(token?.success){
            await axiosInstance.put(ApiList.increaseQuantity + "/" + itemid, payload);
            dispatch(fetchaddtocartList());
          }
          else{
            toast.error("Please Login")
          }
        } catch (error) {
          toast.error("Something went wrong")
        }
       
      };


      const decreaseQuantity = async (baseQuantity: number, itemid: string) => {
          
          const updatedQuantity = baseQuantity - 1;  
          const payload = { newquantity: updatedQuantity };
      
          if (updatedQuantity <= 0) {
              return;
            }
      
          try {
            if (token?.success){
              await axiosInstance.put(ApiList.increaseQuantity + "/" + itemid, payload);
              dispatch(fetchaddtocartList());
            }
            else{
              toast.error("Please Login")
            }
          } catch (error) {
            toast.error("Something went Wrong")
          }
      
         
        };


      const deleteAddToCartItem = async (itemid: string) => {
            try {
              if(token?.success){
                await axiosInstance.delete(ApiList.addToCart + "/" + itemid);
                dispatch(fetchaddtocartList());
              }
              else{
                toast.error("Please Login")
              }
          } catch (error) {
            toast.error("Something went wrong")
          }    
        };
        

  return {clearCart,increaseQuantity,decreaseQuantity,deleteAddToCartItem}
}

export {useCart}