<script>
	import { Icon, PencilSquare } from 'svelte-hero-icons';
	import { impersonatedAddress } from '$lib/address';
	import { web3wallet } from '$lib/wallet';

	let newAddress = $impersonatedAddress;
	let modalOpen = false;

	const update =async () => {
		if (!$web3wallet) return;

		$impersonatedAddress = newAddress;

		const sessions = $web3wallet.getActiveSessions()

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
					name: "accountsChanged",
					data: [$impersonatedAddress]
				},
				chainId: "eip155:1"
			})
		}

		modalOpen = false;
	};
</script>

<div>
	<label for="update-address-modal" class="btn btn-ghost btn-sm btn-square">
		<Icon src={PencilSquare} class="w-6 h-6" />
	</label>
	<input type="checkbox" id="update-address-modal" class="modal-toggle" bind:checked={modalOpen} />
	<label for="update-address-modal" class="modal cursor-pointer">
		<label class="modal-box relative">
			<input class="h-0 w-0 absolute top-0 left-0" />
			<h3 class="text-xl font-bold mb-3">Update Impersonated Address</h3>
			<label for="update-address-modal" class="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
				✕
			</label>
			<div class="join w-full">
				<input type="text" placeholder="Impersonated Address" class="w-full join-item input input-bordered" bind:value={newAddress} />
				<button class="btn btn-primary join-item" on:click={update}>Update</button>
			</div>
		</label>
	</label>
</div>