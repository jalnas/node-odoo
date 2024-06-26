const xmlrpc = require("xmlrpc")

class Odoo {
	#profile
	#xmlrpc
	#connected = false
	#uid

	connect() {
		this.#xmlrpc = xmlrpc.createClient({
			host: this.#profile.host,
			port: this.#profile.port,
			path: "/xmlrpc/2/common",
		})

		if (this.#profile.ssl) {
			this.#xmlrpc.isSecure = true
		}

		return new Promise((resolve, reject) => {
			this.#xmlrpc.methodCall(
				"authenticate",
				[this.#profile.db, this.#profile.username, this.#profile.password, {}],
				(error, uid) => {
					if (error) {
						reject(error)
					} else {
						this.#connected = true
						this.#uid = uid
						this.#xmlrpc.options.path = "/xmlrpc/2/object"
						resolve(uid)
					}
				}
			)
		})
	}

	#execute_kw(model, method, params) {
		if (!this.#connected) {
			throw new Error("not authenticated, connect() before running queries")
		}

		return new Promise((resolve, reject) => {
			this.#xmlrpc.methodCall(
				"execute_kw",
				[this.#profile.db, this.#uid, this.#profile.password, model, method, params],
				(error, value) => {
					if (error) {
						reject(error)
					} else {
						resolve(value)
					}
				}
			)
		})
	}

	constructor(profile) {
		this.#profile = profile
	}

	count(model, filters) {
		return this.#execute_kw(model, "search_count", [filters])
	}

	search(model, filters, offset, amount) {
		return this.#execute_kw(model, "search", [filters, offset, amount])
	}

	browse(model, fields, ids) {
		return this.#execute_kw(model, "read", [ids, fields])
	}

	get(model, fields, filters, offset, amount) {
		return this.#execute_kw(model, "search_read", [filters, fields, offset, amount])
	}

	create(model, records) {
		if (!Array.isArray(records)) {
			records = [records]
		}
		return this.#execute_kw(model, "create", [records])
	}

	update(model, ids, values) {
		return this.#execute_kw(model, "write", [ids, values])
	}

	unlink(model, ids) {
		return this.#execute_kw(model, "unlink", [ids])
	}

	call(model, method, ids) {
		return this.#execute_kw(model, method, [ids])
	}
}

module.exports = Odoo
