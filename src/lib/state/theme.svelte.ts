import { writable } from 'svelte/store';

export const theme = writable<'light' | 'dark'>('light');
export const THEME_LOCAL_STORAGE_KEY = 'theme-preference';
