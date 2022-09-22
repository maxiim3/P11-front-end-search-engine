export type RecetteFromJSON = {
	id: number
	name: string
	servings: number
	ingredients: initialIngredients[]
	time: number
	description: string
	appliance: string
	ustensiles: string[]
}

export type initialIngredients = {
	ingredient: string
	quantity?: number
	unit?: string
}

export type IngredientsConcat = {
	ingredient: string
	quantityUnit?: string | null
}

export type RecetteModelDataType = {
	id: number
	name: string
	servings: number
	ingredients: IngredientsConcat[]
	time: number
	description: string
	appliance: string
	ustensiles: string[]
}

export class Recette {
	/**
	 * @type number
	 * @private
	 */
	private readonly _id: number
	/**
	 * @type string
	 * @private
	 */
	private readonly _name: string
	/*	/!**
		 * @type number
		 * @private
		 *!/
		private readonly _servings: number*/
	/**
	 * @type Object[]
	 * @private
	 */
	private readonly _ingredients: IngredientsConcat[]
	/**
	 * @type number
	 * @private
	 */
	private readonly _time: number
	/**
	 * @type string
	 * @private
	 */
	private readonly _description: string
	/**
	 * @type string
	 * @private
	 */
	private readonly _appliance: string
	/**
	 * @type string[]
	 * @private
	 */
	private readonly _ustensiles: string[]

	/**
	 * @class
	 * @classdesc Constructor Model for Recette from JSON Data
	 * @param data : RecetteFromJSON
	 * @return Recette
	 */

	constructor(data: RecetteFromJSON) {
		this._id = data.id
		this._name = data.name
		/*this._servings = data.servings*/
		this._ingredients = this.getIngredients(data.ingredients) as IngredientsConcat[]
		this._time = data.time
		this._description = data.description
		this._appliance = data.appliance
		this._ustensiles = data.ustensiles
	}

	/**
	 * ID
	 * @return {number}
	 */
	get id() {
		return this._id
	}

	/**
	 * Name
	 * @return {string}
	 */
	get name() {
		return this._name
	}

	/*
	/!**
	 * Number
	 * @return {number}
	 *!/
	get servings() {
		return this._servings
	}
*/

	/**
	 * Time
	 * @return {string}
	 */
	get time() {
		return `${this._time} min`
	}

	/**
	 * Description
	 * @return {string}
	 */
	get description() {
		return this._description
	}

	/**
	 * Appareils  = appliance
	 * @return {string}
	 */
	get appliance() {
		return this._appliance
	}

	/**
	 * Ustensiles
	 * @return {string[]}
	 */
	get ustensiles() {
		return this._ustensiles
	}

	get ingredients(): IngredientsConcat[] {
		return this._ingredients
	}

	/**
	 * getIngredients
	 * @description transforms {ingredient, quantity, unit} into {ingredient, quantityUnit}
	 * @return IngredientsConcat[]
	 */
	getIngredients(ingredients: initialIngredients[]): IngredientsConcat[] {
		let output = [] as IngredientsConcat[]
		let quantityUnitOutput: string | null
		ingredients.map(({ingredient, quantity, unit}) => {
			const ingredientOutput: string = ingredient

			if (quantity === undefined || unit === undefined) quantityUnitOutput = null
			else {
				let switchUnit = this._unitAdapter(unit)
				quantityUnitOutput = `${quantity}${switchUnit}`
			}

			output.push({ingredient: ingredientOutput, quantityUnit: quantityUnitOutput})
		})

		return output
	}

	/**
	 * Unit
	 * @description returns formatted unit
	 * @param unit : string
	 * @return string | undefined | null): string | undefined | null
	 */
	_unitAdapter(unit: string): string {
		if (!unit) return ""
		if (unit === "grammes") return "g"
		if (unit === "cuillères à soupe") return "cs."
		if (unit === "cuillères à café") return "cc."
		if (unit.length > 3) return ` ${unit}`
		return unit
	}
}
