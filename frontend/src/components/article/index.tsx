import { Link } from "gatsby"
import React from "react"

export type ArticleMeta = {
    id: number,
    author: string,
    title: string,
    date: Date
}

export default function (props: { article: ArticleMeta }) {
    const article = props.article
    const articleDate = article.date.toDateString()

    return <>
        <div className="flex flex-row gap-5">
            <div className="text-2xl font-bold text-gray-500 opacity-20">{article.id}</div>
            <div className="flex flex-col gap-2 mt-2">
                <div className="text-xs font-semibold">{article.author}</div>
                <div className="font-bold"><Link to={`read/${article.id}`}>{article.title}</Link></div>
                <div className="text-xs text-gray-400">{articleDate}</div>
            </div>
        </div>
    </>
}
