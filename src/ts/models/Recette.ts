export type Ingredient = {
	ingredient: string
	quantity: number
	unit: string | undefined | null
}

export class Recette {
	private readonly _id: number
	private readonly _ustensiles: string[]
	private readonly _appliance: string
	private readonly _name: string
	private readonly _servings: number
	private _ingredients: Ingredient[]
	private readonly _time: string
	private readonly _description: string

	constructor({
		id,
		name,
		servings,
		ingredients,
		time,
		description,
		appliance,
		ustensiles,
	}:Object) {
		this._id = id
		this._name = name
		this._servings = servings
		this._ingredients = ingredients
		this._time = time
		this._description = description
		this._appliance = appliance
		this._ustensiles = ustensiles
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
	get ingredients(): Object[] {
		return this._ingredients.map(({ingredient, quantity, unit}) => {
			if (!quantity) return {ingredient}
			else {
				const switchUnit = this.unitAdapter(unit)
				const quantityUnit = `${quantity}${switchUnit}`
				return [ingredient, quantityUnit]
			}
		})
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
