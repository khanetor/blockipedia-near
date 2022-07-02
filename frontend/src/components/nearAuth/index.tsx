import { WalletConnection } from "near-api-js"
import { navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getNearWallet } from "../../near-wallet"
import { buildContractInterface, ISmartContract } from "../../near-wallet/contract"


const ContractContext = createContext<ISmartContract | undefined>(undefined)

export function useContract(): ISmartContract {
    const context = useContext(ContractContext)

    if (context === undefined) {
        throw new Error("Contract is not ready!")
    } else {
        return context
    }
}

export function ContractProvider(props: { children: ReactNode }) {
    const [wallet, setWallet] = useState<WalletConnection | undefined>(undefined)
    const [_, setAuthenticated] = useState<boolean>(false)

    useEffect(function () {
        getNearWallet().then(w => {
            setAuthenticated(w.isSignedIn())
            setWallet(w)
        })
    }, [])

    if (wallet === undefined) {
        return <div>Loading wallet...</div>
    } else {
        const contract = buildContractInterface(wallet, setAuthenticated)
        return <ContractContext.Provider value={contract}>
            {props.children}
        </ContractContext.Provider>
    }
}

export function NEARAuthRoute(props: { children: ReactNode }) {
    return <NEARAuth redirect>{props.children}</NEARAuth>
}

export function NEARAuth(props: { children: ReactNode, redirect: boolean }) {
    const contract = useContract()

    useEffect(function () {
        if (props.redirect && !contract.authenticated) {
            navigate("/")
        }
    }, [])

    if (contract.authenticated) {
        return <>{props.children}</>
    } else {
        return <div className="flex flex-col items-center justify-center h-72 gap-6 pt-6">
            <StaticImage src="../../images/logo.png" alt="logo" width={300} height={300}></StaticImage>
            <div className="font-open-sans text-xl font-semibold">Please sign-in with your NEAR wallet to get started.</div>
            <button className="bg-green-700 text-white p-4 rounded-2xl" onClick={contract.login}>Sign-in</button>
        </div>
    }
}
