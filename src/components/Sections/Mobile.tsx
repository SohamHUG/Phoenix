"use client"

import Image from "next/image"

export default function Mobile() {
    return (
        <div className="flex flex-col items-center justify-between h-screen text-white p-10">
            <div className="flex justify-start w-full">
                <div className="w-[60%]">
                    <Image
                        src={'/logo.svg'}
                        alt="Logo phoenix"
                        width={12}
                        height={12}
                        className=""
                    />
                </div>

            </div>

            <div className="flex flex-col items-center gap-5">
                <Image
                    src="/smile.svg"
                    alt="Smile emote"
                    width={120}
                    height={120}
                />
                <p className="font-geist font-semibold text-2xl text-center tracking-[-0.06em]">This experience is optimized for laptop and desktop screens</p>
            </div>

            <p className="font-inter font-semibold text-xs text-center leading-[120%]">Please revisit the link on your computer for the full immersive experience</p>
        </div>
    )
}