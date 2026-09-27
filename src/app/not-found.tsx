import Image from "next/image";
import imageObj from "../Collections/imgObj";
import Link from "next/link";

export default function NotFound(){
   return(
    <div className="w-full h-full relative">
      <Image src={imageObj.notfound} alt="Not Found" />
      <div className="absolute top-[250px] left-1/2 -translate-y-1/2">
       <Link href={"/"} className="text-green-600 hover:text-green-800 duration-300 transition-colors"> Go to Samabaya Market</Link>
      </div>
    </div>
   )
}