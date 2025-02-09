'use client';
import Eth from '../Eth';
import gsap from 'gsap';
import { useEffect } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        // Animation pour faire monter et disparaître le titre
        const titleElement = document.getElementById('title'); // Assurez-vous que l'élément a cet ID
        const subtitleElement = document.getElementById('subtitle'); // Assurez-vous que l'élément a cet ID
        if (titleElement && subtitleElement) {
            gsap.to(titleElement, {
                y: -100, // Déplace le titre vers le haut
                opacity: 0, // Fait disparaître le titre
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top', // Commence l'animation quand le titre atteint le centre de l'écran
                    end: 'top top-=100', // Termine l'animation quand le titre atteint le haut de l'écran
                    scrub: true, // L'animation suit le défilement
                },
            });
            gsap.to(subtitleElement, {
                y: -100, // Déplace le titre vers le haut
                opacity: 0, // Fait disparaître le titre
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top', // Commence l'animation quand le titre atteint le centre de l'écran
                    end: 'top top-=100', // Termine l'animation quand le titre atteint le haut de l'écran
                    scrub: true, // L'animation suit le défilement
                },
            });
        }
    }, []);
    return (
        <div
            id="hero"
            className="flex relative  items-center font-[family-name:var(--font-geist-sans)] radial-gradient-bg z-[-5]">
            <Eth />
            <div className="flex relative justify-center items-center w-[100vw] h-[100vh]">
                <p
                    id="title"
                    className="text-white text-4xl w-72 text-center font-bold mt-28">
                    Welcome to the Web3 world
                </p>
                <p
                    id="subtitle"
                    className="text-gray-400 text-2xl w-72 text-center font-light mt-20 absolute bottom-20">
                    SCROLL DOWN
                </p>
            </div>
        </div>
    );
}
