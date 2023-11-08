import { Transaction, } from 'sequelize';
import { Wallet, } from '../database/models';


interface ITransaction {
    transaction?: Transaction;
}

export class WalletRepository {
	static async create(userId: string, options: ITransaction = {}): Promise<Wallet> {
		const { transaction, } = options;
		return Wallet.create({
			userId,
		}, {
			transaction,
		});
	}
}