"use client"

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ProductCart from "../../../components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCardSkeleton from "@/components/ProductCartSkeletone";
import { toast } from "react-toastify";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 2500 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 2500, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};




const CardCarausel = () => {
  const [loading, setLoading] = useState(false);
  const [productlist, setProductlist] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get("/api/website/allproductlist");
        
        const availableProducts = productRes?.data?.allproduct.filter(
          (item: any) => item.availability === true
        );
        setProductlist(availableProducts);
      } catch (error) {
        toast.error("Something went wrong")
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);


  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-2">
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={5000}
      keyBoardControl={true}
      containerClass="carousel-container"
      itemClass="carousel-item w-full h-full"
      draggable={true}
      
    >
      {productlist.map((item, index) => (
        <ProductCart key={index} item={item} />
      ))}
    </Carousel>
  );
};

export default CardCarausel;