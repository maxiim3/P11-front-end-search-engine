import {StringUtility} from "../utils/StringUtility"
import {MappedIngredients, Recette} from "../models/Recette"

export class SecondFilterTemplate {
	private data: Recette[]

	constructor(data: Recette[]) {
		this.data = data
	}

	async getAllIngredients(): Promise<string[]> {
		const arr: string[] = []
		// todo check filter debugger
		this.data.forEach(({getIngredients}: Recette) =>
			getIngredients.forEach(({ingredient}: MappedIngredients) => arr.push(StringUtility.capitalize(ingredient)))
		)
		return [...new Set(arr)]
	}

	async getAllAppliance(): Promise<string[]> {
		const arr: string[] = []
		this.data.forEach(d => {
			arr.push(d.appliance)
		})
		return [...new Set(arr)]
	}

	async getAllUstensiles(): Promise<string[]> {
		const arr: string[] = []
		this.data.forEach(d => {
			d?.ustensiles.forEach(ustensile => {
				arr.push(StringUtility.capitalize(ustensile))
			})
		})
		return [...new Set(arr)]
	}

	async renderItems(filtres: {ingredients: string[]; appliance: string[]; ustensiles: string[]}): Promise<void> {
		const $categories: HTMLDivElement[] = [...document.querySelectorAll(".filtres__list")] as HTMLDivElement[]
		return $categories.forEach($category => {
			// @ts-ignore
			const categoryType: string = $category?.dataset?.filterName
			// @ts-ignore
			const activeCategory: any[] = filtres?.[categoryType]

			activeCategory.forEach(item => {
				const li = document.createElement("li")
				li.textContent = item
				li.dataset.active = "false"
				li.dataset.filterType = $category.dataset.filterName
				$category.appendChild(li)
			})
		})
	}

	async render(): Promise<void> {
		const ingredients: string[] = await this.getAllIngredients()
		const appliance: string[] = await this.getAllAppliance()
		const ustensiles: string[] = await this.getAllUstensiles()
		return await this.renderItems({ingredients, appliance, ustensiles})
	}
}
