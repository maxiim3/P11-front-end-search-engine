import {StringUtility} from "../utils/StringUtility.js"
import {HandleOptionTags} from "./HandleOptionTags.js"
import {ContextState} from "../context/ContextState.js"
import {Recette} from "../models/Recette.js"

export class DomObserver {
	/**
	 * @description Toutes les Recettes depuis le fichier JSON
	 * @type Recette[]
	 */
	initialReceipts
	/**
	 * @description Enregistre dans une variable le résultat du filtrage principal des données
	 * @type Recette[]
	 */
	filteredReceipts
	/**
	 *@description Entrées saisies par l'utilisateur dans la barre de recherche
	 * @type string
	 */
	userInput
	/**
	 * @description Barre de recherche principale
	 * @type HTMLInputElement
	 */
	$mainSearchBar

	/**
	 * @description Set if user feedback message : "No result from search " - is displayed
	 * @return boolean
	 */
	messageIsDisplayed

	constructor(allReceipts) {
		this.userInput = ""
		this.filteredReceipts = []
		this.initialReceipts = allReceipts
		this.$mainSearchBar = document.querySelector("#searchBar")
		this.messageIsDisplayed = false
	}

	/**
	 * @description Vide le conteneur qui reçoit les tags
	 * @return void
	 */
	emptyTagContainer() {
		const $tagsContainer = document.querySelector("#tagsWrapper")
		$tagsContainer.innerHTML = ""
	}

	resetOptionTags() {
		const $tagsLI = [...document.querySelectorAll(".filtres__filtre li")]
		$tagsLI.forEach($tag => {
			$tag.setAttribute("data-visible", "true")
			$tag.setAttribute("data-active", "true")
			const $tagBtn = $tag.firstChild
			$tagBtn.disabled = false
		})
	}

	/**
	 * @description Change le data-visible pour toutes les cartes de recettes
	 * @param value :"true" | "false"
	 */
	resetAllCardsVisibility(value) {
		const $allRecettesCards = [...document.querySelectorAll(`.recette`)]
		$allRecettesCards.forEach(recette => {
			recette.dataset.visible = value
		})
	}

	resetAllOptionsVisibility(value) {
		const allLIElement = [...document.querySelectorAll("#filtres li")]
		allLIElement.forEach(li => {
			li.dataset.visible = value
			li.dataset.active = value
		})
	}

	/**
	 * @description Met à jour l'affichage des recettes avec les données filtrées.
	 * Pour chaque donnée, on récupère l'ID et on va chercher le Node en ciblant sont [data-id].
	 * Puis on règle le [data-visible] pour l'afficher ou non
	 * @async
	 * @return void
	 */
	async updateCardsVisibility(recettes) {
		// 1. Met toutes les cartes invisibles au début de la recherche
		this.resetAllCardsVisibility("false")

		recettes.forEach(({id}) => {
			const $nodeId = CSS.escape(id.toString())
			const selector = `.recette[data-id ="${$nodeId}"]`
			const $recetteNode = document.querySelector(selector)
			// 2. Puis repasse les cartes filtrées en visible
			$recetteNode.dataset.visible = "true"
		})
	}

	/**
	 * @description Update option-tags in filters with filtered Data from main search. Set the [data-visible] attribute
	 * @private
	 */
	async updateFilterOptions(recettes) {
		this.resetAllOptionsVisibility("false")
		const newInstance = new HandleOptionTags(recettes)
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
				const parentSelector = `.filtres__list[data-filter-name=\"${CSS.escape(typeToString)}\"]`
				const parentNode = document.querySelector(parentSelector)
				const applianceSelector = `li[data-value=\"${CSS.escape(StringUtility.removeAccent(optionTag))}\"]`
				const optionNode = parentNode.querySelector(applianceSelector)
				optionNode.dataset.visible = "true"
				optionNode.dataset.active = "true"
			})
		})
	}

	async filterByName() {
		const results = []
		for (let i = 0; i < this.initialReceipts.length; i++) {
			const recette = this.initialReceipts[i]
			let testName = StringUtility.removeAccent(recette.name)
			if (testName.includes(this.userInput)) results.push(recette)
		}
		return results
	}

	async filterByDescription() {
		const results = []
		for (let i = 0; i < this.initialReceipts.length; i++) {
			const recette = this.initialReceipts[i]
			const testDescription = StringUtility.removeAccent(recette.description)
			if (testDescription.includes(this.userInput)) results.push(recette)
		}
		return results
	}

	async filterIngredients() {
		const results = []
		for (let i = 0; i < this.initialReceipts.length; i++) {
			const recette = this.initialReceipts[i]
			const ingredients = recette.ingredients
			for (const {ingredient} of ingredients) {
				const testIngredient = StringUtility.removeAccent(ingredient)
				if (testIngredient.includes(this.userInput)) results.push(recette)
			}
		}
		return results
	}

	/**
	 * @description Filtre Principal : Appelle mainFilterByType() pour chaque type [name, description, ingredients]. Permet d'interrompre la recherche si un résultat est trouvé
	 * @see mainFilterByType
	 * @async
	 * @return Promise<Recette[]>
	 */
	async handleMainFilter() {
		const filterByName = await this.filterByName()
		const filterByDescription = await this.filterByDescription()
		const filterIngredients = await this.filterIngredients()

		const allResults = [...filterByName, ...filterByDescription, ...filterIngredients]
		return [...new Set(allResults)]
	}

	/**
	 * @description Fonction appelée par l'Event Listener pour filtrer les data lorsque l'utilisateur effectue une recherche
	 * @see observeDomChange
	 * @async
	 * @requires StringUtility
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	async onUserInput() {
		this.userInput = StringUtility.removeAccent(this.$mainSearchBar.value)
		this.$mainSearchBar.dataset.hasResults !== "false" && this.emptyTagContainer()
		this.filteredReceipts = []
		this.resetOptionTags()

		if (this.userInput.length > 2) {
			// USER INPUT : plus de deux caractères
			this.filteredReceipts = await this.handleMainFilter()

			await this.updateCardsVisibility(this.filteredReceipts)
			await this.updateFilterOptions(this.filteredReceipts)

			let isResult = this.filteredReceipts.length > 0
			this.$mainSearchBar.dataset.hasResults = isResult ? "true" : "false" // User Visual Feedback
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
	 * @see onUserInput
	 * @return Promise<Recette[]>
	 */
	async observeDomChange() {
		this.$mainSearchBar.oninput = async () => await this.onUserInput()

		this.handleFeedBackMessage()
		const $tagsContainer = document.querySelector("#tagsWrapper")
		const observer = new MutationObserver(async mutations => await this.observerTagContainer(mutations))
		observer.observe($tagsContainer, {childList: true})
		return this.filteredReceipts
	}

	/**
	 * @description Filtrer les résultats en fonction du nombre de tags sélectionnés et de leur type
	 * @async
	 * @memberOf observeDomChange
	 * @return {Promise<void>}
	 */
	async observerTagContainer(mutations) {
		let initialReceipts = this.filteredReceipts.length > 0 ? this.filteredReceipts : this.initialReceipts
		let $1stFilter
		let $2ndFilter
		let $3rdFilter

		const event = mutations[0]
		const children = [...event.target.childNodes]
		const numberOfTags = children.length

		const $1stNode = children[0]
		const $1stTag = {
			value: $1stNode && StringUtility.removeAccent($1stNode.textContent),
			type: $1stNode && $1stNode.dataset.tag,
		}

		const $2ndNode = children[1]
		const $2ndTag = {
			value: $2ndNode && StringUtility.removeAccent($2ndNode.textContent),
			type: $2ndNode && $2ndNode.dataset.tag,
		}

		const $3rdNode = children[2]
		const $3rdTag = {
			value: $3rdNode && StringUtility.removeAccent($3rdNode.textContent),
			type: $3rdNode && $3rdNode.dataset.tag,
		}

		const wrapper = event.target

		$1stNode ? wrapper.classList.add("tagInWrapper") : wrapper.classList.remove("tagInWrapper")

		switch (numberOfTags) {
			case 0:
				await this.updateCardsVisibility(initialReceipts)
				await this.updateFilterOptions(initialReceipts)
				// get filter from document.querySelector because state changed to #document
				const openFilter = document.querySelector(".filtres__filtre[data-open='true']")
				openFilter && new ContextState(openFilter)
				break
			case 1:
				$1stFilter = await this.filterByTag($1stTag.value, $1stTag.type, initialReceipts)
				await this.updateCardsVisibility($1stFilter)
				await this.updateFilterOptions($1stFilter)
				break
			case 2:
				$1stFilter = await this.filterByTag($1stTag.value, $1stTag.type, initialReceipts)
				await this.updateCardsVisibility($1stFilter)
				await this.updateFilterOptions($1stFilter)
				$2ndFilter = await this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter)
				await this.updateCardsVisibility($2ndFilter)
				await this.updateFilterOptions($2ndFilter)
				break
			case 3:
				$1stFilter = await this.filterByTag($1stTag.value, $1stTag.type, initialReceipts)
				await this.updateCardsVisibility($1stFilter)
				await this.updateFilterOptions($1stFilter)
				$2ndFilter = await this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter)
				await this.updateCardsVisibility($2ndFilter)
				await this.updateFilterOptions($2ndFilter)
				$3rdFilter = await this.filterByTag($3rdTag.value, $3rdTag.type, $2ndFilter)
				await this.updateCardsVisibility($3rdFilter)
				await this.updateFilterOptions($3rdFilter)
				break
			default:
				break
		}
	}

	/**
	 * @description Algorithme de recherche pour les tags
	 * @param value
	 * @param type
	 * @param recettes
	 * @return {Promise<Recette[]>}
	 */
	async filterByTag(value, type, recettes) {
		const results = []
		switch (type) {
			case "appliance":
				for (let i = 0; i < recettes.length; i++) {
					const recette = recettes[i]
					let testAppliance = StringUtility.removeAccent(recette.appliance)
					if (testAppliance.includes(value)) results.push(recette)
				}
				return results
			case "ustensiles":
				for (let i = 0; i < recettes.length; i++) {
					const recette = recettes[i]
					const ustensiles = recette.ustensiles
					for (const ustensile of ustensiles) {
						const testUstensile = StringUtility.removeAccent(ustensile)
						if (testUstensile.includes(value)) results.push(recette)
					}
				}
				return results
			case "ingredients":
				for (let i = 0; i < recettes.length; i++) {
					const recette = recettes[i]
					const ingredients = recette.ingredients
					for (const {ingredient} of ingredients) {
						const testIngredient = StringUtility.removeAccent(ingredient)
						if (testIngredient.includes(value)) results.push(recette)
					}
				}
				return results

			default:
				return results
		}
	}

	/**
	 * @description Affiche le message de retour utilisateur si aucun résultat n'est trouvé
	 */
	handleFeedBackMessage() {
		const observeFeedBackMessage = new MutationObserver(mutations => {
			const input = mutations[0].target
			if (input.value.length < 3 || input.dataset.hasResults === "true") {
				this.messageIsDisplayed = false
				this.emptyTagContainer()
			} else if (input.dataset.hasResults === "false" && !this.messageIsDisplayed) {
				const $tagsContainer = document.querySelector("#tagsWrapper")
				this.messageIsDisplayed = true
				const feedBackMessage = document.createElement("p")
				feedBackMessage.id = "feedBackMessage"
				feedBackMessage.textContent =
					"« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc."
				const wait = setTimeout(() => {
					$tagsContainer.appendChild(feedBackMessage)
					clearTimeout(wait)
				}, 250)
			}
		})
		observeFeedBackMessage.observe(this.$mainSearchBar, {attributes: true})
	}
}
