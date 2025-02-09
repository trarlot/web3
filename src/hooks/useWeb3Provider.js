import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';
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
                const signer = provider.getSigner();
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
        if (!state.signer) return null;

        try {
            const balance = await state.signer.getBalance();
            const formattedBalance = ethers.utils.formatEther(balance);
            console.log('Balance:', formattedBalance);
            return formattedBalance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    }, [state.signer]);

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
        state,
    };
};

export default useWeb3Provider;
