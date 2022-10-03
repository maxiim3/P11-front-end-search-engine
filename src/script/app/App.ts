import {Recette, RecetteFromJSON} from "../models/Recette.js"
import {Api} from "../api/Api.js"
import {DomFactoryMethods} from "../templates/DomFactoryMethods.js"
import {QuerySearch} from "../filters/QuerySearch.js"
import {MenuStateObserver} from "../filters/MenuStateObserver.js"

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
		// document.addEventListener("click", ev => console.log(ev))

		const filters: HTMLDivElement[] = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		const contextObservers = [] as MenuStateObserver[]
		filters.forEach(filter => contextObservers.push(new MenuStateObserver(filter)))

		contextObservers.forEach(obs => {
			const button = obs.filter.querySelector(".filtres__button") as HTMLButtonElement
			button.addEventListener("click", onClickOnFilter)
		})

		function onClickOnFilter(this: HTMLButtonElement) {
			const clickedObserver = contextObservers.filter(({filter}) => {
				return filter.querySelector(".filtres__button") === this
			})[0]
			contextObservers.forEach(observer => {
				if (observer === clickedObserver) {
					observer.setState("open")
				} else {
					observer.setState("close")
				}
				// observer.fire()
			})
			// console.table(contextObservers)

			// obs.setState(StateEnums.Open)
			/*contextObservers
				.filter(other => other.filter !== obs.filter)
				.forEach(observer => observer.setState(StateEnums.Close) /!* && observer.fire()*!/)
			contextObservers.forEach(obs => obs.fire())*/
		}

		/*return filters.forEach(filter => {

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
		})*/
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
