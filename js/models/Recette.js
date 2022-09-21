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
export class Recette {
	/**
	 * @type number
	 * @private
	 */
	#id
	/**
	 * @type string
	 * @private
	 */
	#name
	/**
	 * @type number
	 * @private
	 */
	#servings
	/**
	 * @type Object[]
	 * @private
	 */
	#ingredients
	/**
	 * @type number
	 * @private
	 */
	#time
	/**
	 * @type string
	 * @private
	 */
	#description
	/**
	 * @type string
	 * @private
	 */
	#appliance
	/**
	 * @type string[]
	 * @private
	 */
	#ustensiles
	/**
	 * @class
	 * @classdesc Constructor Model for Recette from JSON Data
	 * @param {...Object} {@link Recette~DataType}
	 * @return RecetteConstructor
	 * @param id : number
	 * @param name : string
	 * @param servings : number
	 * @param ingredients : Object[]
	 * @param time : number
	 * @param description : string
	 * @param appliance : string
	 * @param ustensiles : string[]
	 */

	constructor({id, name, servings, ingredients, time, description, appliance, ustensiles}) {
		this.#id = id
		this.#name = name
		this.#servings = servings
		this.#ingredients = ingredients
		this.#time = time
		this.#description = description
		this.#appliance = appliance
		this.#ustensiles = ustensiles
	}

	/**
	 * ID
	 * @return {number}
	 */
	get id() {
		return this.#id
	}

	/**
	 * Name
	 * @return {string}
	 */
	get name() {
		return this.#name
	}

	/**
	 * Number
	 * @return {number}
	 */
	get servings() {
		return this.#servings
	}

	/**
	 * Time
	 * @return {string}
	 */
	get time() {
		return `${this.#time} min`
	}

	/**
	 * Description
	 * @return {string}
	 */
	get description() {
		return this.#description
	}

	/**
	 * Appareils  = appliance
	 * @return {string}
	 */
	get appliance() {
		return this.#appliance
	}

	/**
	 * Ustensiles
	 * @return {string[]}
	 */
	get ustensiles() {
		return this.#ustensiles
	}

	/**
	 * getIngredients
	 * @description transforms {ingredient, quantity, unit} into {ingredient, quantityUnit}
	 * @return IngredientsConcat[]
	 */
	get getIngredients() {
		return this.#ingredients.map(list => {
			let {ingredient, quantity, unit} = list

			if (!quantity) return {ingredient}

			const switchUnit = this.#unitAdapter(unit)
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
	#unitAdapter(unit) {
		if (!unit) return ""
		if (unit === "grammes") return "g"
		if (unit === "cuillères à soupe") return "cs."
		if (unit === "cuillères à café") return "cc."
		if (unit.length > 3) return ` ${unit}`
		return unit
	}
}
