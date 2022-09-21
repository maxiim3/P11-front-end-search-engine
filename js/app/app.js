import {Api} from "../api/fetchData.js"
import {Recette} from "../models/Recette.js"
import {DomFactory} from "../templates/DomFactory.js"
import {TagHandler} from "../tags/TagHandler.js"
import {Observer} from "../filters/Observers.js"

export class App {
	/**
	 *
	 * @type {JSON[]}
	 */
	#fetchedData
	/**
	 *
	 * @type {Recette[]}
	 */
	#allReceipts

	constructor() {
		this.#fetchedData = []
		this.#allReceipts = []
	}

	/**
	 * @requires Recette
	 * @param fetchedData : JSON[]
	 * @return {Promise<Recette[]>} return Data fetched from JSON
	 */
	async #mapData(fetchedData) {
		return fetchedData.map(data => new Recette(data))
	}

	/**
	 * Fetch data and map JSON to Recette Constructor
	 * @requires Api
	 * @return {Promise<Recette[]>}
	 */
	async #handleDataFromJson() {
		const api = new Api("data/recipes.json")
		this.#fetchedData = await api.fetchData()
		this.#allReceipts = await this.#mapData(this.#fetchedData)
		return this.#allReceipts
	}

	/**
	 * @requires DomFactory
	 * @return {Promise<void>}
	 */
	async #renderDOMOnLoad() {
		await DomFactory.renderDOM(this.#allReceipts)
	}

	/**
	 * @requires TagHandler
	 * @requires Observer
	 * @return {Promise<void>}
	 */
	async #globalObserver() {
		// change to tag context
		await TagHandler.handleDropDownMenuFilter()
		const globalObserver = new Observer(this.#allReceipts)
		await globalObserver.observeDomChange()
	}

	async init() {
		await this.#handleDataFromJson()
		await this.#renderDOMOnLoad()
		await this.#globalObserver()
	}
}
