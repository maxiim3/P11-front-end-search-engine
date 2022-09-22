import {FilterMenuTemplate} from "./FilterMenuTemplate.js"
import {CardTemplate} from "./CardTemplate.js"
import {Recette} from "../models/Recette"

/**
 * @class DomFactory
 * @classdesc static methods for rendering or deleting dom elements (cards | tags)
 */
export class DomFactory {
	private static container = document.querySelector(".container") as HTMLDivElement
	private static filters = [...document.querySelectorAll(".filtres__filtre ul")] as HTMLUListElement[]

	/**
	 *
	 * @param data: Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #renderTagsFilter(data: Recette[]) {
		const advancedFilter = new FilterMenuTemplate(data)
		return advancedFilter.render()
	}

	/**
	 *
	 * @param data : Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #renderRecettesCards(data: Recette[]) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			DomFactory.container.appendChild($card)
		})
	}

	/**
	 * @description Removes Cards
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #removeRecettesCards() {
		DomFactory.container.innerHTML = ""
	}

	/**
	 * @description Removes tags
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #removeTagsFilter() {
		return DomFactory.filters.forEach(filter => (filter.innerHTML = ""))
	}

	/**
	 * @requires DomFactory
	 * @requires DomFactory
	 * @description Removes tags and Cards
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async resetDom() {
		await DomFactory.#removeRecettesCards()
		await DomFactory.#removeTagsFilter()
	}

	/**
	 * @param data : Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async renderDOM(data: Recette[]) {
		await DomFactory.#renderTagsFilter(data)
		await DomFactory.#renderRecettesCards(data)
	}
}
