// import {RenderTagsInFilters} from "./RenderTagsInFilters.js"
// import {CardTemplate} from "./CardTemplate.js"
// import {Recette} from "../models/Recette.js"
// import {ContextState} from "../context/ContextState.js"
// import {StringUtility} from "../utils/StringUtility.js"

/**
 * @class DOMUtility
 * @classdesc static methods for rendering or deleting dom elements (cards | tags)
 */
export class DOMUtility {
	// private static container = document.querySelector(".container") as HTMLDivElement
	// private static filters = [...document.querySelectorAll(".filtres__filtre ul")] as HTMLUListElement[]
	// /**
	//  *
	//  * @param data: Recette[]
	//  * @static
	//  * @private
	//  * @return {Promise<void>}
	//  */
	// static async renderTagsFilter(data: Recette[]) {
	// 	const advancedFilter = new RenderTagsInFilters(data)
	// 	return advancedFilter.render()
	// }
	// /**
	//  *
	//  * @param data : Recette[]
	//  * @static
	//  * @private
	//  * @return {Promise<void>}
	//  */
	// static async renderRecettesCards(data: Recette[]) {
	// 	return data.forEach(d => {
	// 		const cardTemplate = new CardTemplate(d)
	// 		const $card = cardTemplate.render()
	// 		DOMUtility.container.appendChild($card)
	// 	})
	// }
	/*	/!**
		 * @description Removes Cards
		 * @static
		 * @private
		 * @return {Promise<void>}
		 *!/
	
		static async updateRecettesCards(recettes: Recette[]) {
			recettes.forEach(recette => {
				const selector = CSS.escape(recette.id.toString())
				const $recette: HTMLDivElement = document.querySelector(`.recette[data-id ="${selector}"]`) as HTMLDivElement
				$recette.dataset.visible = "true"
			})
		}*/
	/*
		/!**
		 * @description Removes tags
		 * @static
		 * @private
		 * @return {Promise<void>}
		 *!/
		static async updateTagsInFilter(recettes: Recette[]) {
			// recettes active du DOM, puis filtrer par recetteID puis check tags
	
			for (const filter of DOMUtility.filters) {
				if (filter && filter.dataset.filterName) {
					const filterType: string = filter?.dataset?.filterName
					const allTags: HTMLLIElement[] = [...filter.querySelectorAll("li")] as HTMLLIElement[]
					await DOMUtility.updateTagsRecursive(allTags, recettes, filterType)
				}
			}
		}
	
		static async updateTagsRecursive(tags: HTMLLIElement[], recettes: Recette[], type: string) {
			// if there is minimum one tage in tags array
			if (tags.length !== 0) {
				// targeting first item of tags array : tags[0]
				const firstTag = tags[0] as HTMLLIElement
				const btn = firstTag.querySelector('button') as HTMLButtonElement
				const query = btn.value.toString() as string
				// Tag text Content , will be the input for the filter
				const tagValue = StringUtility.removeAccent(query) as string
				// Tag Type, select the type fo filter
				switch (type) {
					case "ustensiles":
						recettes.forEach(recette => {
							recette.ustensiles.map(ustensile => {
								if (StringUtility.removeAccent(ustensile).includes(tagValue)) {
									firstTag.dataset.filtered = "false"
								} else firstTag.dataset.filtered = "true"
							})
						})
						break
					case "ingredients":
						recettes.forEach(recette => {
							recette.ingredients.map(({ingredient}) => {
								if (StringUtility.removeAccent(ingredient).includes(tagValue)) {
									firstTag.dataset.filtered = "false"
								} else firstTag.dataset.filtered = "true"
							})
						})
	
						break
					case "appliance":
						recettes.forEach(recette => {
							if (StringUtility.removeAccent(recette.appliance).includes(tagValue)) {
								firstTag.dataset.filtered = "false"
							} else firstTag.dataset.filtered = "true"
						})
						break
					default:
						break
				}
				tags.shift()
				await DOMUtility.updateTagsRecursive(tags, recettes, type)
			}
			// if no tags in tags array, and of the loop, return the filtered data
			else {
				return
			}
		}
	*/
	// /**
	//  * @requires DOMUtility
	//  * @requires DOMUtility
	//  * @description Removes tags and Cards
	//  * @static
	//  * @private
	//  * @return {Promise<void>}
	//  */
	// static async updateDOM(recettes: Recette[]) {
	// 	await DOMUtility.updateRecettesCards(recettes)
	// 	await DOMUtility.updateTagsInFilter(recettes)
	// }
	// /**
	//  * @async
	//  * @private
	//  * @return {Promise<void>}
	//  */
	// static async renderDOM(data: Recette[]) {
	// 	// await DOMUtility.renderRecettesCards(data)
	// 	// await DOMUtility.renderTagsFilter(data)
	// }
}
