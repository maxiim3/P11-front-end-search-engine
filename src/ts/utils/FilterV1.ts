export class FilterV1 {
	static async mainFilter(data: Object[], input: string) {
		let output: [] = []
		const pattern = new RegExp(input, "gi")

		data.forEach((card: Object) => {
			if (pattern.test(card.name) || pattern.test(card.description)) return output.push(card)
			else {
				card.ingredients.forEach(ingredient => {
					if (pattern.test(ingredient.ingredient)) return output.push(card)
				})
			}
		})
		return output
	}

	static async advancedFilter(data: Object[], {textContent, dataset}: HTMLDataListElement) {
		const {tag: type} = dataset
		let output: [] = []
		const pattern = new RegExp(textContent, "gi")
		console.log(textContent)
		data.forEach((card: Object) => {
			switch (type) {
				case "ingredients":
					card.ingredients.forEach(ingredient => {
						if (pattern.test(ingredient.ingredient)) return output.push(card)
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
	}

	static async handleTagFiltered(input: string, type: string): Promise<HTMLLIElement[]> {
		const pattern: RegExp = new RegExp(input, "gi")
		const selection: string = `ul[data-filter-name=${CSS.escape(type)}] li`
		const $tags: HTMLLIElement[] = [...document.querySelectorAll(selection)] as HTMLLIElement[]

		if (input.length === 0) $tags.forEach(tag => (tag.dataset.hidden = "false"))
		else
			$tags.forEach((tag: HTMLLIElement) => {
				const value = tag?.textContent?.toLowerCase()
				if (value && pattern.test(value)) tag.dataset.hidden = "false"
				else tag.dataset.hidden = "true"
			})
		return [...document.querySelectorAll(selection + "[data-hidden=false]")] as HTMLLIElement[]
	}
}
