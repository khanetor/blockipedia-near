import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { markdownStyle } from "./index.module.css"

export function MarkdownRenderer(props: { children: string }) {
    return <div className={markdownStyle}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {props.children}
        </ReactMarkdown>
    </div>
}
