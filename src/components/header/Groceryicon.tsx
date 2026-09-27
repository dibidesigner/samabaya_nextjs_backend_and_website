"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import image1 from "@/Assets/carauselicon/food.png"
import image2 from "@/Assets/carauselicon/groceries.png"
import image3 from "@/Assets/carauselicon/groceries1.png"
import image4 from "@/Assets/carauselicon/grocerycart.png"
import image5 from "@/Assets/carauselicon/shoppingbag.png"
import image6 from "@Assets/carauselicon/vegetable.png"


import { Autoplay } from "swiper/modules";
import Image from "next/image";



export default function Groceryicon() {

    const arrayimage = [{
                            image:image1
                        },
                        {
                            image:image2
                        },
                        {
                            image:image3
                        },
                        {
                            image:image4
                        },{
                            image:image5
                        },{
                            image:image6
                        }
                        ]




  return (
    <div className=" w-full h-8 flex justify-center items-center">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="h-full"
      >
       {arrayimage.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              src={item.image}
              alt={`img-${index}`}
              className="w-6 h-auto object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
       
      </Swiper>
    </div>
  );
}
