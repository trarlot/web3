'use client';

import { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';

import { useWeb3Context } from '../../hooks/useWeb3Context';

import Link from 'next/link';

const BSCTChainID = 97;

export default function Nav() {
    const {
        connectWallet,
        disconnect,
        getBalance,
        state: { isAuthenticated, address, currentChain, provider },
    } = useWeb3Context();
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            const walletBalance = await getBalance();
            setBalance(walletBalance);
        };

        if (isAuthenticated) {
            fetchBalance();
        }
    }, [isAuthenticated, getBalance]);

    return (
        <div className="w-full h-20 px-4 flex items-center">
            <div className="w-full flex justify-end">
                <div className="flex items-center gap-4">
                    {isAuthenticated && <span>Solde: {balance} ETH</span>}
                    {!isAuthenticated ? (
                        <button
                            onClick={connectWallet}
                            className="bg-blue-400 text-white gap-2 px-4 py-2 rounded">
                            Connect wallet
                        </button>
                    ) : (
                        <button
                            onClick={disconnect}
                            className="bg-red-400 text-white gap-2 px-4 py-2 rounded">
                            Disconnect
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
