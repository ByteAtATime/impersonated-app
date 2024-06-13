<script>
	import { impersonatedAddress } from '$lib/address';
	import WalletUI from '$lib/components/WalletUI.svelte';
	import InitUI from '$lib/components/InitUI.svelte';
</script>

{#if $impersonatedAddress === undefined}
	<div class="flex min-h-screen items-center justify-center">
		<div class="loading loading-lg"></div>
	</div>
{:else if $impersonatedAddress === null}
	<InitUI />
{:else}
	<WalletUI />
{/if}
