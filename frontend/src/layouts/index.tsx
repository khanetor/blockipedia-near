import React, { ReactNode } from "react"
import { WalletProvider, useWallet } from "../components/nearAuth"

import { header, links, link, linkAction, branding } from "./index.module.css"

function HeadNav() {
    const wallet = useWallet()

    return <nav className={header}>
        <div className={branding}>Blockipedia</div>
        <div className={links}>
            <a className={link}>Our story</a>
            <a className={link}>Write</a>
            {wallet!.authenticated ?
                <a className={link} onClick={wallet!.logout}>Sign-out</a> :
                <a className={link} onClick={wallet!.login}>Sign-in</a>}
            <a className={linkAction}>Get started</a>
        </div>
    </nav>
}

export default function (props: { children: ReactNode }) {
    return <WalletProvider>
        <HeadNav />
        <div>
            {props.children}
        </div>
    </WalletProvider>
}