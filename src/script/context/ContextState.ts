import {inputTypeProps, TagsTemplate} from "../templates/TagsTemplate.js"
import {StringUtility} from "../utils/StringUtility.js"
import {MouseUtility} from "../utils/MouseUtility.js"

export class ContextState {
	filter: HTMLDivElement
	private $tagsContainer: HTMLDivElement

	// private readonly states: StateType
	private $filterUL: HTMLUListElement
	private readonly $tagsLI: HTMLLIElement[]
	private inputSearch: HTMLInputElement
	currentState: "open" | "close"

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
		this.$filterUL = this.filter.querySelector("ul") as HTMLUListElement
		this.$tagsLI = [...this.$filterUL.querySelectorAll("li")] as HTMLLIElement[]
		this.inputSearch = this.filter.querySelector("input") as HTMLInputElement
		this.currentState = "close"
		this.setState("close")
	}

	setState(state: "open" | "close") {
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

	private setInactive() {
		this.filter.dataset.open = "false"
		this.filter.ariaHidden = "true"
		this.filter.blur()
		const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		inputSearch.value = ""

		// "Freeze" les tags si une recherche est en cours dans la barre principale
		const mainInput: HTMLInputElement = document.querySelector("#searchBar") as HTMLInputElement
		if (mainInput.value.length < 3) {
			this.$tagsLI.forEach($tag => {
				$tag.setAttribute("data-visible", "true")
			})
		}
		// retire l'Event pour filtrer les tags
		this.inputSearch.removeEventListener("input", this.handleSearchForTags)
		// Retire les Event pour fermer la DIV
		this.filter.removeEventListener("keydown", this.closeOnKeyPress)
		this.filter.removeEventListener("click", this.closeOnClick)

		/*		// régler la scroll bar et overflow sur le #body
				const filterList = this.filter.querySelector(".filtres__list") as HTMLUListElement
				if (filterList.dataset.filterName === "ingredients") {
					const $main = document.querySelector("main") as HTMLDivElement
					const body = document.querySelector("body") as HTMLBodyElement
					// $main.dataset.filtreIsOpen === "true" && ($main.dataset.filtreIsOpen = "false")
					// body.dataset.filtreIsOpen === "true" && (body.dataset.filtreIsOpen = "false")
				}*/
	}

	private setActive() {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"
		// const filterList = this.filter.querySelector(".filtres__list") as HTMLUListElement

		// régler la scroll bar et overflow sur le #body
		// if (filterList.dataset.filterName === "ingredients") {
		// 	const $main = document.querySelector("main") as HTMLDivElement
		// 	$main.dataset.filtreIsOpen = "true"
		//
		// 	const body = document.querySelector("body") as HTMLBodyElement
		// 	body.dataset.filtreIsOpen = "true"
		// }

		// Event pour fermer la DIV

		//todo Ingredient do not close if one tag selected
		this.inputSearch.addEventListener("input", this.handleSearchForTags)
		// Event pour fermer la DIV
		document.addEventListener("keydown", this.closeOnKeyPress)
		document.addEventListener("click", this.closeOnClick)

		// Event pour ajouter les tags au click
		this.$tagsLI.forEach($tag => {
			const tagBtn = $tag.firstChild as HTMLButtonElement
			tagBtn.onclick = () => {
				this.appendTagToContainer(tagBtn)
				$tag.dataset.visivle = "true"
			}
		})
	}

	// todo Bug : When data filtered bu tag, if open menu filter once, OK (tags are filtered), but reset on reopen

	/**
	 * Handle filter tags from filter search bar
	 * @private
	 */
	private handleSearchForTags() {
		// check that this is scoped to <input>
		if (this instanceof HTMLInputElement) {
			const inputSearch: HTMLInputElement = this

			// get filter from document.querySelector because state changed to #input
			const openFilter: HTMLDivElement | null = document.querySelector(".filtres__filtre[data-open='true']")

			// check that this is scoped to <article>
			if (openFilter) {
				// get tags from openFilter.querySelector because state changed to #input
				const $tagsLI: HTMLLIElement[] = openFilter && [...openFilter.querySelectorAll("li")]
				const query = StringUtility.removeAccent(inputSearch.value) as string

				$tagsLI.map(async $tag => {
					const innerBtn: HTMLButtonElement | null = $tag.querySelector("button")
					const formatTagName = innerBtn && (StringUtility.removeAccent(innerBtn.value) as string)
					if (formatTagName && formatTagName.includes(query)) $tag.setAttribute("data-visible", "true")
					else $tag.setAttribute("data-visible", "false")
				})
			}
		}
	}

	/**
	 * Handle append clicked tag to tagContainer
	 * @param tagBtn
	 */
	appendTagToContainer(tagBtn: HTMLButtonElement) {
		const {value, dataset} = tagBtn
		const tagTemplate = new TagsTemplate(<inputTypeProps>{value, dataset})

		if (this.$tagsContainer.childNodes.length < 3) {
			tagBtn.disabled = true
			tagBtn.disabled = true
			const $newTag = tagTemplate.createTag()
			this.$tagsContainer.appendChild($newTag)
			const $closeTag = $newTag.querySelector(".tag__btn") as HTMLButtonElement

			$closeTag.onclick = () => {
				tagBtn.disabled = false
				this.$tagsContainer.removeChild($newTag)
			}
			return $newTag
		}
		return
	}

	/**
	 * Handle Close Filter Div when press Enter or Escape
	 * @param e
	 * @private
	 */
	private closeOnKeyPress(e: KeyboardEvent) {
		// get filter from document.querySelector because state changed to #document
		const openFilter: HTMLDivElement | null = document.querySelector(".filtres__filtre[data-open='true']")
		if (openFilter?.dataset.open === "true") {
			if (e.key === "Escape" || e.key === "Enter") {
				// create new Context and set to close by default
				new ContextState(openFilter)
				openFilter.blur()
			}
		}
	}

	/**
	 * Handle Close Filter Div when click outside
	 * @param ev
	 * @private
	 */
	private closeOnClick(ev: MouseEvent) {
		// get filter from document.querySelector because state changed to #document
		const openFilter: HTMLDivElement | null = document.querySelector(".filtres__filtre[data-open='true']")
		if (openFilter?.dataset.open === "true") {
			const mouseProps = MouseUtility.getMousePosition(ev)
			const containerProps = MouseUtility.getObserverPosition(openFilter)
			if (MouseUtility.mouseInObserver(mouseProps, containerProps)) {
				return
			} else {
				// create new Context and set to close by default
				window.scroll(0, 0)
				openFilter.blur()
				new ContextState(openFilter)
			}
		}
	}
}
