import {DomFactoryMethods} from "../templates/DomFactoryMethods.js"
import {Utility} from "../utils/Utility.js"
import {FiltresV1} from "./FilterV1.js"
import {Recette} from "../models/Recette.js"

export type KeyWordsType = {input: string; tags: HTMLLIElement[]}

export class Observer {
	/**
	 * @type Recette[]
	 */
	/**
	 * @private
	 */
	private readonly _recettes: Recette[]
	/**
	 * @private
	 * @type Recette[]
	 */
	private resultsFromQuerySearch: Recette[]
	/**
	 * @private
	 * @type Recette[]
	 */
	private resultsFromQueryTags: Recette[]
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
		this._recettes = allReceipts
		this.$mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
		this.resultsFromQuerySearch = []
		this.resultsFromQueryTags = []
		this.selectedTags = []
		this.input = ""
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
		if (this.resultsFromQuerySearch.length > 0) return this.resultsFromQuerySearch
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
		if (this.resultsFromQueryTags.length > 0) return this.resultsFromQueryTags
		else await this.dataByQuerySearch()
	}

	/**
	 * Search receipts by query search
	 * @async
	 * @inner
	 * @private
	 * @requires DomFactoryMethods
	 * @requires TagHandler
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	private async observerSearchBar(): Promise<void> {
		this.$mainSearchBar.addEventListener("input", async () => {
			this.input = Utility.removeAccent(this.$mainSearchBar.value) as string
			this.selectedTags = []
			this.resultsFromQuerySearch = []
			this.resultsFromQueryTags = []
			if (this.input.length > 2) {
				const Filter = new FiltresV1(this.recettes, this.keyWords)
				this.resultsFromQuerySearch = await Filter.filterBySearch()
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(this.resultsFromQuerySearch)
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
			this.resultsFromQueryTags = []

			if (tags.length !== 0) {
				tags.forEach(tag => this.selectedTags.push(tag))
				const Filter = new FiltresV1(await this.dataByQuerySearch(), this.keyWords)
				this.resultsFromQueryTags = await Filter.filterByTags()
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(this.resultsFromQueryTags)
			} else {
				await DomFactoryMethods.resetDom()
				await DomFactoryMethods.renderDOM(await this.dataByQuerySearch())
			}
		})
		observer.observe(this.$tagsContainer, this.config)
	}

	async observeDomChange() {
		await this.observerSearchBar()
		await this.observerTagContainer()
		return await this.dataByQueryTags()
	}
}
