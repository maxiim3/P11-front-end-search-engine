import {MenuSwitcher} from "./MenuSwitcher.js"
import {TagsTemplate} from "../templates/TagsTemplate.js"

/**
 * @class TagHandler
 * @classdesc Static Methods for Handling Tags
 */
export class TagHandler {
	/**
	 * @description Handle drop down tags menu and tag selection
	 * @requires MenuSwitcher
	 * @static
	 * @return {Promise<void>}
	 */
	static async handleDropDownMenuFilter() {
		const filterButtons = [...document.querySelectorAll(".filtres__button")] as HTMLButtonElement[]
		filterButtons.forEach(btn => {
			const switcher = new MenuSwitcher(btn)

			btn.addEventListener("click", async e => {
				e.preventDefault()
				await switcher.update()
			})
		})
	}

	/**
	 * @description Remove all tags from tag wrapper
	 * @static
	 */
	static removeTagQueries() {
		const $allTags = [...document.querySelectorAll(".filtres__list li")] as HTMLLIElement[]
		const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement

		if ($tagsContainer.childNodes) {
			const $selectedTags = [...$tagsContainer.childNodes] as HTMLLIElement[]
			$selectedTags.forEach($selectedTag => {
				$allTags
					.filter(li => li.textContent === $selectedTag.textContent)
					.forEach(li => {
						li.dataset.active = "false"
						li.dataset.hidden = "false"
						li.setAttribute("disabled", "false")
					})
				$tagsContainer.removeChild($selectedTag)
			})
		}
	}

	/**
	 * @description Filter the tags by input search
	 * @return {Promise<HTMLLIElement[]>}
	 * @param selectedTagContainer : HTMLDivElement
	 * @static
	 */
	static async handleSearchForTags(selectedTagContainer: HTMLDivElement) {
		const ulElement = selectedTagContainer.querySelector("ul") as HTMLUListElement
		const type = ulElement.dataset.filterName as string
		const inputElement = selectedTagContainer.querySelector("input") as HTMLInputElement
		const inputQuery = inputElement.value
		const pattern = new RegExp(inputQuery, "gi")
		const selection = `ul[data-filter-name=${CSS.escape(type)}] li`
		const $tags = [...document.querySelectorAll(selection)] as HTMLLIElement[]

		if (inputQuery.length === 0) $tags.map(tag => tag.setAttribute("data-hidden", "false"))
		else {
			$tags.map(tag => {
				const value = tag.value.toString().toLowerCase() as string
				if (pattern.test(value)) tag.setAttribute("data-hidden", "false")
				else tag.setAttribute("data-hidden", "true")
			})
		}
		return [...document.querySelectorAll(selection + "[data-hidden=false]")] as HTMLDivElement[]
	}

	/**
	 * @requires TagsTemplate
	 * @description handle add tag to tag wrapper when click on tag from filter drop down menu
	 * @param tags : HTMLLIElement[]
	 * @param selectedTagContainer : HTMLLIElement
	 * @return void
	 * @static
	 */
	static handleClickOnTags(tags: HTMLLIElement[], selectedTagContainer: HTMLDivElement) {
		tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if ($tag.dataset.active === "false") {
					const tagTpl = new TagsTemplate($tag)
					await tagTpl.appendTag()
					await TagHandler.handleSearchForTags(selectedTagContainer)
					// reset input
					const firstParent = $tag.parentElement as HTMLUListElement
					const divContext = firstParent.parentElement as HTMLDivElement
					const inputSearch = divContext.querySelector("input") as HTMLInputElement
					inputSearch.value = ""
				}
			})
		})
	}

	/**
	 * Select all none *[data-hidden=true]* li in observer
	 * @param observer : HTMLDivElement
	 * @return {HTMLLIElement[]}
	 * @static
	 */
	static getAllTags(observer: HTMLDivElement):HTMLLIElement[] {
		return [...observer.querySelectorAll("li:not([data-hidden=true])")] as HTMLLIElement[]
	}
}
