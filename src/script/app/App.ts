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
				const target= menuSubject.contextObserver.filter(obs => obs.filter === filter)[0]
				menuSubject.subscribe(target.filter)
				menuSubject.contextObserver
					.filter(obs => obs.filter !== filter)
					.forEach((observer) => {
						menuSubject.unsubscribe(observer.filter)
					})
				menuSubject.contextObserver.forEach(obs => {
					console.log(obs.currentState)})
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
		// fetch and map data to dataModel constructor
		await this.handleDataFromJson()
		// render data on DOM [filters, cards]
		await this.renderDOMOnLoad()
		// Handle Updating Recettes [filters tags, cards]
		await this.handleDataUpdate()
		// Handle Filter Menu
		return this.handleMenuContext()
	}
}
