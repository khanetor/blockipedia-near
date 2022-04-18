import { connect, keyStores, WalletConnection, ConnectConfig } from "near-api-js"

async function getNearWallet() {
    const config: ConnectConfig = {
        networkId: process.env.NEAR_NETWORK_ID!,
        nodeUrl: process.env.NEAR_NODE_URL!,
        walletUrl: process.env.NEAR_WALLET_URL,
        helperUrl: process.env.NEAR_HELPER_URL,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        headers: {},
    }

    const near = await connect(config)
    const wallet = new WalletConnection(near, "blockipedia")

    return wallet
}

async function signIn(wallet: WalletConnection) {
    await wallet.requestSignIn(
        process.env.CONTRACT_ADDRESS,
        process.env.APP_NAME
    )
}

function signOut(wallet: WalletConnection) {
    wallet.signOut()
}

export { getNearWallet, signIn, signOut }
