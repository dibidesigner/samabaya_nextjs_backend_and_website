"use client";

import Header from "@/components/header/page";
import { TiStarFullOutline } from "react-icons/ti";
import { FaRegHeart } from "react-icons/fa6";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoMdHeart } from "react-icons/io";
import ApiList from "@/Apicall/ApiList";
import axiosInstance from "@/Apicall/apiInstance";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { wishListSliceFetch } from "@/redux/wishListSlice";
import { fetchaddtocartList } from "@/redux/orderListSlice";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { LuShoppingCart, LuZap, LuCircleCheck, LuInfo, LuMinus, LuPlus, LuChevronRight } from "react-icons/lu";

export default function ProductDetails() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const itemid = params?.id;
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<productType | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);

  const { wishList = [] } = useAppSelector((state: any) => state.wishliststore) || {};
  const { token } = useAppSelector((state: any) => state.tokenSlice);

  const checklike = (id: any) => wishList.some((state: any) => state._id === id);

  async function Likehit(id: any) {
    if (!token?.success) {
      toast.info("Please login to save favorites");
      return;
    }
    try {
      const res = await axiosInstance.post(ApiList.like, { itemid: id });
      if (res.data && res.data.success === true) {
        dispatch(wishListSliceFetch());
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      if (token?.success) {
        dispatch(wishListSliceFetch());
      }
    }
  }

  const increase = (itemstock: number) => {
    setQuantity((prev) => (prev < itemstock ? prev + 1 : prev));
  };

  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  type productType = {
    [k in
    | "imageBase641"
    | "imageBase642"
    | "availability"
    | "imageBase643"
    | "_id"
    | "imageBase644"
    | "imageBase645"
    | "productName"
    | "productCategory"
    | "benifit"
    | "description"]: string;
  } & {
    [k in "stock" | "quantity" | "productUnit" | "price"]: number;
  };

  const addToCart = (id: any, price: number) => {
    if (!token?.success) {
      toast.info("Please login to add to cart");
      return;
    }

    const payload = {
      itemid: id,
      quantity,
      itemPrice: price,
    };

    const sendAddtoCart = async () => {
      try {
        const res = await axiosInstance.post(ApiList.addToCart, payload);
        if (res.data.success) {
          toast.success("Added to cart successfully!");
          dispatch(fetchaddtocartList());
        } else {
          toast.error("Could not add item to cart");
        }
      } catch (error) {
        toast.error("Failed to add product");
      }
    };

    sendAddtoCart();
  };

  const buynow = (id: any, price: number) => {
    if (!token?.success) {
      toast.info("Please login to purchase");
      return;
    }

    const payload = {
      itemid: id,
      quantity,
      itemPrice: price,
    };

    const sendAddtoCart = async () => {
      try {
        const res = await axiosInstance.post(ApiList.addToCart, payload);
        if (res.data.success) {
          dispatch(fetchaddtocartList());
          router.push("/checkout");
        } else {
          toast.error("Failed to proceed to checkout");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    sendAddtoCart();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${imgRef.current.src})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${width * 2.2}px ${height * 2.2}px`,
    });
  };

  useEffect(() => {
    if (!itemid) return;
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.post(`${ApiList.singleProduct}`, itemid);
        setProduct(data?.singleoproduct);
        if (data?.singleoproduct?.imageBase641) {
          setActiveImage(data.singleoproduct.imageBase641);
        }
      } catch (err) {
        toast.error("Could not load product details");
      }
    };
    fetchData();
  }, [itemid]);

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <ToastContainer />
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 lg:p-8 shadow-soft animate-pulse">
            <div className="lg:col-span-5 h-96 bg-slate-200 rounded-2xl"></div>
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
              <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [
    product.imageBase641,
    product.imageBase642,
    product.imageBase643,
    product.imageBase644,
    product.imageBase645,
  ].filter(Boolean);

  const displayImage = activeImage || product.imageBase641;
  const isOutOfStock = Number(product.stock || 0) <= 0 || !product.availability;

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Header />
      <ToastContainer />

      <main className="flex-1 w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] mx-auto py-6 lg:py-10">

        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Home
          </Link>
          <LuChevronRight size={12} className="text-slate-400" />
          <Link href="/allproduct" className="hover:text-emerald-700 transition-colors">
            Catalog
          </Link>
          <LuChevronRight size={12} className="text-slate-400" />
          <span className="text-emerald-800 font-bold truncate max-w-xs">
            {product.productName}
          </span>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">

          {/* Left Column: Image Gallery & Zoom */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              className="w-full h-[360px] lg:h-[420px] bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 relative overflow-hidden group cursor-crosshair"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={displayImage}
                alt={product.productName}
                ref={imgRef}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              <button
                onClick={() => Likehit(product._id)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-xs rounded-full shadow-md text-slate-400 hover:text-rose-500 transition-colors"
                title={checklike(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {checklike(product._id) ? (
                  <IoMdHeart className="w-5 h-5 text-rose-500" />
                ) : (
                  <FaRegHeart className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgSrc)}
                    className={`h-16 rounded-xl border-2 overflow-hidden p-1 bg-slate-50/60 transition-all ${displayImage === imgSrc
                      ? "border-emerald-600 shadow-xs"
                      : "border-slate-100 opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Rating Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {product.productCategory || "Grocery"}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-amber-50/60 px-2.5 py-1 rounded-full border border-amber-100">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <TiStarFullOutline key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <span className="font-bold text-amber-900">4.8</span>
                  <span className="text-slate-400">(24 Reviews)</span>
                </div>
              </div>

              {/* Title & Unit */}
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.productName}
              </h1>

              <div className="text-xs font-semibold text-slate-400 mt-1">
                Net Weight: <span className="text-slate-700">{product.quantity} {product.productUnit}</span>
              </div>

              {/* Price & Stock Badge */}
              <div className="mt-5 py-4 px-5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Special Offer Price</div>
                  <div className="text-3xl font-black text-emerald-800 flex items-baseline">
                    <span className="text-lg mr-0.5">₹</span>
                    <span>{product.price}</span>
                    <span className="text-sm font-normal text-slate-400 ml-1">.00</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${isOutOfStock
                      ? "bg-rose-100 text-rose-700"
                      : Number(product.stock) <= 5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                      }`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : `${product.stock} Units Left in Stock`}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Buy Buttons */}
              {!isOutOfStock && (
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Stepper */}
                  <div className="flex items-center justify-between bg-slate-100 rounded-2xl p-1.5 border border-slate-200/80 w-36">
                    <button
                      onClick={decrease}
                      className="w-9 h-9 bg-white hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition-colors shadow-xs"
                    >
                      <LuMinus size={14} />
                    </button>
                    <span className="font-extrabold text-sm text-slate-800">{quantity}</span>
                    <button
                      onClick={() => increase(product.stock)}
                      className="w-9 h-9 bg-white hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition-colors shadow-xs"
                    >
                      <LuPlus size={14} />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={() => addToCart(product._id, product.price)}
                    className="flex-1 py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <LuShoppingCart size={16} />
                    <span>Add To Cart</span>
                  </button>

                  {/* Buy Now CTA */}
                  <button
                    onClick={() => buynow(product._id, product.price)}
                    className="flex-1 py-3.5 px-6 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <LuZap size={16} />
                    <span>Buy Now</span>
                  </button>
                </div>
              )}

              {/* Benefits Section */}
              {product.benifit && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-3">
                    Key Product Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.benifit
                      .split("•")
                      .filter((b) => b.trim() !== "")
                      .map((point, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50 text-xs font-semibold text-slate-700"
                        >
                          <LuCircleCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{point.trim()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              {product.description && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Description
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Quality Note */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <LuInfo className="text-amber-500 flex-shrink-0" />
              <span>Packaging image/color may vary based on fresh crop batches.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

