<script lang="ts">
	import { web3wallet } from '$lib/wallet';
	import { getSdkError } from '@walletconnect/utils';
	import ConnectModal from '$lib/components/ConnectModal.svelte';
	import { EllipsisVertical, Icon } from 'svelte-hero-icons';
	import type { Web3WalletTypes } from '@walletconnect/web3wallet';
	import toast from 'svelte-french-toast';
	import UpdateAddress from '$lib/components/UpdateAddress.svelte';
	import { impersonatedAddress } from '$lib/address';

	$: connections = $web3wallet?.getActiveSessions() ?? {};

	const updateConnections = () => {
		connections = $web3wallet?.getActiveSessions() ?? {};
	};

	web3wallet.subscribe((_) => {
		if (!$web3wallet) return;

		const handleSessionDelete = ({ topic }: Web3WalletTypes.EventArguments['session_delete']) => {
			const dappName = connections[topic].peer.metadata.name;
			toast.error(`dApp "${dappName}" has been disconnected!`);

			updateConnections();
		};

		const signals = [
			'session_request',
			'auth_request',
			'proposal_expire',
			'session_request_expire',
			'session_authenticate'
		] as Web3WalletTypes.Event[];

		for (const signal of signals) {
			$web3wallet.on(signal, updateConnections);
		}

		$web3wallet.on('session_delete', handleSessionDelete);

		return () => {
			for (const signal of signals) {
				$web3wallet.off(signal, updateConnections);
			}

			$web3wallet.off('session_delete', handleSessionDelete);
		};
	});

	const disconnect = (topic: string) => async () => {
		if (!$web3wallet) return;

		try {
			await $web3wallet.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') });

			toast.success('Disconnected successfully!');
		} catch (e: any) {
			toast.error(
				`Failed to disconnect!\n${'message' in e ? JSON.stringify(e.message) : 'No error message'}`
			);
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

	<div class="flex w-full max-w-xl flex-col items-center gap-y-2">
		<h2 class="text-2xl font-bold">Connected dApps</h2>

		<div class="flex w-full flex-col gap-y-4">
			<ConnectModal onConnect={updateConnections} />
			{#each Object.entries(connections) as [topic, connection] (topic)}
				<div class="flex items-center gap-x-4 rounded-2xl bg-base-300 p-6">
					{#if connection.peer.metadata.icons[0]}
						<img
							src={connection.peer.metadata.icons[0]}
							alt={connection.peer.metadata.name}
							class="h-12 w-12 rounded-full"
						/>
					{:else}
						<div class="h-12 w-12 rounded-full bg-base-200"></div>
					{/if}

					<div class="flex-grow">
						<h3 class="font-bold">{connection.peer.metadata.name}</h3>
						<p>{connection.peer.metadata.description}</p>

						<a href={connection.peer.metadata.url} class="underline hover:text-info" target="_blank"
							>{connection.peer.metadata.url}</a
						>
					</div>

					<details class="dropdown">
						<summary class="btn btn-square btn-ghost">
							<Icon src={EllipsisVertical} class="h-6 w-6" />
						</summary>
						<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
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
