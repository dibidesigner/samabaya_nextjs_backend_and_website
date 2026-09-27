
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




export default function ProductCarousel() {

const dispatch = useAppDispatch()

const {carauselimage,carauselloading} = useAppSelector((state)=>state.CarauselStore)



useEffect(()=>{
  if(carauselimage.length == 0){
    dispatch(carauseImageFetching())
  }
},[dispatch,carauselimage])





 
return (
    <div className="relative w-full  mx-auto overflow-hidden">

      {
        carauselloading ? 

        <div className="w-full h-[700px] bg-gray-200 animate-pulse flex justify-center items-center">
            <div>Loading...</div>
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
          carauselimage.map((item:any,index:number)=>(
            <SwiperSlide key={index}>
               <img
                  src={item.carauselImage}
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
