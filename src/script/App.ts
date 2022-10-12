import {Recette, RecetteFromJSON} from "./models/Recette.js"
import {Api} from "./api/Api.js"
import {DomObserver} from "./views/DomObserver.js"
import {CardTemplate} from "./views/CardTemplate.js"
import {HandleOptionTags} from "./views/HandleOptionTags.js"
import {ContextState} from "./context/ContextState.js"

export class App {
	private _fetchedData: RecetteFromJSON[]
	private _allReceipts: Recette[]

	constructor() {
		this._fetchedData = []
		this._allReceipts = []
	}

	/**
	 * Fetch api and map JSON to Recette Constructor
	 * @requires Api
	 * @private
	 * @async
	 * @return {Promise<Recette[]>}
	 */
	private async handleDataFromJson(): Promise<Recette[]> {
		const api = new Api("https://project.maxime-tamburrini.com/oc_projet_7/api/recipes.json")
		try {
			this._fetchedData = await api.fetchData()
			this._allReceipts = this._fetchedData.map(data => new Recette(data))
			return this._allReceipts
		} catch (e) {
			console.error(`404..${e}`)
			return [] as Recette[]
		}
	}

	/**
	 *
	 * @private
	 * @return {Promise<void>}
	 */
	private async hydrateCardContainer() {
		const container: HTMLDivElement = document.querySelector(".container") as HTMLDivElement
		return this._allReceipts.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			container.appendChild($card)
		})
	}

	/**
	 * @private
	 * @return {Promise<void>}
	 */
	private async hydrateFilterContainers() {
		const advancedFilter = new HandleOptionTags(this._allReceipts)
		return advancedFilter.render()
	}

	/**
	 * @requires ContextState
	 * @see ContextState
	 * @description Handle Menu context Observers
	 * @private
	 */
	private async handleMenuContext() {
		const filters: HTMLDivElement[] = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		const contextObservers = [] as ContextState[]
		filters.forEach(filter => contextObservers.push(new ContextState(filter)))

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
			})
		}
	}

	/**
	 * @description Handle Updating the DOM by queries and tags
	 * @async
	 * @private
	 * @requires DomObserver
	 * @see DomObserver
	 */
	private async handleDOMChange() {
		const domChange = new DomObserver(this._allReceipts)
		await domChange.observeDomChange()
	}

	async init() {
		// fetch and map api to dataModel constructor
		await this.handleDataFromJson()

		// render api on DOM [filters, cards]
		await this.hydrateCardContainer()
		await this.hydrateFilterContainers()

		// Handle Updating Recettes [filters tags, cards]
		await this.handleDOMChange()

		await this.handleMenuContext()
	}
}
