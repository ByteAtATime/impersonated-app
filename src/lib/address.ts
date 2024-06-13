import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

/** undefined = still loading, null = no address chosen */
export const impersonatedAddress: Writable<string | undefined | null> = writable(undefined);

if (browser) {
	const $impersonatedAddress = localStorage.getItem('impersonatedAddress');
	if ($impersonatedAddress) impersonatedAddress.set($impersonatedAddress);
	else impersonatedAddress.set(null);
}

impersonatedAddress.subscribe(($impersonatedAddress) => {
	if (typeof localStorage === 'undefined' || !$impersonatedAddress) return;

	localStorage.setItem('impersonatedAddress', $impersonatedAddress);
});
