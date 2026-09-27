import Link from "next/link";
import CardCarausel from "./CardCarausel";

export default function TrendingProduct(prop:any) {
 

  return (
    <div className={`w-full pb-10 lg:pt-5  flex justify-center items-center`}>
      
      <div className="w-full 2xl:w-[70%] flex flex-col justify-center items-center relative">

        <div className="text-black inline-flex flex-row  lg:justify-start justify-between lg:px-0 px-4 items-start lg:items-center w-full py-4 lg:py-5 font-semi-bold text-2xl">
          <div className="lg:text-xl 2xl:text-xl text-base">{prop.titleName}</div>
          <Link href="/pages/Allproduct" className="text-xs px-7 py-1 rounded-full border border-[#BFBFBF] bg-white ml-3 text-[#C8864C]">
            See All
          </Link>
        </div>

        
        <div className="w-full ">
            <CardCarausel />
        </div>
       
        
      </div>
    </div>
  );
}