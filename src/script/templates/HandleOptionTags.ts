import {StringUtility} from "../utils/StringUtility.js"
import {Recette} from "../models/Recette.js"

export class HandleOptionTags {
	/**
	 * @type Recette[]
	 * @private
	 */
	private recettes: Recette[]

	/**
	 * @param data : Recette[]
	 */
	constructor(data: Recette[]) {
		this.recettes = data
	}

	/**
	 * @private
	 * @return Promise<IngredientsConcat[]>
	 */
	private async getAllIngredients(): Promise<string[]> {
		const allIngredients = [] as string[]

		this.recettes.map(recette => {
			recette.ingredients.forEach(({ingredient}) => {
				const ingredientFormatted = StringUtility.firstLetterToUpperCase(ingredient) as string
				allIngredients.push(ingredientFormatted)
			})
		})
		return [...new Set(allIngredients)]
	}

	/**
	 *@private
	 * @return {Promise<string[]>}
	 */
	private async getAllAppliance(): Promise<string[]> {
		const allAppliance = [] as string[]
		this.recettes.forEach(({appliance}) => {
			const applianceFormatted = StringUtility.firstLetterToUpperCase(appliance) as string
			allAppliance.push(applianceFormatted)
		})
		return [...new Set(allAppliance)]
	}

	/**
	 * @private
	 * @return {Promise<string[]>}
	 */
	private async getAllUstensiles(): Promise<string[]> {
		const allUstensiles = [] as string[]
		this.recettes.forEach(recette => {
			recette.ustensiles.forEach(ustensile => {
				const ustensileFormatted = StringUtility.firstLetterToUpperCase(ustensile)
				allUstensiles.push(ustensileFormatted)
			})
		})
		return [...new Set(allUstensiles)]
	}

	async getAllOptionTags() {
		const ingredients = (await this.getAllIngredients()) as string[]
		const appliance = (await this.getAllAppliance()) as string[]
		const ustensiles = (await this.getAllUstensiles()) as string[]
		return {ingredients, appliance, ustensiles}
	}

	/**
	 * @public
	 * @async
	 * @return {Promise<void>}
	 */
	async render() {
		if (this.recettes.length !== 0) {
			const allOptionTags = await this.getAllOptionTags()
			await this.appendOptionTagsToEachFilter({...allOptionTags})
		}
	}

	/**
	 * @description Append all <HTMLLIElement> tags for each types {ingredients, appliance, ustensiles}
	 * @param arrayOfTags : {ingredients: string[]; appliance: string[]; ustensiles: string[]}
	 * @return {Promise<void>}
	 */
	private async appendOptionTagsToEachFilter(arrayOfTags: {ingredients: string[]; appliance: string[]; ustensiles: string[]}) {
		const $filterType = [...document.querySelectorAll(".filtres__list")] as HTMLUListElement[]

		$filterType.forEach($filter => {
			const categoryName = $filter.dataset.filterName as "ingredients" | "appliance" | "ustensiles"
			const tags: string[] = [...arrayOfTags[categoryName]]
			tags.forEach(tag => {
				const btn = document.createElement("button") as HTMLButtonElement
				btn.textContent = tag
				btn.value = tag
				btn.dataset.filterType = categoryName

				const li = document.createElement("li") as HTMLLIElement
				li.dataset.value = StringUtility.removeAccent(tag)
				li.dataset.visible = "true"
				li.appendChild(btn)

				$filter.appendChild(li)
			})
		})
	}
}
