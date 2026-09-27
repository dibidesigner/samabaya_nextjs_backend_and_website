import axiosInstance from "@/Apicall/apiInstance";
import ApiList from "@/Apicall/ApiList";
import { toast } from "react-toastify";



const useOrder =()=>{

   const printBill = async (id: string) => {

        try {

          const res = await axiosInstance.post(
            ApiList.billinglist,
            { id },
            {
              responseType: "blob"
            }
          );

          const blob = new Blob([res.data], { type: "application/pdf" });

          const url = window.URL.createObjectURL(blob);

          const printWindow = window.open(url);

          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }

        } catch (error) {

          toast.error("Failed to Print Bill");

        }

  }; 

    return {printBill}
}

export default useOrder