"use client";

import imageObj from "@/Collections/imgObj";

const whyChooseData = [
  {
    id: 1,
    image: imageObj.image1.src,
    title: "Fresh & Quality",
    description: "Handpicked fresh products for you and your family",
    color: "from-emerald-50 to-green-100/40",
  },
  {
    id: 2,
    image: imageObj.image2.src,
    title: "Fast Delivery",
    description: "On-Time delivery at your doorstep across Bhubaneswar",
    color: "from-amber-50 to-orange-100/40",
  },
  {
    id: 3,
    image: imageObj.image3.src,
    title: "Best Price",
    description: "Competitive prices & great cooperative savings every day",
    color: "from-yellow-50 to-amber-100/40",
  },
  {
    id: 4,
    image: imageObj.image4.src,
    title: "100% Secure",
    description: "Secure digital payments & trusted order protection",
    color: "from-sky-50 to-blue-100/40",
  },
  {
    id: 5,
    image: imageObj.image5.src,
    title: "24x7 Support",
    description: "Dedicated assistance whenever you need help",
    color: "from-teal-50 to-cyan-100/40",
  },
];

const Whychoose = () => {
  return (
    <section className="w-full flex justify-center items-center py-12 lg:py-16 bg-slate-50/70 border-t border-slate-100">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-[75%] flex flex-col items-center gap-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Our Promises
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">
            Why Choose <span className="text-emerald-700">Samabaya Smart Bazar?</span>
          </h2>
          <p className="text-xs lg:text-sm text-slate-500 font-medium mt-1">
            Empowering Bhubaneswar with fresh daily essentials, trusted quality, and cooperative value.
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {whyChooseData.map((item) => (
            <div
              key={item.id}
              className={`bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
            >
              {/* Image Icon Box */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 object-contain drop-shadow-xs"
                />
              </div>

              {/* Title & Content */}
              <div>
                <h3 className="font-bold text-sm lg:text-base text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Whychoose;