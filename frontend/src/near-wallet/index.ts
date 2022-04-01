import { connect, keyStores, WalletConnection, ConnectConfig } from "near-api-js"

async function getNearWallet() {
    const config: ConnectConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        headers: {},
    }

    const near = await connect(config)
    const wallet = new WalletConnection(near, "blockipedia")

    return wallet
}

async function signIn(wallet: WalletConnection) {
    await wallet.requestSignIn(
        "khanguyen.testnet", // contract requesting access
        "Blockipedia"
    )
}

function signOut(wallet: WalletConnection) {
    wallet.signOut()
}

export { getNearWallet, signIn, signOut }
