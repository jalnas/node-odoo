// replace with relevant db schema

interface PlaceholderModel {
	id: number
	name: string
	active: boolean
	state: "draft" | "confirmed" | "cancelled"
	optional?: boolean
}

export type Model = {
	"placeholder.model": PlaceholderModel
}
