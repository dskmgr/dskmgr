import { command } from '$app/server';
import * as v from 'valibot';

export const upperCase = command(v.string(), (str) => str.toUpperCase());
