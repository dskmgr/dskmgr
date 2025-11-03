import type { RequestHandler } from '@sveltejs/kit';
import { Trouter } from 'trouter';
import { RegisterRoutes } from '../../../../build/api/routes';
import { inject } from 'light-my-request';
import express from 'express';

// const router = new Trouter();
// RegisterRoutes(router);

const server = express();
RegisterRoutes(server);

export const GET: RequestHandler = async (event) => {
	const pathname = event.url.pathname.replace('/api', '');
	console.log(`👨‍💻 GET ${event.url.pathname}`);
	// const obj = router.find('GET', pathname);
	// if (!obj) {
	// 	return new Response('Not Found', { status: 404 });
	// }

	// let result;
	// console.log(obj);
	// let response = new ServerResponse(event.request);
	// for (const fn of obj.handlers) {
	// 	result = await fn(event.request, response, (status) => {
	// 		console.log('next called with', status);
	// 	});
	// }
	// console.log('result', result);
	// return new Response(JSON.stringify(result), { status: 200 });

	const response = await inject(server, {
		method: 'GET',
		url: pathname.replace('/api', ''),
		headers: Object.fromEntries(event.request.headers)
	});
	console.log('response', response);

	return new Response(response.payload, {
		status: response.statusCode,
		headers: response.headers as Record<string, string>
	});
};
