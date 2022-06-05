import { WalletConnection, Contract, utils as NEARUtils } from "near-api-js"
import { navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getNearWallet, signIn, signOut } from "../../near-wallet"
import { ArticleMeta, CArticle, ExtendedContract } from "./extendedContract"

type ISmartContract = {
    authenticated: boolean
    login: () => Promise<void>
    logout: () => void,
    getArticles: () => Promise<ArticleMeta[]>
    getArticle: (id: number) => Promise<CArticle>
    createArticle: (title: string, content: string) => Promise<void>
    donate: (articleId: number, amount: number) => Promise<void>
}

const ContractContext = createContext<ISmartContract | undefined>(undefined)

export function useContract() {
    return useContext(ContractContext)
}

export function ContractProvider(props: { children: ReactNode }) {
    const [wallet, setWallet] = useState<WalletConnection | undefined>(undefined)
    const [contract, setContract] = useState<ExtendedContract | undefined>(undefined)
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    useEffect(function () {
        getNearWallet().then(w => {
            setAuthenticated(w.isSignedIn())
            const c = new Contract(w.account(), process.env.CONTRACT_ADDRESS!, {
                viewMethods: ["get_article", "get_articles"],
                changeMethods: ["create_article", "update_article", "upvote", "downvote", "donate"]
            })
            setContract(c as ExtendedContract)
            setWallet(w)
        })
    }, [])

    if (wallet === undefined) {
        return <div>Loading wallet...</div>
    } else {
        async function login() {
            await signIn(wallet!)
        }

        function logout() {
            signOut(wallet!)
            setAuthenticated(wallet!.isSignedIn())
        }

        async function getArticles(): Promise<ArticleMeta[]> {
            return await contract!.get_articles()
        }

        async function getArticle(id: number): Promise<CArticle> {
            return await contract!.get_article({
                article_id: id
            })
        }

        async function createArticle(title: string, content: string): Promise<void> {
            await contract!.create_article({
                callbackUrl: `${process.env.HOSTNAME!}`,
                meta: "Article created",
                args: {
                    title, content
                },
                gas: "300000000000000",
                amount: NEARUtils.format.parseNearAmount("2")!
            })
        }

        async function donate(articleId: number, amount: number): Promise<void> {
            await contract!.donate({
                callbackUrl: `${process.env.HOSTNAME!}/read/${articleId}`,
                meta: "Article donated",
                args: {
                    article_id: articleId
                },
                gas: "300000000000000",
                amount: NEARUtils.format.parseNearAmount(amount.toString())!
            })
        }

        const smartContract: ISmartContract = { authenticated, login, logout, getArticles, getArticle, createArticle, donate }
        return <ContractContext.Provider value={smartContract}>
            {props.children}
        </ContractContext.Provider>
    }
}

export function NEARAuthRoute(props: { children: ReactNode }) {
    return <NEARAuth redirect>{props.children}</NEARAuth>
}

export function NEARAuth(props: { children: ReactNode, redirect: boolean }) {
    const wallet = useContract()

    useEffect(function () {
        if (props.redirect && !wallet!.authenticated) {
            navigate("/")
        }
    }, [])

    if (wallet?.authenticated) {
        return <>{props.children}</>
    } else {
        return <div className="flex flex-col items-center justify-center h-72 gap-6 pt-6">
            <StaticImage src="../../images/logo.png" alt="logo" width={300} height={300}></StaticImage>
            <div className="font-open-sans text-xl font-semibold">Please sign-in with your NEAR wallet to get started.</div>
            <button className="bg-green-700 text-white p-4 rounded-2xl" onClick={wallet?.login}>Sign-in</button>
        </div>
    }
}
