class Filtres {
	/**
	 *
	 * @param data : Recette[]
	 * @param input : string
	 * @param tags : HTMLLIElement[]
	 */
	constructor(data, {input, tags}) {
		this.data = data
		this.input = input
		this.tags = tags
		this.filteredByTags = []
	}

	/**
	 *
	 * @param type : string
	 * @param input : string
	 * @param recettes : Recette[]
	 * @return {Promise<*[]|Recette[]>}
	 */
	filterBy = async (type, input, recettes) => {
		const result = []
		switch (type) {
			case "ingredients":
				recettes.forEach(recette => {
					recette.getIngredients.map(
						({ingredient}) =>
							Utility.removeAccent(ingredient).includes(input) && result.push(recette)
					)
				})
				return result
			case "ustensiles":
				recettes.forEach(recette =>
					recette.ustensiles.map(
						ustensile => Utility.removeAccent(ustensile).includes(input) && result.push(recette)
					)
				)
				return result
			default:
				return recettes.filter(recette => Utility.removeAccent(recette[type]).includes(input))
		}
	}

	filterBySearch = async () => {
		const filterByName = await this.filterBy("name", this.input, this.data)
		if (filterByName.length !== 0) return filterByName
		else {
			const filterByDescription = await this.filterBy("description", this.input, this.data)
			if (filterByDescription.length !== 0) return filterByDescription
			else {
				const filterByIngredients = await this.filterBy("ingredients", this.input, this.data)
				if (filterByIngredients.length !== 0) return filterByIngredients
				else return []
			}
		}
	}

	filterByTags = async () => {
		const allTags = [...this.tags]
		const output = []
		await this.recursiveFiltering(allTags, output)
		return this.filteredByTags
	}

	/**
	 *
	 * @param tags : HTMLLIElement[]
	 * @param dataAccumulator : Recette[]
	 * @return {Promise<void>}
	 */
	async recursiveFiltering(tags, dataAccumulator) {
		// if there is minimum one tage in tags array
		if (tags.length !== 0) {
			// targeting first item of tags array : tags[0]
			const firstTag = tags[0]
			// Tag text Content , will be the input for the filter
			const tagValue = Utility.removeAccent(firstTag.textContent.toString())
			// Tag Type, select the type fo filter
			const tagType = Utility.removeAccent(firstTag.dataset.tag.toString())
			// set data to initial data or accumulated data
			const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.data]
			// get result from filter
			const filterResult = await this.filterBy(tagType, tagValue, data)
			// remove the first item of the tags array
			tags.shift()
			// call back the recursive function with updated tags array and filtered data
			await this.recursiveFiltering(tags, filterResult)
		}
		// if no tags in tags array, and of the loop, return the filtered data
		else {
			this.filteredByTags = [...dataAccumulator]
		}
	}
}
