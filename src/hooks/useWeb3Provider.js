import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Web3Modal from 'web3modal';

const providerOptions = {
    // Ajoute ici d'autres providers (WalletConnect, Coinbase, etc.)
};

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
            console.log('Initialisation de Web3Modal...');
            const web3Modal = new Web3Modal({
                cacheProvider: true, // Garde en mémoire le wallet utilisé
                providerOptions,
            });

            console.log('Connexion à Web3Modal...');
            const instance = await web3Modal.connect();
            console.log('Instance obtenue :', instance);

            // Utilisation correcte de Web3Provider pour ethers v6
            const provider = new ethers.BrowserProvider(instance);
            console.log('Provider créé :', provider);

            const signer = await provider.getSigner();
            console.log('Signer obtenu :', signer);

            const address = await signer.getAddress();
            console.log('Adresse connectée :', address);

            const chain = Number(await (await provider.getNetwork()).chainId);
            console.log('ID de la chaîne :', chain);

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
            const response = await fetch(
                `https://api.opensea.io/api/v1/assets?owner=${state.address}&order_direction=desc&offset=0&limit=20`,
            );
            const data = await response.json();
            return data.assets.map((asset) => ({
                tokenId: asset.token_id,
                tokenURI: asset.image_url,
                name: asset.name,
                description: asset.description,
            }));
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
