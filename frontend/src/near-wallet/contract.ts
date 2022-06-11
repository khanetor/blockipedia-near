import { Dispatch, SetStateAction } from "react"
import { Contract, utils, WalletConnection } from "near-api-js"
import { signIn, signOut } from "."
import { ArticleMeta, CArticle, ExtendedContract } from "../components/nearAuth/extendedContract"


export type ISmartContract = {
    accountId: string
    authenticated: boolean
    login: () => Promise<void>
    logout: () => void,
    getArticles: () => Promise<ArticleMeta[]>
    getArticle: (id: number) => Promise<CArticle>
    createArticle: (title: string, content: string) => Promise<void>
    donate: (articleId: number, amount: number) => Promise<void>
}

export function buildContractInterface(wallet: WalletConnection, setAuthenticated: Dispatch<SetStateAction<boolean>>): ISmartContract {
    const contract = new Contract(wallet.account(), process.env.GATSBY_CONTRACT_ADDRESS!, {
        viewMethods: ["get_article", "get_articles"],
        changeMethods: ["create_article", "update_article", "upvote", "downvote", "donate"]
    }) as ExtendedContract

    const authenticated =  wallet.isSignedIn()

    const accountId: string = wallet.getAccountId()

    async function login() {
        await signIn(wallet)
    }

    function logout() {
        signOut(wallet)
        setAuthenticated(false)
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
            callbackUrl: `${process.env.GATSBY_HOSTNAME!}${process.env.GATSBY_PATH_PREFIX!}write/callback`,
            meta: "articleCreated",
            args: {
                title, content
            },
            gas: "300000000000000",
            amount: utils.format.parseNearAmount("2")!
        })
    }

    async function donate(articleId: number, amount: number): Promise<void> {
        await contract!.donate({
            callbackUrl: `${process.env.HOSTNAME!}/read/${articleId}`,
            meta: "donated",
            args: {
                article_id: articleId
            },
            gas: "300000000000000",
            amount: utils.format.parseNearAmount(amount.toString())!
        })
    }

    return {
        accountId, authenticated, login, logout, getArticles, getArticle, createArticle, donate
    }
}