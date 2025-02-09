import React, { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export default function Magnetic({
    children,
    objectRef,
    isObjectLoaded,
    camera,
    ratio = 0.5,
}) {
    useEffect(() => {
        if (!isObjectLoaded || !camera) return;

        const object = objectRef.current;
        const initialPosition = { x: object.position.x, y: object.position.y };
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const xTo = gsap.quickTo(object.position, 'x', {
            ease: 'elastic.out(1, 0.5)',
            duration: 1,
            overwrite: 'auto',
        });
        const yTo = gsap.quickTo(object.position, 'y', {
            ease: 'elastic.out(1, 0.5)',
            duration: 1,
            overwrite: 'auto',
        });

        const handleMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(object);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                const point = intersect.point;

                xTo(point.x * ratio);
                yTo(point.y * ratio);
            } else {
                xTo(initialPosition.x);
                yTo(initialPosition.y);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [objectRef, isObjectLoaded, camera, ratio]);

    return children;
}
