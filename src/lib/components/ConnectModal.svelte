<script lang="ts">
	import { Icon, PlusCircle } from 'svelte-hero-icons';
	import { web3wallet } from '$lib/wallet.js';
	import { buildApprovedNamespaces } from '@walletconnect/utils';
	import type { Web3WalletTypes } from '@walletconnect/web3wallet';
	import { impersonatedAddress } from '$lib/address';

	export let onConnect: () => void;

	let uri = '';
	let isConnecting = false;
	let modalOpen = false;

	const connect = async () => {
		if (!$web3wallet) return;

		isConnecting = true;
		await $web3wallet.core.pairing.pair({ uri });
	};

	const onProposal = async ({ id, params }: Web3WalletTypes.EventArguments['session_proposal']) => {
		if (!$web3wallet) return;

		isConnecting = true;

		const namespaces = buildApprovedNamespaces({
			proposal: params,
			supportedNamespaces: {
				eip155: {
					chains: [`eip155:1`],
					methods: ['eth_sendTransaction', 'personal_sign'],
					events: ['accountsChanged', 'chainChanged'],
					accounts: [`eip155:1:${$impersonatedAddress}`]
				}
			}
		});

		await $web3wallet.approveSession({
			id,
			namespaces
		});

		isConnecting = false;
		modalOpen = false;

		onConnect();

		uri = '';
	};

	web3wallet.subscribe(() => {
		if (!$web3wallet) return;

		$web3wallet.on('session_proposal', onProposal);

		return () => $web3wallet.off('session_proposal', onProposal);
	});
</script>

<div>
	<label for="connect-modal" class="btn btn-primary h-32 w-full gap-x-1 text-2xl">
		<Icon src={PlusCircle} class="h-10 w-10" /> Add Connection!
	</label>
	<input type="checkbox" id="connect-modal" class="modal-toggle" bind:checked={modalOpen} />
	<label for="connect-modal" class="modal cursor-pointer">
		<label class="modal-box relative">
			<input class="absolute left-0 top-0 h-0 w-0" />
			<h3 class="mb-3 text-xl font-bold">Connect dApp</h3>
			<label for="connect-modal" class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3">
				✕
			</label>
			<div class="space-y-3">
				<input
					type="text"
					placeholder="WalletConnect URI"
					class="input input-bordered w-full"
					bind:value={uri}
				/>

				<button class="btn btn-primary w-full" on:click={connect} disabled={isConnecting}
					>Connect</button
				>
			</div>
		</label>
	</label>
</div>
