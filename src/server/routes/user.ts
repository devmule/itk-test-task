import Joi from 'joi';
import { ServerRoute, } from '@hapi/hapi';
import * as api from '../api/user';
import * as user from '../schemas/user';
import { outputOkSchema, outputPaginationSchema, } from '../schemas/common';

export default <ServerRoute[]>[
	{
		method: 'POST',
		path: '/user/search',
		handler: api.search,
		options: {
			id: 'user.search',
			description: 'Search users',
			tags: ['api', 'user'],
			validate: {
				payload: user.searchSchema,
			},
			response: {
				schema: outputPaginationSchema(user.userSchema),
			},
		},
	},
	{
		method: 'GET',
		path: '/user/{id}',
		handler: api.get,
		options: {
			id: 'user.get',
			description: 'Get user by id',
			tags: ['api', 'user'],
			validate: {
				params: user.idPropSchema,
			},
			response: {
				schema: outputOkSchema(user.userSchema),
			},
		},
	},
	{
		method: 'PATCH',
		path: '/user/{id}',
		handler: api.updateName,
		options: {
			id: 'user.update',
			description: 'Update user name',
			tags: ['api', 'user', 'name'],
			validate: {
				params: user.idPropSchema,
				payload: user.updateSchema,
			},
			response: {
				schema: outputOkSchema(user.userSchema),
			},
		},
	},
	{
		method: 'GET',
		path: '/user/statistics',
		handler: api.newUsersLastMonth,
		options: {
			id: 'user.statistics',
			description: 'Count of new users in past month',
			tags: ['api', 'user', 'statistics'],
			response: {
				schema: outputOkSchema(Joi.number()),
			},
		},
	}
]