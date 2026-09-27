
"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/Assets/css/swipercss.css"
import RingLoader from "../app/pages/home/RoundLoader";
import { useAppDispatch,useAppSelector } from "@/redux/hook/hooks";
import { useEffect } from "react";
import { carauseImageFetching } from "@/redux/Carauselmages";
import { mobilecarauseImageFetching } from "@/redux/mobilecarausel";




export default function MobileCarusel() {

const dispatch = useAppDispatch()

const {mobilecarauselimage,mobilecarauselloading,mobilecarauselReload} = useAppSelector((state)=>state.mobilecarausel)


useEffect(()=>{
  if(mobilecarauselimage.length == 0){
    dispatch(mobilecarauseImageFetching())
  }

},[dispatch,mobilecarauselimage])





 
return (
    <div className="relative w-full  mx-auto overflow-hidden">

      {
        mobilecarauselloading ? 

       <div className="w-full  space-y-3 bg-white rounded-xl shadow">
          <div className="w-full h-[200px] bg-gray-300 rounded-lg animate-pulse opacity-80"></div>
        </div>
        
        :
      
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation={true}
        loop={true}
        autoplay={{ delay: 500, disableOnInteraction: true }}
        modules={[Navigation]}
        className=""
      >
        {
          mobilecarauselimage.map((item:any,index:number)=>(
            <SwiperSlide key={index}>
               <img
                  src={item.mobilecarauselImage}
                  alt="Slide 1"
                  className="w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
            </SwiperSlide>
          ))
        }
        
      
      </Swiper>
      }
    </div>
  );
}
