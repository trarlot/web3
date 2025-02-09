import React from 'react';
import { Card } from '../../common/Card';
import Image from 'next/image';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Intro = () => {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const movingText = document.getElementById('moving-text');

        gsap.fromTo(
            movingText,
            { opacity: 1 },
            {
                opacity: 0,
                scrollTrigger: {
                    trigger: '#intro',
                    start: 'bottom bottom-=100',
                    end: 'bottom bottom-=400',
                    scrub: true,
                },
            },
        );

        gsap.fromTo(
            movingText,
            { opacity: 0 },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: '#USDC',
                    start: 'top bottom',
                    end: 'bottom center+=300',
                    scrub: true,
                },
            },
        );
    }, []);
    return (
        <div id="intro" className="flex w-full ">
            <div className="w-1/2 h-screen flex flex-col justify-center  items-center gap-12 ">
                <Card>
                    <div className=" w-[400px] flex flex-col gap-5">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start gap-2">
                                <Image
                                    src="/assets/bitcoinLogo.svg"
                                    alt="bitcoin icon"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-gray-400">Bitcoin</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Image
                                    className="min-h-[50px] "
                                    src="/assets/bitcoinGraph.svg"
                                    alt="bitcoin graph"
                                    width={250}
                                    height={50}
                                />
                                <div className="flex gap-3">
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/assets/arrowDown.svg"
                                        alt="arrow down"
                                    />
                                    <p className="text-[#ffb800]">9.05 %</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>USD 95,000.50 $</p>
                            <p className="text-gray-400">BTC</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className=" w-[400px] flex flex-col gap-5">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start gap-2">
                                <Image
                                    src="/assets/bitcoinLogo.svg"
                                    alt="bitcoin icon"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-gray-400">Bitcoin</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Image
                                    className="min-h-[50px] "
                                    src="/assets/bitcoinGraph.svg"
                                    alt="bitcoin graph"
                                    width={250}
                                    height={50}
                                />
                                <div className="flex gap-3">
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/assets/arrowDown.svg"
                                        alt="arrow down"
                                    />
                                    <p className="text-[#ffb800]">9.05 %</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>USD 95,000.50 $</p>
                            <p className="text-gray-400">BTC</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div id="USDC" className=" w-[400px] flex flex-col gap-5">
                        <div className="flex justify-between">
                            <div className="flex flex-col items-start gap-2">
                                <Image
                                    src="/assets/bitcoinLogo.svg"
                                    alt="bitcoin icon"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-gray-400">Bitcoin</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Image
                                    className="min-h-[50px] "
                                    src="/assets/bitcoinGraph.svg"
                                    alt="bitcoin graph"
                                    width={250}
                                    height={50}
                                />
                                <div className="flex gap-3">
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/assets/arrowDown.svg"
                                        alt="arrow down"
                                    />
                                    <p className="text-[#ffb800]">9.05 %</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>USD 95,000.50 $</p>
                            <p className="text-gray-400">BTC</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Intro;
