import {DomFactoryMethods} from "../templates/DomFactoryMethods.js"
import {Utility} from "../utils/Utility.js"
import {FilterV1} from "../utils/FilterV1.js"
import {Recette} from "../models/Recette.js"

export type KeyWordsType = {input: string; tags: HTMLLIElement[]}

export class QuerySearch {
	/**
	 * @private
	 * @readonly
	 * @description Toutes les Recettes depuis le fichier JSON
	 * @type Recette[]
	 */
	private readonly _recettes: Recette[]
	/**
	 * @private
	 * @description Le résultat des recettes filtrées par les saisies dans la barre de recherche principale
	 * @type Recette[]
	 */
	protected recettesFilteredByQueries: Recette[]
	/**
	 * @private
	 * @description Le résultat des recettes filtrées par les saisies dans la barre de recherche principale ET OU de la recherches par "tags"
	 * @type Recette[]
	 */
	protected recettesFilteredByTags: Recette[]
	/**
	 * @private
	 * @type string
	 */
	private input: string
	/**
	 * @private
	 * @type HTMLLIElement[]
	 */
	private selectedTags: HTMLLIElement[]
	/**
	 * @private
	 * @type HTMLInputElement
	 */
	private $mainSearchBar: HTMLInputElement
	/**
	 * @type HTMLDivElement
	 * @private
	 */
	private readonly $tagsContainer: HTMLDivElement

	/**
	 * @param allReceipts : Recette[]
	 */
	constructor(allReceipts: Recette[]) {
		this._recettes = allReceipts as Recette[]
		this.$mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
		this.recettesFilteredByQueries = [] as Recette[]
		this.recettesFilteredByTags = [] as Recette[]
		this.selectedTags = [] as HTMLLIElement[]
		this.input = "" as string
	}

	private get recettes() {
		return this._recettes
	}

	private get keyWords(): KeyWordsType {
		return {input: this.input, tags: this.selectedTags}
	}

	private get config() {
		return {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}
	}

	/**
	 * @description Return Results from query search if there are results, otherwise return all receipts
	 * @private
	 * @async
	 * @return {Recette[]|*}
	 */
	private async dataByQuerySearch(): Promise<Recette[]> {
		if (this.recettesFilteredByQueries.length > 0) return this.recettesFilteredByQueries
		else return this.recettes
	}

	/**
	 * @description Return Results from tag queries if there are results, otherwise return results {}
	 * @see dataByQuerySearch
	 * @async
	 * @private
	 * @inner
	 * @memberOf observeDomChange
	 * @return Recette[]
	 */
	private async dataByQueryTags(): Promise<Recette[] | void> {
		if (this.recettesFilteredByTags.length > 0) return this.recettesFilteredByTags
		else await this.dataByQuerySearch()
	}

	/**
	 * Search receipts by query search
	 * @async
	 * @inner
	 * @private
	 * @requires DomFactoryMethods
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	private async observerSearchBar(): Promise<void> {
		this.$mainSearchBar.addEventListener("input", async () => {
			this.input = Utility.removeAccent(this.$mainSearchBar.value) as string
			this.selectedTags = []
			this.recettesFilteredByQueries = []
			this.recettesFilteredByTags = []
			this.$tagsContainer.innerHTML = ""
			if (this.input.length > 2) {
				const Filter = new FilterV1(this.recettes, this.keyWords)
				this.recettesFilteredByQueries = await Filter.filterBySearch()
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(this.recettesFilteredByQueries)
			} else {
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(this.recettes)
			}
		})
	}

	/**
	 * Search receipts by tag queries
	 * @async
	 * @inner
	 * @private
	 * @requires DomFactoryMethods
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	private async observerTagContainer(): Promise<void> {
		const observer = new MutationObserver(async mutationRecords => {
			const tags = [...mutationRecords[0].target.childNodes] as HTMLLIElement[]
			this.selectedTags = []
			this.recettesFilteredByTags = []

			if (tags.length !== 0) {
				tags.forEach(tag => this.selectedTags.push(tag))
				const Filter = new FilterV1(await this.dataByQuerySearch(), this.keyWords)
				this.recettesFilteredByTags = await Filter.filterByTags()
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(this.recettesFilteredByTags)
			} else {
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(await this.dataByQuerySearch())
			}
		})
		observer.observe(this.$tagsContainer, this.config)
	}

	async observeDomChange() {
		await this.observerSearchBar()
		// await this.observerTagContainer() // todo le pb vient de la
		return await this.dataByQueryTags()
	}
}
