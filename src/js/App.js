import {Recette} from "./models/Recette.js"
import {Api} from "./api/Api.js"
import {DomObserver} from "./views/DomObserver.js"
import {CardTemplate} from "./views/CardTemplate.js"
import {HandleOptionTags} from "./views/HandleOptionTags.js"
import {ContextState} from "./context/ContextState.js"

export class App {
	constructor() {
		this._fetchedData = []
		this._allReceipts = []
	}

	async handleDataFromJson() {
		const api = new Api("/src/json/recipes.json")
		this._fetchedData = await api.fetchData()
		this._allReceipts = this._fetchedData.map(data => new Recette(data))
		return this._allReceipts
	}

	hydrateCardContainer() {
		const container = document.querySelector(".container")
		return this._allReceipts.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			container.appendChild($card)
		})
	}

	async hydrateFilterContainers() {
		const advancedFilter = new HandleOptionTags(this._allReceipts)
		return advancedFilter.render()
	}

	handleMenuContext() {
		const filters = [...document.querySelectorAll(".filtres__filtre")]
		const contextObservers = []
		filters.forEach(filter => contextObservers.push(new ContextState(filter)))
		contextObservers.forEach(obs => {
			const button = obs.filter.querySelector(".filtres__button")
			button.addEventListener("click", onClickOnFilter)
		})

		function onClickOnFilter() {
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

	async handleDOMChange() {
		const domChange = new DomObserver(this._allReceipts)
		return await domChange.observeDomChange()
	}

	async init() {
		await this.handleDataFromJson()
		await this.hydrateCardContainer()
		await this.hydrateFilterContainers()
		await this.handleDOMChange()
		this.handleMenuContext()
		console.log("coucou")
	}
}
