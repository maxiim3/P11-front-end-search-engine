import {StringUtility} from "../utils/StringUtility.js"
import {Recette} from "../models/Recette.js"
import {KeyWordsType} from "./DomObserver"

export type TypeOfTags = "ingredients" | "ustensiles" | "name" | "description" | "appliance"

export class FilterV2 {
	/**
	 * @type Recette[]
	 * @private
	 */
	private readonly recettes: Recette[]
	/**
	 * @type string
	 * @private
	 */
	private readonly input: string
	/**
	 * @type HTMLLIElement[]
	 * @protected
	 */
	protected readonly tags: HTMLLIElement[]
	/**
	 *
	 * @type Recette[]
	 * @private
	 */
	private filteredByTags: Recette[]

	/**
	 *
	 * @param data : Recette[]
	 * @param input : string
	 * @param tags : HTMLLIElement[]
	 */
	constructor(data: Recette[], {input, tags}: KeyWordsType) {
		this.recettes = data
		this.input = input
		this.tags = tags
		this.filteredByTags = []
	}

	/**
	 * @private
	 * @param type : string
	 * @param input : string
	 * @param recettes : Recette[]
	 * @return {Promise<Recette[]>}
	 */
	private async filterBy(type: TypeOfTags, input: string, recettes: Recette[]): Promise<Recette[]> {
		const result = [] as Recette[]
		if (type === "ingredients") {
			for (let i = 0; i < recettes.length; i++) {
				for (const {ingredient} of recettes[i].ingredients) {
					if (StringUtility.removeAccent(ingredient).includes(input)) result.push(recettes[i])
				}
			}
		} else if (type === "ustensiles") {
			for (let i = 0; i < recettes.length; i++) {
				for (const ustensile of recettes[i].ustensiles) {
					if (StringUtility.removeAccent(ustensile).includes(input)) result.push(recettes[i])
				}
			}
		} else {
			for (let i = 0; i < recettes.length; i++) {
				if (StringUtility.removeAccent(recettes[i][type]).includes(input)) result.push(recettes[i])
			}
		}
		return result
	}

	/**
	 *
	 * @param tags : HTMLLIElement[]
	 * @param dataAccumulator : Recette[]
	 * @return {Promise<Recette[]>}
	 */
	async #recursiveFiltering(tags: HTMLLIElement[], dataAccumulator: Recette[]) {
		// if there is minimum one tage in tags array
		if (tags.length !== 0) {
			// targeting first item of tags array : tags[0]
			const firstTag = tags[0] as HTMLLIElement
			const query = firstTag.innerText.toString() as string
			const tagTypeDataset = firstTag.getAttribute("data-tag") as string
			// Tag text Content , will be the input for the filter
			const tagValue = StringUtility.removeAccent(query) as string
			// Tag Type, select the type fo filter
			const tagType = StringUtility.removeAccent(tagTypeDataset) as TypeOfTags
			// set data to initial data or accumulated data
			const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.recettes]
			// get result from filter
			const filterResult = await this.filterBy(tagType, tagValue, data)
			// remove the first item of the tags array
			tags.shift()
			// call back the recursive function with updated tags array and filtered data
			await this.#recursiveFiltering(tags, filterResult)
		}
		// if no tags in tags array, and of the loop, return the filtered data
		else {
			this.filteredByTags = [...dataAccumulator]
		}
	}

	async filterBySearch() {
		const filterByName = await this.filterBy("name", this.input, this.recettes)
		if (filterByName.length !== 0) return filterByName
		else {
			const filterByDescription = await this.filterBy("description", this.input, this.recettes)
			if (filterByDescription.length !== 0) return filterByDescription
			else {
				const filterByIngredients = await this.filterBy("ingredients", this.input, this.recettes)
				if (filterByIngredients.length !== 0) return filterByIngredients
				else return []
			}
		}
	}

	async filterByTags() {
		const allTags = [...this.tags]
		const output = [] as Recette[]
		await this.#recursiveFiltering(allTags, output)
		return this.filteredByTags
	}
}
