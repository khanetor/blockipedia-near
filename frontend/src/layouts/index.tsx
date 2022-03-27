import React, { ReactNode } from "react"

import { header, links, link, linkAction, branding } from "./index.module.css"

export default function ({ children }: { children: ReactNode }) {
    return <>
        <nav className={header}>
            <div className={branding}>Blockipedia</div>
            <div className={links}>
                <a className={link}>Our story</a>
                <a className={link}>Write</a>
                <a className={link}>Sign-in</a>
                <a className={linkAction}>Get started</a>
            </div>
        </nav>
        <div>
            {children}
        </div>
    </>
}