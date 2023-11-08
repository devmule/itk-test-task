import { ServerRoute, } from '@hapi/hapi';
import * as api from '../api/auth';
import * as auth from '../schemas/auth';
import { outputEmptySchema, outputOkSchema, } from '../schemas/common';
import { AuthStrategy, } from '../enums';

export default <ServerRoute[]>[
	{
		method: 'POST',
		path: '/auth/registration',
		handler: api.signup,
		options: {
			auth: false,
			id: 'auth.registration',
			description: 'Sign up',
			tags: ['api', 'auth'],
			validate: {
				payload: auth.signupSchema,
			},
			response: {
				schema: outputEmptySchema(),
			},
		},
	},
	{
		method: 'POST',
		path: '/auth/login',
		handler: api.login,
		options: {
			auth: false,
			id: 'auth.login',
			description: 'Login user',
			tags: ['api', 'auth'],
			validate: {
				payload: auth.credentialsSchema,
			},
			response: {
				schema: outputOkSchema(auth.jwtTokensSchema),
			},
		},
	},
	{
		method: 'POST',
		path: '/auth/logout',
		handler: api.logout,
		options: {
			id: 'auth.logout',
			description: 'Logout user',
			tags: ['api', 'auth'],
			response: {
				schema: outputEmptySchema(),
			},
		},
	},
	{
		method: 'POST',
		path: '/auth/token/refresh',
		handler: api.tokenRefresh,
		options: {
			auth: AuthStrategy.JwtRefresh,
			id: 'auth.token.refresh',
			description: 'Use this endpoint to refresh token',
			tags: ['api', 'auth'],
			response: {
				schema: outputOkSchema(auth.jwtTokensSchema),
			},
		},
	}
];
