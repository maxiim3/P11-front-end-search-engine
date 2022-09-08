class FilterV1 {
	static async mainFilter(data, input) {
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
	}

	static async filterByTag(data, input, type) {
		let output = []
		const pattern = new RegExp(input, "gi")
		console.log(type)
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
					if (pattern.test(card.ustensiles)) return output.push(card)
			}
		})
		return output
	}

	static async handleTagFiltered(data, input, type) {
		const pattern = new RegExp(input, "gi")
		const selection = `ul[data-filter-name=${CSS.escape(type)}] li`
		const $tags = [...document.querySelectorAll(selection)]

		if (input.length === 0)
			return $tags.forEach(tag => (tag.dataset.hidden = "false"))

		return $tags.forEach(tag => {
			const value = tag.textContent.toLowerCase()
			if (pattern.test(value)) tag.dataset.hidden = "false"
			else tag.dataset.hidden = "true"
		})
	}
}
