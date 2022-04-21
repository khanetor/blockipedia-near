import { WalletConnection } from "near-api-js"
import { navigate } from "gatsby"
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
            setAuthenticated(w.isSignedIn())
            setWallet(w)
        })
    }, [])

    if (wallet === undefined) {
        return <div>Loading wallet...</div>
    } else {
        const iWallet: IWallet = { authenticated, login, logout }
        return <NEARContext.Provider value={iWallet}>
            {props.children}
        </NEARContext.Provider>
    }
}

export function NEARAuth(props: { children: ReactNode }) {
    const wallet = useWallet()

    useEffect(function () {
        if (!wallet!.authenticated) {
            navigate("/")
        }
    }, [])

    if (wallet?.authenticated) {
        return <>{props.children}</>
    } else {
        return <></>
    }
}
