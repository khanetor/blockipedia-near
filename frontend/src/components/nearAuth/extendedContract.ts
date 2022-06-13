import { Contract } from "near-api-js";

type CreateArticleArgs = {
    callbackUrl: string,
    meta: string,
    args: { title: string, content: string },
    gas: string,
    amount: string
}

type DonateArgs = {
    callbackUrl: string,
    meta: string,
    args: { article_id: number },
    gas: string,
    amount: string
}

type VoteArgs = {
    article_id: number
}

type GetArticleArg = {
    article_id: number
}

export type Article = {
    id: number,
    title: string,
    content: string,
    author: string,
    published_date: number,
    upvote: number,
    downvote: number
}

export type ArticleMeta = [number, { author: string, title: string, published_date: number }]

export interface ExtendedContract extends Contract {
    get_articles: () => Promise<ArticleMeta[]>
    get_article: (arg: GetArticleArg) => Promise<Article>
    create_article: (arg: CreateArticleArgs) => Promise<void>
    donate: (arg: DonateArgs) => Promise<void>
    upvote: (arg: VoteArgs) => Promise<void>
    downvote: (arg: VoteArgs) => Promise<void>
}
