import Footer from "@/components/Footer";
import Header from "@/components/header/page";

export default function besttoday(){
    return (
        <div className="w-full flex  flex-col justify-start items-center">
          <Header />
          <div className="w-[70%] h-screen flex justify-center items-center">
            Best Today
          </div>
          <Footer />
        </div>
    )
}