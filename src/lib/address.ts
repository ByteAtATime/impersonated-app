import { writable } from 'svelte/store';

export const impersonatedAddress = writable("0x34aA3F359A9D614239015126635CE7732c18fDF3");

impersonatedAddress.subscribe($impersonatedAddress => {
	if (typeof localStorage === 'undefined') return;

	localStorage.setItem('impersonatedAddress', $impersonatedAddress);
})
