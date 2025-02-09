'use client';
import { createContext, useContext } from 'react';
import useWeb3Provider from './useWeb3Provider';

const Web3Context = createContext(null);

const Web3ContextProvider = ({ children }) => {
    const { connectWallet, disconnect, getBalance, state } = useWeb3Provider();

    return (
        <Web3Context.Provider
            value={{
                connectWallet,
                disconnect,
                getBalance,
                state,
            }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3ContextProvider;

export const useWeb3Context = () => useContext(Web3Context);
