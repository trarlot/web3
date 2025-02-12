import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Web3Modal from 'web3modal';
import { Network, Alchemy } from 'alchemy-sdk';

const providerOptions = {
    // Ajoute ici d'autres providers (WalletConnect, Coinbase, etc.)
};

const settings = {
    apiKey: 'eJ_-_CEY1Q0dKIqVr0Etz_NU7fbyr5Y1', // Remplacez par votre clé API Alchemy
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const useWeb3Provider = () => {
    const initialWeb3State = {
        address: null,
        currentChain: null,
        signer: null,
        provider: null,
        isAuthenticated: false,
    };

    const [state, setState] = useState(initialWeb3State);

    const connectWallet = useCallback(async () => {
        if (state.isAuthenticated) return;

        try {
            const web3Modal = new Web3Modal({
                cacheProvider: true, // Garde en mémoire le wallet utilisé
                providerOptions,
            });

            const instance = await web3Modal.connect();

            // Utilisation correcte de Web3Provider pour ethers v6
            const provider = new ethers.BrowserProvider(instance);

            const signer = await provider.getSigner();

            const address = await signer.getAddress();

            const chain = Number(await (await provider.getNetwork()).chainId);

            setState({
                ...state,
                address,
                signer,
                currentChain: chain,
                provider,
                isAuthenticated: true,
            });

            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            if (error.code === 4001) {
                // Code d'erreur pour "User rejected the request"
                toast.error("Connexion refusée par l'utilisateur", {
                    position: 'top-right',
                });
            } else {
                toast.error('Une erreur est survenue lors de la connexion', {
                    position: 'top-right',
                });
            }
        }
    }, [state]);

    const disconnect = () => {
        setState(initialWeb3State);
        localStorage.removeItem('isAuthenticated');
    };

    const getBalance = useCallback(async () => {
        if (!state.signer || !state.provider) return null;

        try {
            const address = await state.signer.getAddress();
            const balance = await state.provider.getBalance(address);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    }, [state.signer, state.provider]);

    const getNFTsFromWallet = useCallback(async () => {
        if (!state.address) return [];

        try {
            const nftsForOwner = await alchemy.nft.getNftsForOwner(
                state.address,
            );

            return nftsForOwner.ownedNfts.map((nft) => {
                // Essayez d'autres propriétés pour l'URL de l'image
                const imageUrl =
                    nft.image.originalUrl &&
                    nft.image.originalUrl.endsWith('.png')
                        ? nft.image.originalUrl
                        : '/assets/bitcoinLogo.svg'; // URL par défaut

                return {
                    tokenId: nft.tokenId,
                    tokenURI: imageUrl,
                    image: imageUrl,
                    name: nft.title || 'Unknown Name',
                    description: nft.description || 'No description available',
                };
            });
        } catch (error) {
            console.error('Error fetching NFTs from wallet:', error);
            return [];
        }
    }, [state.address]);

    useEffect(() => {
        if (window == null) return;

        if (localStorage.hasOwnProperty('isAuthenticated')) {
            connectWallet();
        }
    }, [connectWallet, state.isAuthenticated]);

    useEffect(() => {
        if (typeof window.ethereum === 'undefined') return;

        window.ethereum.on('accountsChanged', (accounts) => {
            setState({ ...state, address: accounts[0] });
        });

        window.ethereum.on('networkChanged', (network) => {
            setState({ ...state, currentChain: Number(network) });
        });

        return () => {
            window.ethereum.removeAllListeners();
        };
    }, [state]);

    return {
        connectWallet,
        disconnect,
        getBalance,
        getNFTsFromWallet,
        state,
    };
};

export default useWeb3Provider;
