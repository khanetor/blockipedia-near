import { Buffer } from "buffer"
import * as React from "react"
import { useEffect } from "react"
import { providers } from "near-api-js"
import { NEARAuthRoute } from "../../components/nearAuth"
import { navigate } from "gatsby"

export default function (props: { location: { search: string } }) {

    useEffect(() => {
        const query = new URLSearchParams(props.location.search)
        const _ = query.get("signMeta")
        const txHash = query.get("transactionHashes")

        const provider = new providers.JsonRpcProvider(process.env.NEAR_RPC_URL)

        provider.txStatus(txHash!, "khanguyen.testnet").then(result => {
            const value = (result.status as providers.FinalExecutionStatus).SuccessValue
            const articleId = Buffer.from(value!, "base64").toString()
            navigate(`/read/${articleId}`)
        })

    }, [])

    return <NEARAuthRoute>
        <div className="flex justify-center items-center mt-5">Redirecting</div>
    </NEARAuthRoute>
}
