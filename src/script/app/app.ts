import {Recette, RecetteFromJSON} from "../models/Recette.js"
import {Api} from "../api/Api.js"
import {TagHandler} from "../tags/TagHandler.js"
import {DomFactory} from "../templates/DomFactory.js"
import {Observer} from "../filters/Observer.js"
import {MenuSubject} from "../filters/MenuFilterState.js"

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
	 * @return {Promise<Recette[]>}
	 */
	async #handleDataFromJson() {
		const api = new Api("/src/json/recipes.json")
		this._fetchedData = await api.fetchData()
		this._allReceipts = this._fetchedData.map(data => new Recette(data))
		return this._allReceipts
	}

	/**
	 * @requires DomFactory
	 * @return {Promise<void>}
	 */
	async #renderDOMOnLoad() {
		await DomFactory.renderDOM(this._allReceipts)
	}

	/**
	 * @requires TagHandler
	 * @requires Observer
	 * @return {Promise<void>}
	 */

	async #globalObserver() {
		// change to tag context
		await TagHandler.handleDropDownMenuFilter()
		const globalObserver = new Observer(this._allReceipts)
		await globalObserver.observeDomChange()
		const filters: HTMLDivElement[] = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]

		const menuSubject = new MenuSubject()

		filters.forEach(filter => {
			const btn = filter.querySelector("button") as HTMLButtonElement

			btn.addEventListener("click", () => {
				menuSubject.subscribe(filter)
				filters.filter(f => f !== filter).forEach(filter => menuSubject.unsubscribe(filter))
				menuSubject.fire()
			})
		})
	}

	async init() {
		await this.#handleDataFromJson()
		await this.#renderDOMOnLoad()
		await this.#globalObserver()
	}
}
