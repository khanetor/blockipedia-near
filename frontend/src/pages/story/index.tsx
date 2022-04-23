import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export default function () {
    return <div className="px-32 py-16 flex flex-row bg-slate-100 font-open-sans">
        <StaticImage className="flex-1" src="../../images/logo.png" alt="logo" width={300} height={300}></StaticImage>
        <div className="flex-1">
            <p className="mb-4 text-4xl">
                <i>Blockipedia is a Wikipedia living on the NEAR blockchain.</i>
            </p>
            <p className="mb-4">
                With Blockipedia, we aim to give credits to the authors and contributors of wiki articles. Readers can optionally donate to an article, and the tokens shall be distributed to the author and contributors according to a predefined ratio.
            </p>
            <p className="mb-4">
                This is also an opportunity for us to learn about building application on blockchain in general.
            </p>
            <div className="mb-4">
                In the future, we intend to:
                <ol className="list-decimal">
                    <li className="ml-6">
                        Utilize regular database to assist with storing large amount of content, in addition to the NEAR blockchain storage.
                    </li>
                    <li className="ml-6">
                        Index the articles for full-text searching.
                    </li>
                    <li className="ml-6">
                        Use regular social authentication to allow non-NEAR users to read articles.
                    </li>
                </ol>
            </div>
        </div>
    </div>
}