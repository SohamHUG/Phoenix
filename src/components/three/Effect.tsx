// import { useEffect, useRef } from "react";
// import { useThree, useFrame } from "@react-three/fiber";
// import PostProcessing from "./postprocessing/index.js";

// export default function Effects() {
//     const { gl, scene, camera, size } = useThree();
//     const postProcessingRef = useRef<PostProcessing | null>(null);

//     useEffect(() => {
//         postProcessingRef.current = PostProcessing.getInstance({
//             renderer: gl,
//             scene,
//             camera,
//             sizes: { width: size.width, height: size.height, pixelRatio: window.devicePixelRatio },
//             debug: { active: false } // mettre true si tu veux le gui
//         });

//         return () => postProcessingRef.current?.dispose();
//     }, [gl, scene, camera, size]);

//     useFrame(() => {
//         postProcessingRef.current?.update();
//     }); // le "1" force l'exécution après le render normal

//     return null;
// }
