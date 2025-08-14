"use client"

import Image from "next/image";
import { products } from "@/Data/Products";


export default function Merch() {
    return (
        <div className="w-full h-full flex flex-col items-center mt-28">
            <div className="relative w-full max-w-[1824px]">
                {/* Image de fond */}
                <Image
                    src="/img/merch/banner-merch.png"
                    alt="Banner Phoenix"
                    width={1824}
                    height={311}
                    className="w-full h-auto"
                />

                {/* Contenu superposé */}
                <div className="absolute inset-0 flex justify-between items-center px-16">
                    <p className="font-geist font-semibold text-4xl leading-[80%] tracking-[-0.06em] text-white w-[380px] effect-shine">
                        /CHECKOUT OUR MERCH
                    </p>

                    <Image
                        src="/logo.svg"
                        alt="logo phoenix"
                        width={167}
                        height={61}
                        className="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />

                    <p className="font-geist font-semibold text-4xl leading-[80%] tracking-[-0.06em] text-white cursor-default effect-shine">
                        FLAT 50% OFF
                    </p>
                </div>
            </div>

            <div className="flex justify-between w-full max-w-[1824px]">
                {products.map((product, idx) => (
                    <div
                        key={idx}
                        className="relative overflow-hidden group "
                        style={{ flex: '0 1 300px', height: '498px' }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={498}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-10"
                        />

                        <div className="absolute bottom-0 left-0 w-[349px] h-[145px] bg-white/90 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center gap-2.5">
                            <h3 className="font-inter font-normal text-4xl">{product.name}</h3>
                            <p className="text-xs bg-[#E9E7DE] w-fit px-2 py-1 gap-2.5 font-inter">
                                <Image
                                    src="/img/star.png"
                                    alt="star"
                                    width={10}
                                    height={10}
                                    className="inline-block mr-1"
                                />
                                {product.rating}, {product.reviews}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-inter font-medium text-2xl">{product.price} USD</p>
                                <p className="font-inter font-normal text-xs line-through text-gray-400">{product.oldPrice}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
}