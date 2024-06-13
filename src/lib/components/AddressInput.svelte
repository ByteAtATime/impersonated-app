<script lang="ts">
	import { type Address, isAddress } from 'viem';
	import { normalize } from 'viem/ens';
	import { mainnetClient } from '$lib/client';

	export let value: Address | string;
	export let address: Address | undefined = undefined;
	export let disabled: boolean = false;
	export let placeholder: string = '';

	const isENS = (value: string) => /.+\..+/.test(value);

	let rawDebouncedValue: string | undefined = undefined;
	let debouncedTimeout: number | undefined;

	const createDebouncedTimeout = () => {
		if (debouncedTimeout) {
			clearTimeout(debouncedTimeout);
		}

		debouncedTimeout = window.setTimeout(() => {
			rawDebouncedValue = value as string;
		}, 500);
	};

	$: {
		value;

		createDebouncedTimeout();
	}

	$: {
		if (value && isAddress(value)) address = value;
		else address = undefined;
	}

	// If the user enters an address, don't delay
	$: debouncedValue = isAddress(value) ? value : rawDebouncedValue;
	$: isDebouncedValueLive = debouncedValue === value;

	$: settledValue = isDebouncedValueLive ? debouncedValue : undefined;

	let enteredEnsName: string | undefined = undefined;

	let isEnsNameLoading = false;
	let ensName: string | null = null;

	$: {
		if (debouncedValue && settledValue && isAddress(settledValue) && isAddress(debouncedValue)) {
			isEnsNameLoading = true;
			ensName = null;

			mainnetClient
				.getEnsName({
					address: settledValue
				})
				.then((name) => {
					ensName = name;
				})
				.catch(() => {
					ensName = null;
				})
				.finally(() => {
					isEnsNameLoading = false;
				});
		}
	}

	let isEnsAddressLoading = false;
	let ensAddress: Address | null = null;

	const updateEnsAddress = () => {
		if (isDebouncedValueLive && debouncedValue && settledValue && isENS(debouncedValue)) {
			isEnsAddressLoading = true;
			ensAddress = null;

			mainnetClient
				.getEnsAddress({
					name: normalize(settledValue)
				})
				.then((address) => {
					ensAddress = address;
				})
				.catch(() => {
					ensAddress = null;
				})
				.finally(() => {
					isEnsAddressLoading = false;
				});
		}
	};

	$: {
		[isDebouncedValueLive, debouncedValue, settledValue];
		updateEnsAddress();
	}

	const setValueToEnsAddress = () => {
		if (ensAddress) {
			enteredEnsName = debouncedValue;
		}
	};

	$: {
		ensAddress;
		setValueToEnsAddress();

		if (ensAddress) {
			value = ensAddress;
		}
	}

	let isEnsAvatarLoading = false;
	let ensAvatar: string | null = null;

	$: {
		if (ensName) {
			isEnsAvatarLoading = true;
			ensAvatar = null;

			mainnetClient
				.getEnsAvatar({
					name: normalize(ensName)
				})
				.then((avatar) => {
					ensAvatar = avatar;
				})
				.catch(() => {
					ensAvatar = null;
				})
				.finally(() => {
					isEnsAvatarLoading = false;
				});
		}
	}

	const handleChange = () => {
		enteredEnsName = undefined;
	};
</script>

<label class="input input-bordered flex overflow-hidden p-0">
	<span>
		{#if ensName}
			<span class="flex h-full items-center gap-x-2 bg-base-300 px-2">
				{#if isEnsAvatarLoading}
					<span class="skeleton h-8 w-8 shrink-0 rounded-full bg-base-200" />
				{/if}
				{#if ensAvatar}
					<span class="w-8">
						<img class="w-full rounded-full" src={ensAvatar} alt="{ensAddress} avatar" />
					</span>
				{/if}
				<span class="text-accent">{enteredEnsName ?? ensName}</span>
			</span>
		{/if}
	</span>

	<input
		bind:value
		disabled={isEnsAddressLoading || isEnsNameLoading || disabled}
		on:change={handleChange}
		{placeholder}
		class="px-2"
	/>
</label>
