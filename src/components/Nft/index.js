import React, { useEffect } from 'react';
import { Card } from '../../common/Card';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useWeb3Provider from '../../hooks/useWeb3Provider';

const Nft = () => {
    const [nfts, setNfts] = React.useState([]);
    const { getNFTsFromWallet, state } = useWeb3Provider();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const movingText2 = document.getElementById('moving-text2');

        gsap.fromTo(
            movingText2,
            { opacity: 1 },
            {
                opacity: 0,
                scrollTrigger: {
                    trigger: '#nft',
                    start: 'center center',
                    end: 'bottom bottom',
                    scrub: true,
                    markers: true,
                },
            },
        );

        gsap.fromTo(
            movingText2,
            { opacity: 0 },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: '#nft',
                    start: 'center center+=300',
                    end: 'center center',
                    scrub: true,
                },
            },
        );

        const fetchNfts = async () => {
            if (!state.address) {
                console.log('No address found, please connect your wallet.');
                return;
            }

            console.log('Fetching NFTs for address:', state.address);
            const data = await getNFTsFromWallet();
            console.log('NFTs fetched:', data);
            setNfts(data);
        };

        fetchNfts();
    }, [getNFTsFromWallet, state.address]);

    return (
        <div id="nft" className="flex w-full justify-end items-center h-screen">
            <div className="flex flex-col justify-center w-1/2 items-center">
                <div className="grid grid-cols-2 gap-4">
                    {nfts.slice(0, 4).map((nft, index) => (
                        <Card key={index} className="p-0">
                            <Image
                                src={nft.tokenURI}
                                alt={`NFT ${nft.tokenId}`}
                                width={200}
                                height={200}
                            />
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Nft;
