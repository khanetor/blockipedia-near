import React, { ReactNode } from "react"
import { Link, navigate } from "gatsby"
import { WalletProvider, useWallet } from "../components/nearAuth"

import { header, links, link, linkAction, branding } from "./index.module.css"

function HeadNav() {
    const wallet = useWallet()

    function getStarted() {
        if (wallet?.authenticated) {
            navigate("/create")
        } else {
            wallet?.login()
        }
    }

    return <nav className={header}>
        <Link className={branding} to="/">Blockipedia</Link>
        <div className={links}>
            <Link className={link} to="/story">Our story</Link>
            <Link className={link} to="/create">Write</Link>
            {wallet!.authenticated ?
                <a className={link} onClick={wallet!.logout}>Sign-out</a> :
                <a className={link} onClick={wallet!.login}>Sign-in</a>}
            <a className={linkAction} onClick={getStarted}>Get started</a>
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