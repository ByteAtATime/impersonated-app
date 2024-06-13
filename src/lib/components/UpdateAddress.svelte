<script lang="ts">
	import { Icon, PencilSquare } from 'svelte-hero-icons';
	import { impersonatedAddress } from '$lib/address';
	import { web3wallet } from '$lib/wallet';
	import AddressInput from '$lib/components/AddressInput.svelte';
	import { isAddress } from 'viem';

	let newAddress = $impersonatedAddress!;
	let modalOpen = false;

	const update = async () => {
		if (!$web3wallet) return;

		$impersonatedAddress = newAddress;

		const sessions = $web3wallet.getActiveSessions();

		for (const topic in sessions) {
			const session = sessions[topic];
			await $web3wallet.updateSession({
				topic,
				namespaces: {
					...session.namespaces,
					eip155: {
						...session.namespaces.eip155,
						accounts: [`eip155:1:${$impersonatedAddress}`]
					}
				}
			});

			await $web3wallet.emitSessionEvent({
				topic,
				event: {
					name: 'accountsChanged',
					data: [$impersonatedAddress]
				},
				chainId: 'eip155:1'
			});
		}

		modalOpen = false;
	};
</script>

<div>
	<label for="update-address-modal" class="btn btn-square btn-ghost btn-sm">
		<Icon src={PencilSquare} class="h-6 w-6" />
	</label>
	<input type="checkbox" id="update-address-modal" class="modal-toggle" bind:checked={modalOpen} />
	<label for="update-address-modal" class="modal cursor-pointer">
		<label class="modal-box relative">
			<input class="absolute left-0 top-0 h-0 w-0" />
			<h3 class="mb-3 text-xl font-bold">Update Impersonated Address</h3>
			<label
				for="update-address-modal"
				class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
			>
				✕
			</label>
			<div class="flex w-full flex-col gap-y-2">
				<AddressInput placeholder="Impersonated Address" bind:value={newAddress} />
				<button class="btn btn-primary" on:click={update} disabled={!isAddress(newAddress)}>Update</button>
			</div>
		</label>
	</label>
</div>
