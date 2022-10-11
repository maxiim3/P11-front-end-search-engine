import {StringUtility} from "../utils/StringUtility.js"
import {Recette} from "../models/Recette.js"

export class HandleOptionTags {
	/**
	 * @type Recette[]
	 */
	recettes

	/**
	 * @param data : Recette[]
	 */
	constructor(data) {
		this.recettes = data
	}

	/**
	 * @return Promise<IngredientsConcat[]>
	 */
	async getAllIngredients() {
		const allIngredients = []

		this.recettes.map(recette => {
			recette.ingredients.forEach(({ingredient}) => {
				const ingredientFormatted = StringUtility.firstLetterToUpperCase(ingredient)
				allIngredients.push(ingredientFormatted)
			})
		})
		return [...new Set(allIngredients)]
	}

	/**
	 *@
	 * @return {Promise<string[]>}
	 */
	async getAllAppliance() {
		const allAppliance = []
		this.recettes.forEach(({appliance}) => {
			const applianceFormatted = StringUtility.firstLetterToUpperCase(appliance)
			allAppliance.push(applianceFormatted)
		})
		return [...new Set(allAppliance)]
	}

	/**
	 * @return {Promise<string[]>}
	 */
	async getAllUstensiles() {
		const allUstensiles = []
		this.recettes.forEach(recette => {
			recette.ustensiles.forEach(ustensile => {
				const ustensileFormatted = StringUtility.firstLetterToUpperCase(ustensile)
				allUstensiles.push(ustensileFormatted)
			})
		})
		return [...new Set(allUstensiles)]
	}

	async getAllOptionTags() {
		const ingredients = await this.getAllIngredients()
		const appliance = await this.getAllAppliance()
		const ustensiles = await this.getAllUstensiles()
		return {ingredients, appliance, ustensiles}
	}

	/**
	 * @public
	 * @async
	 * @return Promise<void>
	 */
	async render() {
		if (this.recettes.length !== 0) {
			const allOptionTags = await this.getAllOptionTags()
			await this.appendOptionTagsToEachFilter({...allOptionTags})
		}
	}

	/**
	 * @description Append all <HTMLLIElement> tags for each types {ingredients, appliance, ustensiles}
	 * @param arrayOfTags : Object {ingredients: string[]; appliance: string[]; ustensiles: string[]}
	 * @return {Promise<void>}
	 */
	async appendOptionTagsToEachFilter(arrayOfTags) {
		const $filterType = [...document.querySelectorAll(".filtres__list")]

		$filterType.forEach($filter => {
			const categoryName = $filter.dataset.filterName
			const tags = [...arrayOfTags[categoryName]]
			tags.forEach(tag => {
				const btn = document.createElement("button")
				btn.textContent = tag
				btn.value = tag
				btn.dataset.filterType = categoryName

				const li = document.createElement("li")
				li.dataset.value = StringUtility.removeAccent(tag)
				li.dataset.visible = "true"
				li.dataset.active = "true"
				li.appendChild(btn)

				$filter.appendChild(li)
			})
		})
	}
}
