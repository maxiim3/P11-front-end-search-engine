import {RenderTagsInFilters} from "./RenderTagsInFilters.js"
import {CardTemplate} from "./CardTemplate.js"
import {Recette} from "../models/Recette.js"

/**
 * @class DomFactoryMethods
 * @classdesc static methods for rendering or deleting dom elements (cards | tags)
 */
export class DomFactoryMethods {
	private static container = document.querySelector(".container") as HTMLDivElement
	private static filters = [...document.querySelectorAll(".filtres__filtre ul")] as HTMLUListElement[]

	/**
	 *
	 * @param data: Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async renderTagsFilter(data: Recette[]) {
		const advancedFilter = new RenderTagsInFilters(data)
		return advancedFilter.render()
	}

	/**
	 *
	 * @param data : Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async renderRecettesCards(data: Recette[]) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			DomFactoryMethods.container.appendChild($card)
		})
	}

	/**
	 * @description Removes Cards
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async removeRecettesCards() {
		DomFactoryMethods.container.innerHTML = ""
	}

	/**
	 * @description Removes tags
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async removeTagsFilter() {
		return DomFactoryMethods.filters.forEach(filter => (filter.innerHTML = ""))
	}

	/**
	 * @requires DomFactoryMethods
	 * @requires DomFactoryMethods
	 * @description Removes tags and Cards
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async resetDom() {
		await DomFactoryMethods.removeRecettesCards()
		await DomFactoryMethods.removeTagsFilter()
	}

	/**
	 * @param data : Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async renderDOM(data: Recette[]) {
		await DomFactoryMethods.renderTagsFilter(data)
		await DomFactoryMethods.renderRecettesCards(data)
	}
}
