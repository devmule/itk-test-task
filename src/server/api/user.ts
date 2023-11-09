import * as Hapi from '@hapi/hapi';
import { IOutputOk, IOutputPagination, IUserGet, IUserSearch, IUserUpdateName, } from '../interfaces';
import { Errors, ErrorsMessages, Exception, handlerError, } from '../utils';
import { Boom, } from '@hapi/boom';
import { UserRepository, } from '../repositories';
import { User, } from '../database/models';
import * as console from "console";

export async function search(r: Hapi.Request): Promise<IOutputPagination<User[]> | Boom> {
	try {
		const opt = r.payload as IUserSearch;
		const result = await UserRepository.search({
			offset: opt?.offset ?? 0,
			limit: opt?.limit ?? 50,
			...(opt?.email ? { email: opt.email, } : {}),
		});
		return {
			ok: true,
			result,
		};
	} catch (err) {
		return handlerError('Failed to search', err as Error);
	}
}

export async function get(r: Hapi.Request): Promise<IOutputOk<User> | Boom> {
	try {
		const { id, } = r.params as IUserGet;
		const result = await UserRepository.get(id);
		if (result) return {
			ok: true,
			result,
		}
		throw new Exception(Errors.UserNotFound, ErrorsMessages[Errors.UserNotFound], { id, });
	} catch (err) {
		return handlerError('Failed to get', err as Error);
	}
}

export async function updateName(r: Hapi.Request): Promise<IOutputOk<User> | Boom> {
	try {
		const { id, } = r.params as IUserGet;
		const { firstName, lastName, } = r.payload as IUserUpdateName;
		const result = await UserRepository.update(id, {
			...(firstName ? { firstName, } : {}),
			...(lastName ? { lastName, } : {}),
		});
		if (result) return {
			ok: true,
			result,
		}
		throw new Exception(Errors.UserNotFound, ErrorsMessages[Errors.UserNotFound], { id, });
	} catch (err) {
		console.error(err);
		return handlerError('Failed to get', err as Error);
	}
}

export async function newUsersLastMonth(): Promise<IOutputOk<number> | Boom> {
	try {
		// get time range of previous month
		// from 00:00 of 1st day of prev month
		// to 00:00 of 1st day of current month
		const now = new Date();
		const firstDay = new Date(now.getUTCFullYear(), now.getUTCMonth());
		const lastDay = new Date(now.getUTCFullYear(), now.getUTCMonth() - 1);

		const count = await UserRepository.countByCreatedAt({
			min: firstDay,
			max: lastDay,
		});
		return {
			ok: true,
			result: count,
		}
	} catch (err) {
		return handlerError('Failed to get', err as Error);
	}
}