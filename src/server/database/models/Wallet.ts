import { BelongsTo, Column, DataType, ForeignKey, Model, } from 'sequelize-typescript';
import { getUUID, } from '../../utils';
import { User, } from './User';

export class Wallet extends Model {
    @Column({
    	primaryKey: true,
    	type: DataType.UUID,
    	defaultValue: () => getUUID(),
    })
	override id!: string;

    @Column({
    	type: DataType.NUMBER,
    	defaultValue: 0,
    })
    	balance!: number;

    @ForeignKey(() => User)
    @Column({
    	type: DataType.UUID,
    	allowNull: false,
    })
    	userId!: string;

    @BelongsTo(() => User)
    	user!: User;
}