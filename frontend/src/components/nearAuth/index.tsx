import { WalletConnection } from "near-api-js"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getNearWallet, signIn, signOut } from "../../near-wallet"

type IWallet = {
    authenticated: boolean
    login: () => Promise<void>
    logout: () => void
}

const NEARContext = createContext<IWallet | undefined>(undefined)

export function useWallet() {
    return useContext(NEARContext)
}

export function WalletProvider(props: { children: ReactNode }) {
    const [wallet, setWallet] = useState<WalletConnection | undefined>(undefined)

    const [authenticated, setAuthenticated] = useState<boolean>(false)

    async function login() {
        await signIn(wallet!)
    }

    function logout() {
        signOut(wallet!)
        setAuthenticated(wallet!.isSignedIn())
    }

    useEffect(function () {
        getNearWallet().then(w => {
            setWallet(w)
            setAuthenticated(w.isSignedIn())
        })
    }, [])

    const iWallet: IWallet = { authenticated, login, logout }

    if (wallet === undefined) {
        return <div>Loading wallet...</div>
    } else {
        return <NEARContext.Provider value={iWallet}>
            {props.children}
        </NEARContext.Provider>
    }
}
