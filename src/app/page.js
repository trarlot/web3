'use client';

import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Nft from '../components/Nft';
import { useEffect } from 'react';
export default function Home() {
    return (
        <>
            <Hero />
            <Intro />
            <Nft />
        </>
    );
}
