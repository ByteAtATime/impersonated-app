<script>
	import { impersonatedAddress } from '$lib/address';
	import WalletUI from '$lib/components/WalletUI.svelte';
	import InitUI from '$lib/components/InitUI.svelte';
</script>

<svelte:head>
	<title>Impersonated.App</title>
	<meta name="description" content="Impersonate any Ethereum address and interact with dApps!" />
</svelte:head>

{#if $impersonatedAddress === undefined}
	<div class="flex min-h-screen items-center justify-center">
		<div class="loading loading-lg"></div>
	</div>
{:else if $impersonatedAddress === null}
	<InitUI />
{:else}
	<WalletUI />
{/if}
