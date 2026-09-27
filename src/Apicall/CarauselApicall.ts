"use client"

import { useEffect, useState } from "react";
import ApiList from "./ApiList";
import axiosInstance from "./apiInstance";


interface CarouselImage {
  _id: string;
  url: string;
  title?: string;
  description?: string;
}

export default function useFetchCarouselImage() {
  const [images, setImages] = useState<CarouselImage[]>([]); // 
  const [carauselloading, setCarauselLoading] = useState<boolean>(true);  

  useEffect(() => {
    async function fetchImage() {
      try {
        setCarauselLoading(true);
        const res = await axiosInstance.get(ApiList.webcarausel);
        if (res.data.success) {
          setImages(res.data.data as CarouselImage[]); 
        }
        setCarauselLoading(false);
      } catch (err) {
        setCarauselLoading(false);
      } finally {
        setCarauselLoading(false);
      }
    }
    fetchImage();
  }, []);

  return { images, carauselloading };
}
