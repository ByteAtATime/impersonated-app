<script lang="ts">
	import { impersonatedAddress } from '$lib/address';

	let initialAddress = '';

	const connect = async () => {
		$impersonatedAddress = initialAddress;
	}
</script>

<div class="flex flex-col items-center gap-y-2 justify-center min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Impersonator.App</h1>
	<p class="text-lg">Impersonate any Ethereum address and interact with dApps!</p>

	<p class="text-lg">To get started, enter the address you would like to impersonate:</p>

	<div class="join">
		<input type="text" placeholder="Address to Impersonate" class="join-item input input-bordered" bind:value={initialAddress} />
		<button class="join-item btn btn-primary" on:click={connect}>Let's go!</button>
	</div>
</div>
