import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import {PUBLIC_PROJECT_ID} from "$env/static/public";
import { buildApprovedNamespaces } from '@walletconnect/utils';

const core = new Core({
    projectId: PUBLIC_PROJECT_ID
})

export const web3wallet = await Web3Wallet.init({
    core,
    metadata: {
        name: 'Impersonated.App',
        description: 'Impersonate any Ethereum address, and connect to any DApp that supports WalletConnect!',
        url: 'https://impersonated.app',
        icons: []
    }
})
