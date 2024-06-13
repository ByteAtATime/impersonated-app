<script lang="ts">
	import { impersonatedAddress } from '$lib/address';
	import AddressInput from '$lib/components/AddressInput.svelte';

	let initialAddress = '';

	const connect = async () => {
		$impersonatedAddress = initialAddress;
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-y-2">
	<h1 class="mb-4 text-4xl font-bold">Impersonated.App</h1>
	<p class="text-lg">Impersonate any Ethereum address and interact with dApps!</p>

	<p class="text-lg">To get started, enter the address you would like to impersonate:</p>

	<div class="join">
		<AddressInput bind:value={initialAddress} />
		<button class="btn btn-primary join-item" on:click={connect}>Let's go!</button>
	</div>
</div>
