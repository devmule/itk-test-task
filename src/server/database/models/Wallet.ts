import { BelongsTo, Column, DataType, ForeignKey, Model, Table, } from 'sequelize-typescript';
import { getUUID, } from '../../utils';
import { User, } from './User';

@Table({
	paranoid: true,
})
export class Wallet extends Model {
    @Column({
    	primaryKey: true,
    	type: DataType.UUID,
    	defaultValue: () => getUUID(),
    })
	override id!: string;

    @Column({
    	type: DataType.INTEGER,
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