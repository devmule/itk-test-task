import { Transaction, } from 'sequelize';
import { Session, User, } from '../database/models';
import { SessionStatus, UserStatus, } from '../enums';

export class SessionRepository {
	static async findActiveSession(
		sessionId: string,
		transaction?: Transaction
	): Promise<Session | null> {
		return Session.findOne({
			where: {
				id: sessionId,
				status: SessionStatus.Active,
			},
			include: [
				{
					model: User,
					where: {
						status: [UserStatus.Active],
					},
					required: true,
				}
			],
			transaction,
		});
	}

	static async createUserSession(userId: string, transaction?: Transaction): Promise<Session> {
		return Session.create(
			{
				userId,
				status: SessionStatus.Active,
			},
			{
				transaction,
			}
		);
	}
}
