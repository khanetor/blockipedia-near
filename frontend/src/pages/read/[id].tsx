import React, { useEffect, useState } from "react"
import { NEARAuthRoute } from "../../components/nearAuth"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { DonationModal } from "../../components/donation"
import { contentSection, headerAction, headerInfo, headerRating, headerSection, readingView, titleSection } from "./[id].module.css"
import { Helmet } from "react-helmet"

type ArticleDetail = {
    id: number,
    title: string,
    content: string,
    author: string,
    publishedDate: Date
}

enum VoteAction {
    UP, DOWN
}

export default function ArticleReadingView(props: { id: number }) {
    const [article, setArticle] = useState<ArticleDetail | undefined>(undefined)
    const [upvote, setUpvote] = useState<number>(1000)
    const [downvote, setDownvote] = useState<number>(1000)

    const [showDonation, setShowDonation] = useState(false)

    function vote(action: VoteAction) {
        switch (action) {
            case VoteAction.UP:
                return setTimeout(function () {
                    setUpvote(upvote + 1)
                }, 0)
            case VoteAction.DOWN:
                return setTimeout(function () {
                    setDownvote(downvote + 1)
                }, 0)
        }
    }

    useEffect(function () {
        // Fetch article from contract
        setTimeout(function () {
            const article: ArticleDetail = {
                id: props.id,
                title: `Article ${props.id}`,
                content: "Helping Any of Us **Can Help Us All** Helping Any of Us Can Help Us All Helping Any of Us Can Help Us All Helping Any of Us Can Help Us All",
                author: "mackenzie.near",
                publishedDate: new Date()
            }
            setArticle(article)
        }, 0)
    }, [])

    if (article !== undefined) {
        return <NEARAuthRoute>
            <Helmet>
                <title>Blockipedia: {article.title}</title>
            </Helmet>
            <article className={readingView}>
                <div className={headerSection}>
                    <div className={headerInfo}>
                        <div>
                            <div>{article.author}</div>
                            <div>{article.publishedDate.toDateString()}</div>
                        </div>
                        <div className={headerRating} >
                            <button onClick={vote.bind(null, VoteAction.UP)}>
                                <svg width="30px" height="30px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                                    <path d="M13 30L25 18L37 30" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            {upvote}
                            <button onClick={vote.bind(null, VoteAction.DOWN)}>
                                <svg width="30px" height="30px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                                    <path d="M37 18L25 30L13 18" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            {downvote}
                        </div>
                    </div>
                    <div className={headerAction}>
                        <button onClick={setShowDonation.bind(null, true)}>Donate</button>
                    </div>
                </div>
                <div className={titleSection}>
                    {article.title}
                </div>
                <div className={contentSection}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </div>
            </article>

            <DonationModal show={showDonation} articleId={article.id} dismiss={setShowDonation.bind(null, false)}></DonationModal>
        </NEARAuthRoute>
    } else {
        return <NEARAuthRoute>
            <Helmet>
                <title>Blockipedia: Loading...</title>
            </Helmet>
            <article className={readingView}>
                Loading article ...
            </article>
        </NEARAuthRoute>
    }
}
