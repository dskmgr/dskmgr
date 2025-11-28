import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './database';
import { ALLOWED_ORIGINS } from '$lib/config/origins';

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	trustedOrigins: ALLOWED_ORIGINS,
	emailAndPassword: {
		enabled: true
	}
});
