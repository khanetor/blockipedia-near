import React, { ReactNode } from "react"
import { Link, navigate } from "gatsby"
import { ContractProvider, useContract } from "../components/nearAuth"

import { header, links, link, linkAction, branding } from "./index.module.css"

function HeadNav() {
    const contract = useContract()

    function getStarted() {
        if (contract.authenticated) {
            navigate("/write")
        } else {
            contract.login()
        }
    }

    return <nav className={header}>
        <Link className={branding} to="/">Blockipedia</Link>
        <div className={links}>
            <Link className={link} to="/story">Our story</Link>
            <Link className={link} to="/write">Write</Link>
            {contract.authenticated ?
                <a className={link} onClick={contract.logout}>Sign-out</a> :
                <a className={link} onClick={contract.login}>Sign-in</a>}
            <a className={linkAction} onClick={getStarted}>Get started</a>
        </div>
    </nav>
}

export default function (props: { children: ReactNode }) {
    return <ContractProvider>
        <HeadNav />
        <div>
            {props.children}
        </div>
    </ContractProvider>
}