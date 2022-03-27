import React from "react"
import { landing, tagline } from "./landing.module.css"

export default function () {
    return <>
        <div className={landing}>
            <span className={tagline}>Stay curious.</span>
        </div>
    </>
}
