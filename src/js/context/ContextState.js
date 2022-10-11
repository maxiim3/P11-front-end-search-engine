import {TagsTemplate} from "../views/TagsTemplate.js"
import {StringUtility} from "../utils/StringUtility.js"
import {MouseUtility} from "../utils/MouseUtility.js"

export class ContextState {
	filter
	$tagsContainer
	$filterUL
	$tagsLI
	inputSearch
	currentState

	constructor(filter) {
		this.filter = filter
		this.$tagsContainer = document.querySelector("#tagsWrapper")

		this.$filterUL = this.filter?.querySelector("ul")
		this.$tagsLI = [...this.$filterUL.querySelectorAll("li")]
		this.inputSearch = this.filter.querySelector("input")
		this.currentState = "close"
		this.setState("close")
	}

	setState(state) {
		switch (state) {
			case "open":
				this.setActive()
				break
			case "close":
				this.setInactive()
				break
		}
		return (this.currentState = state)
	}

	resetFilterInput = () => (this.inputSearch.value = "")

	/**
	 * @description Set Selected filter to inactive
	 */
	setInactive() {
		this.filter.dataset.open = "false"
		this.filter.ariaHidden = "true"
		this.filter.blur()
		this.resetFilterInput()
		window.scroll(0, 0)
		// retire l'Event pour filtrer les tags
		this.inputSearch.removeEventListener("input", this.handleSearchForTags)
		// Retire les Event pour fermer la DIV
		this.filter.removeEventListener("keydown", this.closeOnKeyPress)
		this.filter.removeEventListener("click", this.closeOnClick)
		this.$tagsLI.forEach($tag => {
			$tag.classList.remove("fadeIn")
			$tag.classList.add("fadeOut")
		})
	}
	/**
	 * @description Set Selected filter to active
	 */
	setActive() {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"

		// Event pour filtrer les tags
		this.inputSearch.addEventListener("input", this.handleSearchForTags)
		// Event pour fermer la DIV
		document.addEventListener("keydown", this.closeOnKeyPress)
		document.addEventListener("click", this.closeOnClick)
		// Event pour ajouter les tags au click
		this.$tagsLI.forEach($tag => {
			$tag.classList.remove("fadeOut")
			$tag.classList.add("fadeIn")
			const tagBtn = $tag.firstChild
			tagBtn.onclick = () => {
				this.appendTagToContainer(tagBtn)
			}
		})
	}

	/**
	 * Handle filter tags from filter search bar
	 */
	handleSearchForTags() {
		// check that this is scoped to <input>
		if (this instanceof HTMLInputElement) {
			const inputSearch = this

			// get filter from document.querySelector because state changed to #input
			const openFilter = document.querySelector(".filtres__filtre[data-open='true']")

			// check that this is scoped to <article>
			if (openFilter) {
				// get tags from openFilter.querySelector because state changed to #input
				const $tagsLI = openFilter && [...openFilter.querySelectorAll("li")]
				const query = StringUtility.removeAccent(inputSearch.value)

				$tagsLI.forEach(async $tag => {
					const innerBtn = $tag.querySelector("button")
					const formatTagName = innerBtn && StringUtility.removeAccent(innerBtn.value)
					if (query.length === 0) {
						$tag.dataset.visible = $tag.dataset.active === "true" ? "true" : "false"
					}
					if (formatTagName && formatTagName.includes(query) && $tag.dataset.active === "true")
						$tag.setAttribute("data-visible", "true")
					else $tag.setAttribute("data-visible", "false")
				})
			}

		}
	}

	/**
	 * Handle append clicked tag to tagContainer
	 * @param tagBtn
	 */
	appendTagToContainer(tagBtn) {
		const {value, dataset} = tagBtn
		const tagTemplate = new TagsTemplate({value, dataset})

		if (this.$tagsContainer.childNodes.length < 3) {
			this.resetFilterInput()

			tagBtn.disabled = true
			const $newTag = tagTemplate.createTag()
			this.$tagsContainer.appendChild($newTag)
			$newTag.classList.remove("fadeOutWithAnimation")
			$newTag.classList.add("fadeIn")
			const $closeTag = $newTag.querySelector(".tag__btn")

			$closeTag.onclick = () => {
				tagBtn.disabled = false
				$newTag.classList.remove("fadeIn")
				$newTag.classList.add("fadeOutWithAnimation")
				const wait = setTimeout(() => {
					this.$tagsContainer.removeChild($newTag)
					clearTimeout(wait)
				}, 350)
			}
			return $newTag
		}
		return
	}

	/**
	 * Handle Close Filter Div when press Enter or Escape
	 * @param e
	 */
	closeOnKeyPress(e) {
		// get filter from document.querySelector because state changed to #document
		const openFilter = document.querySelector(".filtres__filtre[data-open='true']")
		if (openFilter?.dataset.open === "true") {
			if (e.key === "Escape" || e.key === "Enter") {
				// create new Context and set to close by default
				new ContextState(openFilter)
			}
		}
	}

	/**
	 * Handle Close Filter Div when click outside
	 * @param ev
	 */
	closeOnClick(ev) {
		// get filter from document.querySelector because state changed to #document
		const openFilter = document.querySelector(".filtres__filtre[data-open='true']")

		if (openFilter?.dataset.open === "true") {
			const pointerPosition = MouseUtility.getMousePosition(ev)
			const divPosition = MouseUtility.getDivElementPosition(openFilter)
			if (MouseUtility.mouseInObserver(pointerPosition, divPosition)) {
				return
			} else {
				// create new Context and set to close by default
				new ContextState(openFilter)
			}
		}
	}
}
