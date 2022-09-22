import {Utility} from "../utils/Utility.js"
import {Recette} from "../models/Recette.js"

export class FilterMenuTemplate {
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
				const ingredientFormatted = Utility.firstLetterToUpperCase(ingredient) as string
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
			const applianceFormatted = Utility.firstLetterToUpperCase(appliance) as string
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
				const ustensileFormatted = Utility.firstLetterToUpperCase(ustensile)
				allUstensiles.push(ustensileFormatted)
			})
		})
		return [...new Set(allUstensiles)]
	}

	/**
	 * @description Append all <HTMLLIElement> tags for each types {ingredients, appliance, ustensiles}
	 * @param arrayOfTags : {ingredients: string[]; appliance: string[]; ustensiles: string[]}
	 * @return {Promise<void>}
	 */
	private async renderItems(arrayOfTags: {ingredients: string[]; appliance: string[]; ustensiles: string[]}) {
		const $categories = [...document.querySelectorAll(".filtres__list")] as HTMLUListElement[]

		$categories.forEach($category => {
			const categoryName = $category.dataset.filterName as "ingredients" | "appliance" | "ustensiles"
			const tags: string[] = [...arrayOfTags[categoryName]]
			tags.forEach(tag => {
				const li = document.createElement("li") as HTMLLIElement
				li.textContent = tag
				li.dataset.active = "false"
				li.dataset.filterType = categoryName
				$category.appendChild(li)
			})

		})
	}

	/**
	 * @public
	 * @async
	 * @return {Promise<void>}
	 */
	async render() {
		if (this.recettes.length !== 0) {
			const ingredients = (await this.getAllIngredients()) as string[]
			const appliance = (await this.getAllAppliance()) as string[]
			const ustensiles = (await this.getAllUstensiles()) as string[]
			await this.renderItems({ingredients, appliance, ustensiles})
		}
	}
}
