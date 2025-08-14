"use client";

import Image from "next/image";
import { div } from "three/tsl";

export default function NewsLetter() {
    return (
        <div className="flex justify-center w-full h-full items-center">
            <div className="w-[1824px] h-[783px] rounded-xl bg-center bg-cover mt-20 p-5 flex flex-col justify-between"
                style={{ backgroundImage: "url('/img/newsletter-bg.png')" }}>

                <div className="bg-black/40 w-[521px] py-20 px-10 rounded-3xl flex flex-col gap-6">
                    <p className="font-geist font-semibold text-4xl leading-[80%] tracking-[-0.06em] text-white">JOIN THE PHOENIX RISING</p>
                    <p className="text-white font-inter font-normal text-xl">Be the first to hear new tracks, get early merch drops, and exclusive content.</p>

                    <input type="email" placeholder="Enter your email" className="border-b border-white placeholder:text-white placeholder:font-inter placeholder:font-normal placeholder:text-xl" />
                    <div className="w-full flex justify-end">
                        <button className="py-2 px-3 bg-white rounded-4xl hover:cursor-pointer hover:bg-black/5 hover:text-white transition-all duration-300 font-inter font-normal tracking-[-0.02em] text-xl">Submit</button>
                    </div>
                </div>

                <div className="flex justify-between items-end w-full">

                    <div className="w-1/3"></div>

                    <p className="font-inter font-light text-[16px] text-white w-1/3">
                        Copyright: “© 2025 Phoenix / B-WEEK Entertainment. All Rights Reserved.”
                    </p>

                    <div className="flex flex-col gap-5 w-1/3 items-end">
                        <div className="flex gap-3">
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer">
                                LINKEDIN
                            </button>
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer">
                                CONTACT US
                            </button>
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer">
                                INSTAGRAM
                            </button>
                        </div>
                        <p className="text-white font-light font-inter tracking-[-0.04em] text-xs">Design By Gaurav Mali | Developed By Soham HUGUENIN</p>
                    </div>
                </div>



            </div>
        </div>
    );
}
