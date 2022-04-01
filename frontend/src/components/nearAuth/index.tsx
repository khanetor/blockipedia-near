import { WalletConnection } from "near-api-js"
import React, { createContext, useState, useEffect, ReactNode } from "react"
import { getNearWallet } from "../../near-wallet"

const NEARContext = createContext<WalletConnection | undefined>(undefined)

export default function (props: { children: ReactNode }) {
    const [wallet, setWallet] = useState<WalletConnection | undefined>(undefined)

    useEffect(function () {
        getNearWallet().then(setWallet)
    }, [])

    return <>
        <NEARContext.Provider value={wallet}>
            {props.children}
        </NEARContext.Provider>
    </>
}