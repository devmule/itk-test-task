import { Op, Transaction, } from 'sequelize';
import { User, } from '../database/models';
import { UserStatus, } from '../enums';

interface ITransaction {
	transaction?: Transaction;
}

interface IFindByLoginOptions extends ITransaction {
	scope?: string;
}

interface ISearchOptions extends ITransaction {
	limit: number;
	offset: number;
	email?: string;
}

interface IFindByCreatedAtOptions extends ITransaction {
	min?: Date;
	max?: Date;
}

interface ISearchResult {
	rows: User[];
	count: number;
}

export class UserRepository {
	static async search(options: ISearchOptions): Promise<ISearchResult> {
		const { email, limit, offset, transaction, } = options;
		return User.findAndCountAll({
			...(email ? { where: { email: email, }, } : {}),
			limit,
			offset,
			transaction,
		});
	}

	static async get(id: string, options: ITransaction = {}): Promise<User | null> {
		const { transaction, } = options;
		return User.findOne({
			where: { id, },
			transaction,
		});
	}

	static async findByEmail(email: string, options: ITransaction = {}): Promise<User | null> {
		const { transaction, } = options;

		return User.findOne({
			where: {
				email,
			},
			transaction,
		});
	}

	static async findByLogin(
		login: string,
		options: IFindByLoginOptions = {}
	): Promise<User | null> {
		const { transaction, scope = 'defaultScope', } = options;

		return User.scope(scope).findOne({
			where: {
				[Op.or]: [
					{
						email: login,
					},
					{
						phone: login,
					}
				],
			},
			transaction,
		});
	}

	static async countByCreatedAt(options: IFindByCreatedAtOptions): Promise<number> {
		const { min, max, transaction, } = options;

		return User.count({
			where: {
				createdAt: {
					...( min ? { [Op.gt]: min, } : {} ),
					...( max ? { [Op.lt]: max, } : {} ),
				},
			},
			transaction,
		});

	}

	static async create(
		values: Partial<User>,
		options: ITransaction = {}
	): Promise<User> {
		const { transaction, } = options;

		return User.create({
			...values,
			status: UserStatus.Active,
		}, {
			transaction,
		});
	}

	static async update(
		id: string,
		values: Partial<User>,
		options: ITransaction = {}
	): Promise<User | null> {
		const { transaction, } = options;

		const [,[result]] = await User.update({
			...values,
		}, {
			where: { id, },
			limit : 1,
			transaction,
		});
		return result ?? null;
	}
}
