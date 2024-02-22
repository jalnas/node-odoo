// Type definitions for jalnas/node-odoo 0.9.9
// Project: https://github.com/jalnas/node-odoo
// Definitions by: Patrik Jalnäs <patrik@jaln.as>

import type { Model } from "./models.d.ts"

export = Odoo

// All fields (except id) of a model as optional
type SomeFieldsOf<M extends keyof Model> = Partial<Omit<{ [P in keyof Model[M]]: Model[M][P] }, "id">>

type Comparator = "=" | "!=" | ">=" | "<=" | ">" | "<" | "like" | "ilike" | "in"
type Filter<T> = [string: T, Comparator, string | number | boolean]

declare class Odoo {
	constructor(profile: { host: string; port: number; db: string; username: string; password: string; ssl?: boolean })

	connect(): Promise<number>

	/**
	 * Returns the amount of records that match some filter criteria
	 */
	count<M extends keyof Model>(model: M, filters: Filter<keyof Model[M]>[]): Promise<number>

	/**
	 * Retrieve a list of database ids of records matching some filter criteria
	 */
	search<M extends keyof Model>(
		model: M,
		filters: Filter<keyof Model[M]>[],
		offset?: number,
		amount?: number
	): Promise<number[]>

	/**
	 * Retrieve a list of objects containing field information given a list of database ids
	 */
	browse<M extends keyof Model, V extends keyof Model[M]>(
		model: M,
		fields: V[],
		ids: number[]
	): Promise<{ [P in V]: Model[M][P] }[]>

	/**
	 * Retrieve a list of objects containing field information
	 * from records selected by a filter criteria
	 */
	get<M extends keyof Model, V extends keyof Model[M]>(
		model: M,
		fields: V[],
		filters: Filter<keyof Model[M]>[],
		offset?: number,
		amount?: number
	): Promise<{ [P in V]: Model[M][P] }[]>

	/**
	 * Create a new record from an object
	 */
	create<M extends keyof Model>(
		model: M,
		record: Omit<{ [P in keyof Model[M]]: Model[M][P] }, "id">
	): Promise<number[]>

	/**
	 * Create new records from a list of objects
	 */
	create<M extends keyof Model>(
		model: M,
		records: Omit<{ [P in keyof Model[M]]: Model[M][P] }, "id">[]
	): Promise<number[]>

	/**
	 * Update some writeable fields of a list of record ids
	 * The fields of all record ids will be set to the same values
	 */
	update<M extends keyof Model>(model: M, ids: number[], values: SomeFieldsOf<M>): Promise<boolean>

	/**
	 * Delete records by a list of ids
	 */
	unlink<M extends keyof Model>(model: M, ids: number[]): Promise<boolean>

	/**
	 * Execute a python method on a model class
	 */
	call<M extends keyof Model>(model: M, method: string, ids: number[]): Promise<unknown>
}
