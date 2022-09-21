import {FilterMenuTemplate} from "./FilterMenuTemplate.js"
import {CardTemplate} from "./CardTemplate.js"

export class DomFactory {
	/**
	 *
	 * @param data: Recette[]
	 * @static
	 * @private
	 * @return {Promise<void>}
	 * @param {Recette[]} data
	 */
	static async #renderTagsFilter(data) {
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
	static async #renderRecettesCards(data) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			document.querySelector(".container").appendChild($card)
		})
	}

	/**
	 * @description Removes Cards
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #removeRecettesCards() {
		(document.querySelector(".container").innerHTML = "")
	}

	/**
	 * @description Removes tags
	 * @static
	 * @private
	 * @return {Promise<void>}
	 */
	static async #removeTagsFilter() {
		return [...document.querySelectorAll(".filtres__filtre ul")].forEach(
			filter => (filter.innerHTML = "")
		)
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
	static async renderDOM(data) {
		await DomFactory.#renderTagsFilter(data)
		await DomFactory.#renderRecettesCards(data)
	}
}
