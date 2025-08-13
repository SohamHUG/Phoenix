"use client";
import React, { useEffect, useRef } from "react";

export default function BackgroundVid() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('timeupdate', () => {
            if (video.currentTime > 11.4) {
                video.currentTime = 0.1;
            }
        });
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10"
        >
            <source src="/background_video.mp4" type="video/mp4" />
        </video>
    );
}