import React, { useEffect, useState } from "react"
import { NEARAuthRoute, useContract } from "../../components/nearAuth"

import { DonationModal } from "../../components/donation"
import { headerAction, headerInfo, headerRating, headerSection, readingView, titleSection } from "./[id].module.css"
import { Helmet } from "react-helmet"
import { MarkdownRenderer } from "../../components/markdown"

import ArrowUp from "../../assets/svg/arrow-up.svg"
import ArrowDown from "../../assets/svg/arrow-down.svg"
import { Article } from "../../components/nearAuth/extendedContract"

enum VoteAction {
    UP, DOWN
}

function convertToDateString(time: number) {
    return new Date(time / 1000000).toDateString()
}

export default function (props: { id: string }) {
    const _id = parseInt(props.id)
    const [article, setArticle] = useState<Article | undefined>(undefined)
    const [upvote, setUpvote] = useState<number>(0)
    const [upvoting, setUpvoting] = useState<boolean>(false)
    const [downvote, setDownvote] = useState<number>(0)
    const [downvoting, setDownvoting] = useState<boolean>(false)

    const [showDonation, setShowDonation] = useState(false)

    const contract = useContract()

    async function vote(action: VoteAction) {
        switch (action) {
            case VoteAction.UP:
                setUpvoting(true)
                await contract.upvote(article!.id)
                setUpvote(upvote + 1)
                setUpvoting(false)
                break
            case VoteAction.DOWN:
                setDownvoting(true)
                await contract.downvote(article!.id)
                setDownvote(downvote + 1)
                setDownvoting(false)
                break
        }
    }

    useEffect(function () {
        // Fetch article from contract
        contract.getArticle(_id).then(article => {
            setArticle(article)
            setUpvote(article.upvote)
            setDownvote(article.downvote)
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
                            <div>{convertToDateString(article.published_date)}</div>
                        </div>
                        <div className={headerRating} >
                            <button disabled={upvoting} onClick={() => vote(VoteAction.UP)}><ArrowUp /></button>
                            {upvote}
                            <button disabled={downvoting} onClick={() => vote(VoteAction.DOWN)}><ArrowDown /></button>
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
                donate={contract.donate}></DonationModal>
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
