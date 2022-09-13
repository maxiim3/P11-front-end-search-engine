import {StringUtility} from "../utils/StringUtility"
import {Recette} from "../models/Recette"

export class SecondFilterTemplate {
	private data: Recette[]

	constructor(data: Recette[]) {
		this.data = data
	}

	async getAllIngredients(): Promise<Object[]> {
		const arr: Object[] = []
		this.data.forEach(d => {
			// todo check filter debugger
			d?.ingredients?.forEach(({ingredient}) => {
				arr.push(StringUtility.capitalize(ingredient))
			})
		})
		return [...new Set(arr)]
	}

	async getAllAppliance() {
		const arr: Object[] = []
		this.data.forEach(d => {
			arr.push(d.appliance)
		})
		return [...new Set(arr)]
	}

	async getAllUstensiles(): Promise<Object[]> {
		const arr: any[] = []
		this.data.forEach(d => {
			d?.ustensiles.forEach(ustensile => {
				arr.push(StringUtility.capitalize(ustensile))
			})
		})
		return [...new Set(arr)]
	}

	async renderItems(filtres: {
		ingredients: Object[]
		appliance: Object[]
		ustensiles: Object[]
	}): Promise<void> {
		const $categories: HTMLDivElement[] = [
			...document.querySelectorAll(".filtres__list"),
		] as HTMLDivElement[]
		return $categories.forEach($category => {
			const categoryType: string = $category?.dataset?.filterName
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
		const ingredients: any[] = await this.getAllIngredients()
		const appliance: any[] = await this.getAllAppliance()
		const ustensiles: any[] = await this.getAllUstensiles()
		return await this.renderItems({ingredients, appliance, ustensiles})
	}
}
