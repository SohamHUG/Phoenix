"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

interface AnimatedSVGProps {
    svg: string;
    duration?: number;
    shouldDraw?: boolean;
}

export default function AnimatedSVG({ svg, duration = 3, shouldDraw }: AnimatedSVGProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = svg;
        const svgElement = containerRef.current.querySelector("svg") as SVGSVGElement;
        if (!svgElement) return;

        const paths = splitPaths(svgElement);
        let totalLength = 0;
        paths.forEach(path => (totalLength += path.getTotalLength()));

        const tl = gsap.timeline();
        paths.forEach(path => {
            tl.from(path, {
                drawSVG: 0,
                ease: "none",
                duration: duration * (path.getTotalLength() / totalLength),
            });
        });
    }, [svg]);

    function splitPaths(svgEl: SVGSVGElement) {
        const toSplit = Array.from(svgEl.querySelectorAll("path"));
        const newPaths: SVGPathElement[] = [];

        toSplit.forEach(path => {
            const rawPath = MotionPathPlugin.getRawPath(path);
            const parent = path.parentNode;
            const attributes = Array.from(path.attributes);

            rawPath.forEach((segment: any) => {
                const newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                attributes.forEach(attr => newPath.setAttribute(attr.name, attr.value));

                newPath.setAttribute(
                    "d",
                    "M" + segment[0] + "," + segment[1] + "C" + segment.slice(2).join(",") + (segment.closed ? "z" : "") // La propriété closed n'existe pas sur le type number[]
                );

                parent?.insertBefore(newPath, path);
                newPaths.push(newPath);
            });

            parent?.removeChild(path);
        });

        return newPaths;
    }

    return <div className="w-full h-full flex items-center justify-center" ref={containerRef}></div>;
}
