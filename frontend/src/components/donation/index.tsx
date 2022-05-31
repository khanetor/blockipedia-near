import React, { useState } from "react"
import clsx from "clsx"

export function DonationModal(props: { show: boolean, articleId: number, dismiss: () => void, donate: (articleId: number, amount: number) => Promise<void> }) {
    const [tokens, setTokens] = useState<number>(0)

    return <div className={clsx(
        "absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-slate-600 bg-opacity-70 flex-col scale-0 transition-all origin-right duration-200",
        { "scale-100": props.show })}>
        <div className="flex flex-col items-center justify-center gap-5 bg-gray-400 p-10 rounded-3xl">
            <p className="font-semibold text-slate-50 text-2xl">You are about to donate to this article for {tokens} NEARs.</p>
            <input className="border-none rounded w-40 h-16 text-right" value={tokens} type="number" step={0.00001} onChange={e => setTokens(parseFloat(e.target.value))}></input>
            <div className="flex flex-row gap-4">
                <button className="bg-yellow-400 rounded-xl px-5 py-3 text-white font-bold text-2xl" onClick={props.dismiss}>Cancel</button>
                <button className="bg-blue-400 rounded-xl px-6 py-3 text-white font-bold text-2xl" onClick={() => props.donate(props.articleId, tokens)}>Send</button>
            </div>
        </div>
    </div>
}