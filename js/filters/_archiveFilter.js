/*
class FilterV2 {
	static async filter(data, input) {
		let output = []
		const pattern = new RegExp(input, "gi")

		for (let i = 0; i < data.length; i++) {
			const {$title, $desc, ingredients} = data[i]

			if (testPattern($title) || testPattern($desc)) output.push(data[i])
			else {
				for (let j = 0; j < ingredients.length; j++) {
					if (testPattern(ingredients[j].ingredient)) output.push(data[i])
				}
			}
		}

		function testPattern(key) {
			return pattern.test(key.textContent)
		}

		return output
	}
}
*/

/*
class FilterV3 {
	static async filter(input) {
		const pattern = new RegExp(input, "gi")
		const recettesCards = [...document.querySelectorAll(".container .recette")]

		recettesCards.forEach(card => {
			const cardId = `.recette[data-id=${CSS.escape(card.dataset.id)}]`
			const $target = document.querySelector(cardId)
			const {$title, $desc, ingredients} = checkers(card, cardId)

			if (testPattern($title) || testPattern($desc))
				$target.dataset.hidden = "false"
			else
				ingredients.forEach($ingredient => {
					if (testPattern($ingredient)) $target.dataset.hidden = "false"
					else $target.dataset.hidden = "true"
				})
		})

		function testPattern(key) {
			return pattern.test(key.textContent)
		}

		function checkers(card, cardId) {
			const $title = card.querySelector("h3")
			const $desc = card.querySelector(".recette__description")
			const ingredients = [...document.querySelectorAll(cardId + ".key")]
			return {$title, $desc, ingredients}
		}
	}
}
*/
/*
class FilterByTags {
	constructor(tag, data) {
		this.tag = tag
		this.data = data
		this.updatedData = []
	}

	async resetDom(data) {
		await DomFactory.resetDom()
		await DomFactory.renderDOM(data)
	}

	async filtering(data, tag) {
		return FilterV1.mainFilter(data, tag)
	}

	async allTags() {
		let data = this.updatedData[0] ? this.updatedData : this.data
		this.updatedData = await this.filtering(data, this.tag)

		return this.updatedData[0] ? this.updatedData : this.data
	}

	async update() {
		const newData = await this.allTags()
		console.log(this.updatedData)
	}
}
*/
/*
class MainFilter {
	constructor(data) {
		this.data = data
		this.$mainSearchBar = document.querySelector("#searchBar")
	}

	async resetDom(data) {
		await DomFactory.resetDom()
		await DomFactory.renderDOM(data)
	}

	async filtering(data, input) {
		return FilterV1.mainFilter(data, input)
	}

	async update() {
		const input = this.$mainSearchBar.value
		if (input.length < 3) {
			this.$mainSearchBar.dataset.hasResults = ""
			return await this.resetDom(this.data)
		}

		const updatedData = await this.filtering(this.data, input)

		if (updatedData.length === 0) this.$mainSearchBar.dataset.hasResults = "false"
		else this.$mainSearchBar.dataset.hasResults = "true"

		await this.resetDom(updatedData)
		return updatedData
	}
}
*/
/*	static async mainFilter(data, input) {
		let output = []
		const pattern = new RegExp(input, "gi")

		data.forEach(card => {
			if (pattern.test(card.name) || pattern.test(card.description))
				return output.push(card)
			else {
				card.ingredients.forEach(ingredient => {
					if (pattern.test(ingredient.ingredient)) return output.push(card)
				})
			}
		})
		return output
	}*/
/*
	static async advancedFilter(data, tag) {
		const {textContent: value, dataset} = tag
		const {tag: type} = dataset
		let output = []
		const pattern = new RegExp(value, "gi")
		console.log(value)
		data.forEach(card => {
			switch (type) {
				case "ingredients":
					card.ingredients.forEach(ingredient => {
						if (pattern.test(ingredient.ingredient))
							return output.push(card)
					})
					break
				case "appliance":
					if (pattern.test(card.appliance)) return output.push(card)

					break
				case "ustensiles":
					card.ustensiles.forEach(ustensile => {
						if (pattern.test(ustensile)) return output.push(card)
					})
					break
			}
		})
		return output
	}*/