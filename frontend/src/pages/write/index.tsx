import React, { useState } from "react"
import { NEARAuth } from "../../components/nearAuth"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { bodyComposer, composer, editor, preview, heading } from "./index.module.css"
import { navigate } from "gatsby"
import { Helmet } from "react-helmet"

export default function () {
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")

    function cancel() {
        navigate("/")
    }

    function publish() {
        console.log("Should publish article with title:")
        console.log(title)
    }

    const render = content.length > 0 ? content : "Preview"

    return <NEARAuth>
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {render}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    </NEARAuth>
}