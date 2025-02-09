import { BrowserProvider, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
            const { ethereum } = window;
            if (!ethereum) {
                return toast.error('No ethereum wallet found', {
                    position: 'top-right',
                });
            }
            const provider = new ethers.BrowserProvider(ethereum);

            const accounts = await provider.send('eth_requestAccounts', []);

            if (accounts.length > 0) {
                const signer = await provider.getSigner();
                console.log('Signer:', signer);

                const chain = Number(
                    await (
                        await provider.getNetwork()
                    ).chainId,
                );

                setState({
                    ...state,
                    address: accounts[0],
                    signer,
                    currentChain: chain,
                    provider,
                    isAuthenticated: true,
                });

                localStorage.setItem('isAuthenticated', 'true');
            }
        } catch (error) {
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
        if (!state.address || !state.provider) return [];

        try {
            const contractAddress =
                '0x0xf22063aC68185A967eb71a2f5b877336b64bF9E1'; // Remplacez par l'adresse de votre contrat
            const contractABI = [
                // Remplacez par l'ABI de votre contrat
                'function balanceOf(address owner) view returns (uint256)',
                'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
                'function tokenURI(uint256 tokenId) view returns (string)',
            ];

            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                state.provider,
            );

            const balance = await contract.balanceOf(state.address);
            const nfts = [];

            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(
                    state.address,
                    i,
                );
                const tokenURI = await contract.tokenURI(tokenId);
                nfts.push({ tokenId, tokenURI });
            }

            return nfts;
        } catch (error) {
            console.error('Error fetching NFTs from wallet:', error);
            return [];
        }
    }, [state.address, state.provider]);

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
