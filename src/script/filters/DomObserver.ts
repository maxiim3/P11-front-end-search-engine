import {StringUtility} from "../utils/StringUtility.js"
import {Recette} from "../models/Recette.js"
import {HandleOptionTags} from "../templates/HandleOptionTags.js"

export class DomObserver {
	/**
	 * @private
	 * @readonly
	 * @description Toutes les Recettes depuis le fichier JSON
	 * @type Recette[]
	 */
	private readonly initialReceipts: Recette[]
	/**
	 * @description Enregistre dans une variable le résultat du filtrage principal des données
	 * @private
	 * @type Recette[]
	 */
	private filteredReceipts: Recette[]
	/**
	 *@description Entrées saisies par l'utilisateur dans la barre de recherche
	 * @private
	 * @type string
	 */
	private userInput: string
	/**
	 * @description Barre de recherche principale
	 * @type HTMLInputElement
	 * @private
	 */
	private $mainSearchBar: HTMLInputElement

	/**
	 * @description Constructeur
	 * @param allReceipts : Recette[]
	 */
	constructor(allReceipts: Recette[]) {
		this.userInput = "" as string
		this.filteredReceipts = [] as Recette[]
		this.initialReceipts = allReceipts as Recette[]
		this.$mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
	}

	/**
	 * @description Vide le conteneur qui reçoit les tags
	 * @private
	 * @return void
	 */
	private emptyTagContainer(): void {
		const $tagsContainer: HTMLDivElement = document.querySelector("#tagsWrapper") as HTMLDivElement
		$tagsContainer.innerHTML = ""
	}

	/**
	 * @description Change le data-visible pour toutes les cartes de recettes
	 * @param value :"true" | "false"
	 * @private
	 */
	private resetAllCardsVisibility(value: "true" | "false"): void {
		const $allRecettesCards = [...document.querySelectorAll(`.recette`)] as HTMLLIElement[]
		$allRecettesCards.forEach(recette => (recette.dataset.visible = value))
	}

	private resetAllOptionsVisibility(value: "true" | "false") {
		const allLIElement: HTMLLIElement[] = [...document.querySelectorAll("#filtres li")] as HTMLLIElement[]
		allLIElement.forEach(li => {
			li.dataset.visible = value
		})
	}

	/**
	 * @description Met à jour l'affichage des recettes avec les données filtrées.
	 * Pour chaque donnée, on récupère l'ID et on va chercher le Node en ciblant sont [data-id].
	 * Puis on règle le [data-visible] pour l'afficher ou non
	 * @async
	 * @return void
	 */
	private async updateCardsVisibility(): Promise<void> {
		// 1. Met toutes les cartes invisibles au début de la recherche
		this.resetAllCardsVisibility("false")

		this.filteredReceipts.forEach(({id}) => {
			const $nodeId = CSS.escape(id.toString())
			const selector = `.recette[data-id ="${$nodeId}"]`
			const $recetteNode: HTMLDivElement = document.querySelector(selector) as HTMLDivElement
			// 2. Puis repasse les cartes filtrées en visible
			$recetteNode.dataset.visible = "true"
		})
	}

	/**
	 * @description Update option-tags in filters with filtered Data from main search. Set the [data-visible] attribute
	 * @private
	 */
	private async updateFilterOptions() {
		this.resetAllOptionsVisibility("false")
		const newInstance = new HandleOptionTags(this.filteredReceipts)
		const promesse = await newInstance.getAllOptionTags()
		const allFilteredTags = [[...promesse.appliance], [...promesse.ingredients], [...promesse.ustensiles]]

		allFilteredTags.forEach(filterType => {
			filterType.forEach(optionTag => {
				const typeToString =
					allFilteredTags.indexOf(filterType) === 0
						? "appliance"
						: allFilteredTags.indexOf(filterType) === 1
						? "ingredients"
						: "ustensiles"
				const parentSelector: string = `.filtres__list[data-filter-name=\"${CSS.escape(typeToString)}\"]`
				const parentNode: HTMLUListElement = document.querySelector(parentSelector) as HTMLUListElement
				const applianceSelector: string = `li[data-value=\"${CSS.escape(
					StringUtility.removeAccent(optionTag)
				)}\"]`
				const optionNode: HTMLLIElement = parentNode.querySelector(applianceSelector) as HTMLLIElement
				optionNode.dataset.visible = "true"
			})
		})
	}

	/**
	 * @description Effectue la recherche en utilisant la programmation fonctionnelle. Le switch va cibler le type donné en input
	 * @param type : string
	 * @private
	 * @async
	 * @return Recette[]
	 */
	private async mainFilterByType(type: MainFilterTypes): Promise<Recette[]> {
		const results = [] as Recette[]
		switch (type) {
			case "name":
				this.initialReceipts.forEach(recette => {
					if (StringUtility.removeAccent(recette.name).includes(this.userInput)) results.push(recette)
				})
				return results
			case "description":
				this.initialReceipts.forEach(recette => {
					if (StringUtility.removeAccent(recette.description).includes(this.userInput)) results.push(recette)
				})
				return results

			case "ingredients":
				this.initialReceipts.forEach(recette => {
					recette.ingredients.map(({ingredient}) => {
						if (StringUtility.removeAccent(ingredient).includes(this.userInput)) results.push(recette)
					})
				})
				return results

			default:
				return results
		}
	}

	/**
	 * @description Filtre Principal : Appelle mainFilterByType() pour chaque type [name, description, ingredients]. Permet d'interrompre la recherche si un résultat est trouvé
	 * @see mainFilterByType
	 * @private
	 * @async
	 * @return Recette[]
	 */
	private async handleMainFilter(): Promise<Recette[]> {
		const filterByName: Recette[] = await this.mainFilterByType("name")
		if (filterByName.length > 0) return filterByName
		else {
			const filterByDescription: Recette[] = await this.mainFilterByType("description")
			if (filterByDescription.length > 0) return filterByDescription
			else {
				const filterIngredients: Recette[] = await this.mainFilterByType("ingredients")
				if (filterIngredients.length > 0) return filterIngredients
				else return [] as Recette[]
			}
		}
	}

	/**
	 * @description Fonction appelée par l'Event Listener pour filtrer les data lorsque l'utilisateur effectue une recherche
	 * @see observeDomChange
	 * @async
	 * @private
	 * @requires DOMUtility
	 * @requires StringUtility
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	private async userInputEvent(): Promise<void> {
		this.userInput = StringUtility.removeAccent(this.$mainSearchBar.value) as string
		this.filteredReceipts = []
		this.emptyTagContainer()
		if (this.userInput.length > 2) {
			// USER INPUT : plus de deux caractères
			this.filteredReceipts = await this.handleMainFilter()
			this.$mainSearchBar.dataset.hasResults = this.filteredReceipts.length > 0 ? "true" : "false" // User Visual Feedback
			console.log(this.filteredReceipts )
			await this.updateCardsVisibility()
			await this.updateFilterOptions()
		} else {
			// USER INPUT : moins de deux caractères
			this.resetAllCardsVisibility("true")
			this.resetAllOptionsVisibility("true")
			this.$mainSearchBar.dataset.hasResults = "empty" // User Visual Feedback
		}
	}

	/**
	 * @description Event Listener sur les saisies utilisateurs. Retourne les data filtrées
	 * @async
	 * @see userInputEvent
	 * @return Recette[]
	 */
	async observeDomChange(): Promise<Recette[]> {
		this.$mainSearchBar.oninput = async () => await this.userInputEvent()

		const $tagsContainer: HTMLDivElement = document.querySelector("#tagsWrapper") as HTMLDivElement
		const observer: MutationObserver = new MutationObserver(
			async mutations => await this.observerTagContainer(mutations)
		)
		observer.observe($tagsContainer, {childList: true})
		return this.filteredReceipts
	}

	/**
	 * Search receipts by tag queries
	 * @async
	 * @private
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	private async observerTagContainer(mutations: MutationRecord[]): Promise<void> {
		const event: MutationRecord = mutations[0]
		const appendTag: NodeList = event.addedNodes
		const removeTag: NodeList = event.removedNodes
		if (appendTag.length > 0) {
			const {dataset, innerText}: HTMLLIElement = appendTag[0] as HTMLLIElement
			const value: string = StringUtility.removeAccent(innerText)
			if (dataset.tag) {
				const type: TagFilterType = dataset.tag as TagFilterType
				const secondFilter = await this.handleFilterByTag(value, type)
				console.log(secondFilter)
				navigator.clipboard.writeText(value).then()
				//
				// await this.updateCardsVisibility()
				// await this.updateFilterOptions()
			}
		} else if (removeTag.length > 0) {
		} else return
	}

	private async handleFilterByTag(value: string, type: TagFilterType) {
		const results = [] as Recette[]
		const data = this.filteredReceipts.length > 0 ? this.filteredReceipts : this.initialReceipts
		switch (type) {
			case "appliance":
				data.forEach(recette => {
					if (StringUtility.removeAccent(recette.appliance).includes(value)) results.push(recette)
				})
				return results
			case "ustensiles":
				data.forEach(recette => {
					recette.ustensiles.map(ustensile => {
						if (StringUtility.removeAccent(ustensile).includes(value)) results.push(recette)
					})
				})
				return results
			case "ingredients":
				data.forEach(recette => {
					recette.ingredients.map(({ingredient}) => {
						if (StringUtility.removeAccent(ingredient).includes(value)) results.push(recette)
					})
				})
				return results

			default:
				return results
		}
	}
}

type MainFilterTypes = "name" | "description" | "ingredients"
type TagFilterType = "appliance" | "ustensiles" | "ingredients"
