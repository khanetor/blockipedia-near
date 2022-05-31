import React, { useEffect, useState } from "react"
import { NEARAuthRoute, useContract } from "../../components/nearAuth"

import { DonationModal } from "../../components/donation"
import { headerAction, headerInfo, headerRating, headerSection, readingView, titleSection } from "./[id].module.css"
import { Helmet } from "react-helmet"
import { MarkdownRenderer } from "../../components/markdown"

import ArrowUp from "../../assets/svg/arrow-up.svg"
import ArrowDown from "../../assets/svg/arrow-down.svg"

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

export default function (props: { id: string }) {
    const _id = parseInt(props.id)
    const [article, setArticle] = useState<ArticleDetail | undefined>(undefined)
    const [upvote, setUpvote] = useState<number>(1000)
    const [downvote, setDownvote] = useState<number>(1000)

    const [showDonation, setShowDonation] = useState(false)

    const contract = useContract()

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
        contract?.getArticle(_id).then(article => {
            setArticle({
                id: article.id,
                title: article.title,
                content: article.content,
                author: article.author,
                publishedDate: new Date(article.published_date / 1000000)
            })
        })
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
                            <button onClick={vote.bind(null, VoteAction.UP)}><ArrowUp /></button>
                            {upvote}
                            <button onClick={vote.bind(null, VoteAction.DOWN)}><ArrowDown /></button>
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
                <div>
                    <MarkdownRenderer>
                        {article.content}
                    </MarkdownRenderer>
                </div>
            </article>

            <DonationModal
                show={showDonation}
                articleId={article.id}
                dismiss={setShowDonation.bind(null, false)}
                donate={contract!.donate}></DonationModal>
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
