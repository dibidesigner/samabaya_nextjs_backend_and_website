import { FaIndianRupeeSign } from "react-icons/fa6";
import { IconType } from "react-icons";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoLogoAndroid } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { AiFillQuestionCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { BsCart2 } from "react-icons/bs";
import { IoMdCall } from "react-icons/io";
import { IoMdMail } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { IoIosLock } from "react-icons/io";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { LuCloudDownload} from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiResetLeftLine } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";



type ReactIconType = {
  rupees: IconType;
  heart:IconType;
  android:IconType;
  location:IconType;
  question:IconType;
  user:IconType;
  bag:IconType;
  cart:IconType;
  call:IconType;
  mail:IconType;
  plus:IconType;
  lock:IconType;
  arrow:IconType;
  rightIcon:IconType;
  download:IconType;
  delete:IconType;
  clear:IconType;
  filter:IconType
};



const ReactIcons: ReactIconType = {
  rupees: FaIndianRupeeSign,
  heart: IoMdHeartEmpty,
  android:IoLogoAndroid,
  location:IoLocationSharp,
  question:AiFillQuestionCircle,
  user:BiUser,
  bag:HiOutlineShoppingBag,
  cart:BsCart2,
  call:IoMdCall,
  mail:IoMdMail,
  plus:FiPlus,
  lock:IoIosLock,
  arrow:MdOutlineArrowRightAlt,
  rightIcon:FcOk,
  download:LuCloudDownload,
  delete:RiDeleteBin6Line,
  clear:RiResetLeftLine,
  filter:FiFilter
};

export default ReactIcons;