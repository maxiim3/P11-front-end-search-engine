import {TagHandler} from "../tags/TagHandler.js"
import {DomFactory} from "../templates/DomFactory.js"
import {Utility} from "../utils/Utility.js"
import {FiltresV1} from "./FiltresV1.js"

export class Observer {
	/**
	 * @type Recette[]
	 */
	/**
	 * @private
	 */
	#_recettes
	/**
	 * @private
	 * @type Recette[]
	 */
	#resultsFromQuerySearch
	/**
	 * @private
	 * @type Recette[]
	 */
	#resultsFromQueryTags
	/**
	 * @private
	 * @type string
	 */
	#input = ""
	/**
	 * @private
	 * @type HTMLLIElement[]
	 */
	#selectedTags = []
	/**
	 * @private
	 * @type HTMLInputElement
	 */
	#$mainSearchBar
	/**
	 * @type HTMLDivElement
	 * @private
	 */
	#$tagsContainer

	/**
	 * @param allReceipts : Recette[]
	 */
	constructor(allReceipts) {
		this.#_recettes = allReceipts
		this.#$mainSearchBar = document.querySelector("#searchBar")
		this.#$tagsContainer = document.querySelector("#tagsWrapper")
		this.#resultsFromQuerySearch = []
		this.#resultsFromQueryTags = []
	}

	get #recettes() {
		return this.#_recettes
	}

	get #keyWords() {
		return {input: this.#input, tags: this.#selectedTags}
	}

	get #config() {
		return {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}
	}

	/**
	 * @description Return Results from query search if there are results, otherwise return all receipts
	 * @return {Recette[]|*}
	 */
	#dataByQuerySearch() {
		if (this.#resultsFromQuerySearch.length > 0) return this.#resultsFromQuerySearch
		else return this.#recettes
	}

	/**
	 * @description Return Results from tag queries if there are results, otherwise return results {}
	 * @see #dataByQuerySearch
	 * @async
	 * @inner
	 * @memberOf observeDomChange
	 * @return {Recette[]}
	 */
	#dataByQueryTags() {
		if (this.#resultsFromQueryTags.length > 0) return this.#resultsFromQueryTags
		else this.#dataByQuerySearch()
	}

	/**
	 * Search receipts by query search
	 * @async
	 * @inner
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	async #observerSearchBar() {
		this.#$mainSearchBar.addEventListener("input", async () => {
			this.#input = Utility.removeAccent(this.#$mainSearchBar.value)
			this.#selectedTags = []
			this.#resultsFromQuerySearch = []
			this.#resultsFromQueryTags = []
			if (this.#input.length > 2) {
				const Filter = new FiltresV1(this.#recettes, this.#keyWords)
				this.#resultsFromQuerySearch = await Filter.filterBySearch()
				TagHandler.removeTagQueries()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.#resultsFromQuerySearch)
			}
			else {
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.#recettes)
			}
		})
	}

	/**
	 * Search receipts by tag queries
	 * @async
	 * @inner
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	async #observerTagContainer() {
		const observer = new MutationObserver(async mutationRecords => {
			const tags = [...mutationRecords[0].target.childNodes]
			this.#selectedTags = []
			this.#resultsFromQueryTags = []

			if (tags.length !== 0) {
				tags.forEach(tag => this.#selectedTags.push(tag))
				const Filter = new FiltresV1(this.#dataByQuerySearch(), this.#keyWords)
				this.#resultsFromQueryTags = await Filter.filterByTags()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.#resultsFromQueryTags)
			}
			else {
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.#dataByQuerySearch())
			}
		})
		observer.observe(this.#$tagsContainer, this.#config)
	}

	async observeDomChange() {
		await this.#observerSearchBar()
		await this.#observerTagContainer()
		return this.#dataByQueryTags()
	}
}
