// Type definitions for node-odoo 0.0.1
// Project: https://github.com/jalnas/node-odoo
// Definitions by: Patrik Jalnäs <jaln.as>
export = Odoo

type Comparator = "=" | "!=" | ">=" | "<=" | ">" | "<"
type Filter = [string, Comparator, string | number | boolean]

declare class Odoo {
	constructor(profile: { host: string; port: number; db: string; username: string; password: string; ssl?: boolean })

	connect(): Promise<number>
	search(model: string, filters: Filter[], offset?: number, amount?: number): Promise<number[]>
	browse(model: string, fields: string[], ids: number[]): Promise<Object[]>
	get(model: string, fields: string[], filters: Filter[], offset?: number, amount?: number): Promise<Object[]>
	create(model: string, records: Object[]): Promise<number[]>
	unlink(model: string, ids: number[]): Promise<boolean>
	call(model: string, method: string, ids: number[]): Promise<unknown>
}
