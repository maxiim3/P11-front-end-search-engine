import {Utility} from "../utils/Utility.js"
// todo filter not working
export class FiltresV2 {
	/**
	 * @type Recette[]
	 * @private
	 */
	#data
	/**
	 * @type string
	 * @private
	 */
	#input
	/**
	 * @type HTMLLIElement[]
	 * @private
	 */
	#tags
	/**
	 *
	 * @type Recette[]
	 * @private
	 */
	#filteredByTags

	/**
	 *
	 * @param data : Recette[]
	 * @param input : string
	 * @param tags : HTMLLIElement[]
	 */
	constructor(data, {input, tags}) {
		this.#data = data
		this.#input = input
		this.#tags = tags
		// initialize filterByTags
		this.#filteredByTags = []
	}

	/**
	 *
	 * @param type : string
	 * @param input : string
	 * @param recettes : Recette[]
	 * @return {Promise<*[]|Recette[]>}
	 */
	async #filterBy(type, input, recettes) {
		const result = []
		switch (type) {
			case "ingredients":
				for (const recette of recettes) {
					recette.getIngredients.map(
						({ingredient}) =>
							Utility.removeAccent(ingredient).includes(input) && result.push(recette)
					)
				}
				return result
			case "ustensiles":
				for (const recette of recettes) {
					recette.ustensiles.map(
						ustensile => Utility.removeAccent(ustensile).includes(input) && result.push(recette)
					)
				}
				return result
			default:
				return recettes.filter(recette => Utility.removeAccent(recette[type]).includes(input))
		}
	}

	/**
	 *
	 * @param tags : HTMLLIElement[]
	 * @param dataAccumulator : Recette[]
	 * @return {Promise<Recette[]>}
	 */
	async #recursiveFiltering(tags, dataAccumulator) {
		// if no tags in tags array, and of the loop, return the filtered data
		if (tags.length === 0) return (this.#filteredByTags = [...dataAccumulator])

		// if there is minimum one tage in tags array
		// targeting first item of tags array : tags[0]
		const firstTag = tags[0]
		// Tag text Content , will be the input for the filter
		const tagValue = Utility.removeAccent(firstTag.textContent.toString())
		// Tag Type, select the type fo filter
		const tagType = Utility.removeAccent(firstTag.dataset.tag.toString())
		// set data to initial data or accumulated data
		const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.#data]
		// get result from filter
		const filterResult = await this.#filterBy(tagType, tagValue, data)
		// remove the first item of the tags array
		tags.shift()
		// call back the recursive function with updated tags array and filtered data
		await this.#recursiveFiltering(tags, filterResult)
	}

	async filterBySearch() {
		const filterByName = await this.#filterBy("name", this.#input, this.#data)
		if (filterByName.length !== 0) return filterByName
		else {
			const filterByDescription = await this.#filterBy("description", this.#input, this.#data)
			if (filterByDescription.length !== 0) return filterByDescription
			else {
				const filterByIngredients = await this.#filterBy("ingredients", this.#input, this.#data)
				if (filterByIngredients.length !== 0) return filterByIngredients
				else return []
			}
		}
	}

	async filterByTags() {
		const allTags = [...this.#tags]
		const output = []
		await this.#recursiveFiltering(allTags, output)
		return this.#filteredByTags
	}
}
