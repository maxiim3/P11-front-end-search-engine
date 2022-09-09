class DomFactory {
	static async mapData(data) {
		return await data.map(d => new Recette(d))
	}

	static async renderTagsFilter(data) {
		const advancedFilter = new SecondFilterTemplate(data)
		return advancedFilter.render()
	}

	static async renderRecettesCards(data) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			document.querySelector(".container").appendChild($card)
		})
	}

	static async removeRecettesCards() {
		return (document.querySelector(".container").innerHTML = "")
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

	static async renderDOM(data) {
		const mapData = await DomFactory.mapData(data)
		await DomFactory.renderTagsFilter(mapData)
		await DomFactory.renderRecettesCards(mapData)
	}
}
