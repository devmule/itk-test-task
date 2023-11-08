import { Sequelize, } from 'sequelize-typescript';
import { config, } from '../config/config';
import * as models from './models';
import { SyncOptions, } from 'sequelize';

export class Database extends Sequelize {
	private static _instance: Database;

	static async instance(): Promise<Database> {
		if (!Database._instance) {

			Database._instance = new Database();

			const syncOptions: SyncOptions = {};
			if (config.test) syncOptions.force = true;

			await Database._instance.sync();
		}

		return Database._instance;
	}

	constructor() {
		const dbLink = config.test ? config.testDbLink : config.dbLink;
		super(dbLink, {
			dialect: 'postgres',
			models: Object.values(models),
			pool: {
				max: 40,
				min: 0,
				idle: 10000,
				acquire: 60000,
				evict: 1000,
			},
			logging: false,
		});
	}
}
