import {Recette} from "../models/Recette"
import {SecondFilterTemplate} from "./SecondFilterTemplate"
import {CardTemplate} from "./CardTemplate"

export class DomFactory {

	static async renderTagsFilter(data: Recette[]): Promise<void> {
		const advancedFilter = new SecondFilterTemplate(data)
		return advancedFilter.render()
	}

	static async renderRecettesCards(data: Recette[]) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			const container = document.querySelector(".container") as HTMLDivElement
			return container.appendChild($card)
		})
	}

	static async removeRecettesCards() {
		const container = document.querySelector(".container") as HTMLDivElement
		return (container.innerHTML = "")
	}

	static async removeTagsFilter() {
		return [...document.querySelectorAll(".filtres__filtre ul")].forEach(
			filter => (filter.innerHTML = "")
		)
	}

	static async resetDom() {
		await DomFactory.removeRecettesCards()
		await DomFactory.removeTagsFilter()
	}

	static async renderDOM(data: Recette[]) {
		await DomFactory.renderTagsFilter(data)
		await DomFactory.renderRecettesCards(data)
	}
}
