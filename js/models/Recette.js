/**
 * Data Type of recette from JSON
 * @typedef Recette~DataType
 * 	  @param id : number
 *    @param name : string
 *    @param servings : number
 *    @param ingredients : Object[]
 *    @param time : number
 *    @param description : string
 *    @param appliance : string
 *    @param ustensiles : string[]
 */

/**
 * Data Type of getIngredients
 * @typedef IngredientsConcat
 * @typedef ingredient: {string}
 * @typedef quantityUnit: {string | null}
 * @param {ingredient, quantityUnit}
 */

/**
 * Recette DataType output
 * @typedef RecetteConstructor
 * 	  @param id : number
 *    @param name : string
 *    @param servings : number
 *    @param ingredients : Object[] {@link IngredientsConcat[]}
 *    @param time : number
 *    @param description : string
 *    @param appliance : string
 *    @param ustensiles : string[]
 */

/**
 * @class
 * @classdesc Constructor Model for Recette from JSON Data
 * @param {...Object} {@link Recette~DataType}
 * @return RecetteConstructor
 */
class Recette {
	constructor({
		id,
		name,
		servings,
		ingredients,
		time,
		description,
		appliance,
		ustensiles,
	}) {
		this._id = id
		this._name = name
		this._servings = servings
		this._ingredients = ingredients
		this._time = time
		this._description = description
		this._appliance = appliance
		this._ustensiles = ustensiles
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

	/**
	 * Number
	 * @return {number}
	 */
	get servings() {
		return this._servings
	}

	/**
	 * getIngredients
	 * @description transforms {ingredient, quantity, unit} into {ingredient, quantityUnit}
	 * @return IngredientsConcat[]
	 */
	get getIngredients() {
		return this._ingredients.map(list => {
			let {ingredient, quantity, unit} = list

			if (!quantity) return {ingredient}

			const switchUnit = this.unitAdapter(unit)
			const quantityUnit = `${quantity}${switchUnit}`
			return {ingredient, quantityUnit}
		})
	}

	/**
	 * Unit
	 * @description returns formatted unit
	 * @param unit : string
	 * @return string | undefined | null): string | undefined | null
	 */
	unitAdapter(unit) {
		if (!unit) return ""
		if (unit === "grammes") return "g"
		if (unit === "cuillères à soupe") return "cs."
		if (unit === "cuillères à café") return "cc."
		if (unit.length > 3) return ` ${unit}`
		return unit
	}

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
}
