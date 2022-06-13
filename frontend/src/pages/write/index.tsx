import React, { useState } from "react"
import { NEARAuthRoute, useContract } from "../../components/nearAuth"

import { bodyComposer, composer, editor, preview, heading } from "./index.module.css"
import { navigate } from "gatsby"
import { Helmet } from "react-helmet"
import { MarkdownRenderer } from "../../components/markdown"

export default function () {
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")

    const contract = useContract()

    function cancel() {
        navigate("/")
    }

    function publish() {
        contract.createArticle(title, content)
    }

    const render: string = content.length > 0 ? content : "Preview"

    return <NEARAuthRoute>
        <Helmet>
            <title>Blockipedia: {title}</title>
        </Helmet>
        <div className={composer}>
            <div className={heading}>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}></input>
                <div>
                    <button onClick={cancel}>cancel</button>
                    <button onClick={publish}>publish</button>
                </div>
            </div>
            <div className={bodyComposer}>
                <div className={editor}>
                    <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)}></textarea>
                </div>
                <div className={preview}>
                    <MarkdownRenderer>{render}</MarkdownRenderer>
                </div>
            </div>
        </div>
    </NEARAuthRoute>
}