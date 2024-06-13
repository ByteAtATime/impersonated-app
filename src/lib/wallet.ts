import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { PUBLIC_PROJECT_ID } from '$env/static/public';
import { type Writable, writable } from 'svelte/store';

const core = new Core({
	projectId: PUBLIC_PROJECT_ID
});

export const web3wallet: Writable<Awaited<ReturnType<typeof Web3Wallet.init>> | undefined> =
	writable();

Web3Wallet.init({
	core,
	metadata: {
		name: 'Impersonated.App',
		description:
			'Impersonate any Ethereum address, and connect to any DApp that supports WalletConnect!',
		url: 'https://impersonated.app',
		icons: []
	}
}).then((wallet) => web3wallet.set(wallet));
