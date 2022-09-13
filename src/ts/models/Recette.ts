export type Ingredients = {
	ingredient: string
	quantity: number
	unit: string | null
}
export type MappedIngredients = {
	ingredient: string
	quantityUnit: string | null | undefined
}

export class Recette {
	private readonly _id: number
	private readonly _ustensiles: string[]
	private readonly _appliance: string
	private readonly _name: string
	private readonly _servings: number
	private ingredients: Ingredients[]
	private readonly _time: string
	private readonly _description: string

	constructor(data: Recette) {
		console.log(data)
		this._id = data.id
		this._name = data.name
		this._servings = data.servings
		this.ingredients = data.ingredients
		this._time = data.time
		this._description = data.description
		this._appliance = data.appliance
		this._ustensiles = data.ustensiles
	}

	get id(): number {
		return this._id
	}

	get name(): string {
		return this._name
	}

	get servings(): number {
		return this._servings
	}

	/**
	 *
	 * @return {Object}
	 */
	get getIngredients(): MappedIngredients[] {
		const mappedData: MappedIngredients[] = []
		this.ingredients.map(data => {
			if (!data.quantity) mappedData.push({ingredient: data.ingredient, quantityUnit: null})
			else {
				let quantityUnit: string = !data.unit
					? `${data.quantity}`
					: `${data.quantity}${this.unitAdapter(data.unit)}`
				mappedData.push({ingredient: data.ingredient, quantityUnit})
			}
		})
		return mappedData
	}

	unitAdapter(unit: string | undefined | null): string | undefined | null {
		if (!unit) return ""
		if (unit === "grammes") return "g"
		if (unit === "cuillères à soupe") return "cs."
		if (unit === "cuillères à café") return "cc."
		if (unit.length > 3) return ` ${unit}`
		return unit
	}

	get time(): string {
		return `${this._time} min`
	}

	get description(): string {
		return this._description
	}

	get appliance(): string {
		return this._appliance
	}

	get ustensiles(): string[] {
		return this._ustensiles
	}
}
