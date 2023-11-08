import * as Hapi from '@hapi/hapi';
import { Boom, } from '@hapi/boom';
import { Session, } from '../database/models';
import { ICredentials, IJwt, IOutputEmpty, IOutputOk, ISignUpCredentials, } from '../interfaces';
import { Errors, ErrorsMessages, Exception, handlerError, outputEmpty, outputOk, } from '../utils';
import { SessionStatus, UserStatus, } from '../enums';
import { JwtTokenHelper, } from '../helpers/JwtTokenHelper';
import { UserRepository, } from '../repositories/UserRepository';
import { SessionRepository, } from '../repositories/SessionRepository';

export async function signup(
	r: Hapi.Request
): Promise<IOutputEmpty | IOutputOk<{ token?: string }> | Boom> {
	try {
		const cred = r.payload as ISignUpCredentials;
		let user = await UserRepository.findByEmail(cred.email);
		if (user)
			throw new Exception(Errors.UserAlreadyExist, ErrorsMessages[Errors.UserAlreadyExist], {
				email: cred.email,
			});

		user = await UserRepository.create({ email: cred.email, password: cred.password, });
		return outputEmpty();
	} catch (err) {
		return handlerError('Failed to sign-up', err as Error);
	}
}

export async function login(r: Hapi.Request): Promise<IOutputOk<IJwt> | Boom> {
	try {
		const { login, password, } = r.payload as ICredentials;
		const user = await UserRepository.findByLogin(login, { scope: 'withPassword', });

		if (!user || !user.passwordCompare(password))
			throw new Exception(
				Errors.AuthCredentialsIncorrect,
				ErrorsMessages[Errors.AuthCredentialsIncorrect]
			);

		if (user.status !== UserStatus.Active)
			throw new Exception(Errors.UserNotActive, ErrorsMessages[Errors.UserNotActive]);

		const { id: sessionId, } = await SessionRepository.createUserSession(user.id);
		const tokens = JwtTokenHelper.generateJwt({ sessionId, });

		return outputOk(tokens);
	} catch (err) {
		return handlerError('Failed to login', err);
	}
}

export function tokenRefresh(r: Hapi.Request): IOutputOk<IJwt> | Boom {
	try {
		const tokens = JwtTokenHelper.generateJwt({ sessionId: r.auth.artifacts['sessionId'], });
		return outputOk(tokens);
	} catch (err) {
		return handlerError('Failed to refresh token', err);
	}
}

export async function logout(r: Hapi.Request): Promise<IOutputEmpty | Boom> {
	try {
		const session = await Session.findByPk(String(r.auth.artifacts['sessionId']));

		if (!session)
			throw new Exception(Errors.SessionNotFound, ErrorsMessages[Errors.SessionNotFound]);

		await session.update({
			status: SessionStatus.Finished,
		});
		return outputEmpty();
	} catch (err) {
		return handlerError('Failed to logout', err);
	}
}
