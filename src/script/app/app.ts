import {Recette, RecetteFromJSON} from "../models/Recette.js"
import {Api} from "../api/Api.js"
import {DomFactoryMethods} from "../templates/DomFactoryMethods.js"
import {QuerySearch} from "../filters/QuerySearch.js"
import {MenuSubject} from "../filters/MenuSubject.js"

export class App {
	private _fetchedData: RecetteFromJSON[]
	private _allReceipts: Recette[]

	constructor() {
		this._fetchedData = []
		this._allReceipts = []
	}

	/**
	 * @requires Recette
	 * @param _fetchedData : RecetteFromJSON[]
	 * @return {Promise<RecetteModelDataType[]>} return Data fetched from JSON
	 */

	/*	private async mapData(_fetchedData) {
			return _fetchedData.map((data)cetteFromJSON => new Recette(data))
		}*/

	/**
	 * Fetch data and map JSON to Recette Constructor
	 * @requires Api
	 * @private
	 * @async
	 * @return {Promise<Recette[]>}
	 */
	private async handleDataFromJson(): Promise<Recette[]> {
		const api = new Api("/src/json/recipes.json")
		this._fetchedData = await api.fetchData()
		this._allReceipts = this._fetchedData.map(data => new Recette(data))
		return this._allReceipts
	}

	/**
	 * @requires DomFactoryMethods
	 * @see DomFactoryMethods
	 * @async
	 * @private
	 * @return {Promise<void>}
	 */
	private async renderDOMOnLoad(): Promise<void> {
		return await DomFactoryMethods.renderDOM(this._allReceipts)
	}

	/**
	 * @requires MenuSubject
	 * @see MenuSubject
	 * @description Handle Menu Context Observers
	 * @private
	 */
	private handleMenuContext() {
		const filters: HTMLDivElement[] = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		const menuSubject = new MenuSubject()
		return filters.forEach(filter => {
			const btn = filter.querySelector("button") as HTMLButtonElement

			btn.addEventListener("click", () => {
				menuSubject.subscribe(filter)
				filters.filter(f => f !== filter).forEach(filter => menuSubject.unsubscribe(filter))
				menuSubject.fire()
			})
		})
	}

	/**
	 * @description Handle Updating the DOM by queries and tags
	 * @async
	 * @private
	 * @requires QuerySearch
	 * @see QuerySearch
	 */
	private async handleDataUpdate() {
		const globalObserver = new QuerySearch(this._allReceipts)
		return await globalObserver.observeDomChange()
	}

	async init() {
		await this.handleDataFromJson()
		await this.renderDOMOnLoad()
		// Handle Updating Recettes
		await this.handleDataUpdate()
		// Handle Filter Menu
		return this.handleMenuContext()
	}
}
