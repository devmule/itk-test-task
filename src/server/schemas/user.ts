import Joi from 'joi';
import { UserStatus, } from '../enums';
import { idSchema, } from './common';

export const userSchema = Joi.object({
	id: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
	status: Joi.string().example(UserStatus.New),
	firstName: Joi.string().optional(),
	lastName: Joi.string().optional(),
}).label('User schema');

export const searchSchema = Joi.object({
	email: Joi.string().email().optional(),
	limit: Joi.number().min(1).max(1000).optional(),
	offset: Joi.number().min(0).optional(),
}).label('Searching options');

export const idPropSchema = Joi.object({
	id: idSchema,
}).label('Get user properties');

export const updateSchema = Joi.object({
	firstName: Joi.string().optional(),
	lastName: Joi.string().optional(),
}).min(1).label('User update schema. At least one field need to be set!');