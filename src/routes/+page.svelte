<script lang="ts">
	import { web3wallet } from '$lib/wallet';
	import { getSdkError } from '@walletconnect/utils';
	import ConnectModal from '$lib/components/ConnectModal.svelte';
	import { EllipsisVertical, Icon } from 'svelte-hero-icons';
	import type { Web3WalletTypes } from '@walletconnect/web3wallet';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import UpdateAddress from '$lib/components/UpdateAddress.svelte';
	import { impersonatedAddress } from '$lib/address';

 	let connections = web3wallet.getActiveSessions();

	const updateConnections = () => {
		connections = web3wallet.getActiveSessions();
	};

	onMount(() => {
		const handleSessionDelete = ({ topic }: Web3WalletTypes.EventArguments['session_delete']) => {
			const dappName = connections[topic].peer.metadata.name;
			toast.error(`dApp "${dappName}" has been disconnected!`);

			updateConnections();
		};

		const signals = ['session_request', 'auth_request', 'proposal_expire', 'session_request_expire', 'session_authenticate'] as Web3WalletTypes.Event[];

		for (const signal of signals) {
			web3wallet.on(signal, updateConnections);
		}

		web3wallet.on('session_delete', handleSessionDelete);

		return () => {
			for (const signal of signals) {
				web3wallet.off(signal, updateConnections);
			}

			web3wallet.off('session_delete', handleSessionDelete);
		};
	});

	const disconnect = (topic: string) => async () => {
		try {
			await web3wallet.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') });

			toast.success('Disconnected successfully!');
		} catch (e: any) {
			toast.error(`Failed to disconnect!\n${'message' in e ? JSON.stringify(e.message) : 'No error message'}`);
		} finally {
			updateConnections();
		}
	};
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center">
		<p>Currently impersonating</p>
		<div class="flex items-center gap-x-1">
			<p>{$impersonatedAddress}</p>
			<UpdateAddress />
		</div>
	</div>

	<div class="divider" />

	<div class="flex flex-col items-center gap-y-2 max-w-xl w-full">
		<h2 class="text-2xl font-bold">Connected dApps</h2>

		<div class="flex flex-col gap-y-4 w-full">
			<ConnectModal onConnect={updateConnections} />
			{#each Object.entries(connections) as [topic, connection] (topic)}
				<div class="flex p-6 bg-base-300 rounded-2xl gap-x-4 items-center">
					{#if connection.peer.metadata.icons[0]}
						<img src={connection.peer.metadata.icons[0]} alt={connection.peer.metadata.name}
								 class="w-12 h-12 rounded-full" />
					{:else}
						<div class="w-12 h-12 rounded-full bg-base-200"></div>
					{/if}

					<div class="flex-grow">
						<h3 class="font-bold">{connection.peer.metadata.name}</h3>
						<p>{connection.peer.metadata.description}</p>

						<a href={connection.peer.metadata.url} class="underline hover:text-info"
							 target="_blank">{connection.peer.metadata.url}</a>
					</div>

					<details class="dropdown">
						<summary class="btn btn-ghost btn-square">
							<Icon src={EllipsisVertical} class="w-6 h-6" />
						</summary>
						<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
							<li>
								<button on:click={disconnect(topic)}>Disconnect</button>
							</li>
						</ul>
					</details>
				</div>
			{:else}
				<p class="text-center">No dApps connected!</p>
			{/each}
		</div>
	</div>
</div>
