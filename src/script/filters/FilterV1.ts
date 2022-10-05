import {StringUtility} from "../utils/StringUtility.js"
import {Recette} from "../models/Recette.js"
// import {KeyWordsType} from "./DomChange"

export type TypeOfTags = "ingredients" | "ustensiles" | "name" | "description" | "appliance"

export class FilterV1 {
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
	 * @private
	 */
	// private readonly tags: HTMLLIElement[]
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
	constructor(data: Recette[], {input, /*tags*/}: KeyWordsType) {
		this.recettes = data
		this.input = input
		// this.tags = tags
		this.filteredByTags = []
	}

	/**
	 * @private
	 * @param type : string
	 * @param input : string
	 * @param recettes : Recette[]
	 * @return {Promise<*[]|Recette[]>}
	 */
	// private async filterBy(type: TypeOfTags, input: string, recettes: Recette[]): Promise<any[] | Recette[]> {
	// 	const result = [] as Recette[]
	// 	switch (type) {
	// 		case "ingredients":
	// 			recettes.forEach(recette => {
	// 				recette.ingredients.map(
	// 					({ingredient}) => StringUtility.removeAccent(ingredient).includes(input) && result.push(recette)
	// 				)
	// 			})
	// 			return result
	// 		case "ustensiles":
	// 			recettes.forEach(recette =>
	// 				recette.ustensiles.map(
	// 					ustensile => StringUtility.removeAccent(ustensile).includes(input) && result.push(recette)
	// 				)
	// 			)
	// 			return result
	// 		default:
	// 			return recettes.filter(recette => StringUtility.removeAccent(recette[type]).includes(input))
	// 	}
	// }
	// private async filterBy(type: TypeOfTags, input: string, recettes: Recette[]): Promise<any[] | Recette[]> {
	// 	const result = [] as Recette[]
	// 	switch (type) {
	// 		case "ingredients":
	// 			recettes.forEach(recette => {
	// 				const $recette: HTMLDivElement = document.getElementById(recette.id.toString()) as HTMLDivElement
	// 				recette.ingredients.map(({ingredient}) => {
	// 					if (StringUtility.removeAccent(ingredient).includes(input)) {
	// 						result.push(recette)
	// 					}
	// 				})
	// 			})
	// 			break
	// 		case "ustensiles":
	// 			recettes.forEach(recette => {
	// 				const $recette: HTMLDivElement = document.getElementById(recette.id.toString()) as HTMLDivElement
	// 				recette.ustensiles.map(ustensile => {
	// 					if (StringUtility.removeAccent(ustensile).includes(input)) {
	// 						result.push(recette)
	// 					}
	// 				})
	// 			})
	// 			break
	// 		default:
	// 			recettes.filter(recette => {
	// 				const $recette: HTMLDivElement = document.getElementById(recette.id.toString()) as HTMLDivElement
	// 				if (StringUtility.removeAccent(recette[type]).includes(input)) {
	// 					result.push(recette)
	// 				}
	// 			})
	// 			break
	// 	}
	// 	return result
	// }

	// /**
	//  *
	//  * @param tags : HTMLLIElement[]
	//  * @param dataAccumulator : Recette[]
	//  * @return {Promise<Recette[]>}
	//  */
	// async recursiveFiltering(tags: HTMLLIElement[], dataAccumulator: Recette[]) {
	// 	// if there is minimum one tage in tags array
	// 	if (tags.length !== 0) {
	// 		// targeting first item of tags array : tags[0]
	// 		const firstTag = tags[0] as HTMLLIElement
	// 		const query = firstTag.innerText.toString() as string
	// 		const tagTypeDataset = firstTag.getAttribute("data-tag") as string
	// 		// Tag text Content , will be the input for the filter
	// 		const tagValue = StringUtility.removeAccent(query) as string
	// 		// Tag Type, select the type fo filter
	// 		const tagType = StringUtility.removeAccent(tagTypeDataset) as TypeOfTags
	// 		// set data to initial data or accumulated data
	// 		const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.recettes]
	// 		// get result from filter
	// 		const filterResult = await this.filterBy(tagType, tagValue, data)
	// 		// remove the first item of the tags array
	// 		tags.shift()
	// 		// call back the recursive function with updated tags array and filtered data
	// 		await this.recursiveFiltering(tags, filterResult)
	// 	}
	// 	// if no tags in tags array, and of the loop, return the filtered data
	// 	else {
	// 		this.filteredByTags = [...dataAccumulator]
	// 	}
	// }


	async filterByTags() {
		// const allTags: HTMLLIElement[] = [...this.tags]
		// const output: Recette[] = []
		// await this.recursiveFiltering(allTags, output)
		return this.filteredByTags
	}
}
