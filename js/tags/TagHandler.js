import {MenuSwitcher} from "./MenuSwitcher.js"
import {TagsTemplate} from "../templates/TagsTemplate.js"

/**
 * @class
 * @static
 * @classdesc Handle Methods for Tags
 */
export class TagHandler {
	/**
	 * @description Handle drop down tags menu and tag selection
	 * @requires MenuSwitcher
	 * @return {Promise<void>}
	 * @static
	 */
	static async handleDropDownMenuFilter() {
		const filterButtons = [...document.querySelectorAll(".filtres__button")]
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
		const $allTags = [...document.querySelectorAll(".filtres__list li")]
		const $tagsContainer = document.querySelector("#tagsWrapper")

		if ($tagsContainer.childNodes) {
			const $selectedTags = [...$tagsContainer.childNodes]
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
	 * @param selectedTagContainer : ParentNode
	 * @static
	 */
	static async handleSearchForTags(selectedTagContainer) {
		const type = selectedTagContainer.querySelector("ul").dataset.filterName
		const input = selectedTagContainer.querySelector("input").value
		const pattern = new RegExp(input, "gi")
		const selection = `ul[data-filter-name=${CSS.escape(type)}] li`
		const $tags = [...document.querySelectorAll(selection)]

		if (input.length === 0) $tags.forEach(tag => (tag.dataset.hidden = "false"))
		else
			$tags.forEach(tag => {
				const value = tag.textContent.toString().toLowerCase()
				if (pattern.test(value)) tag.dataset.hidden = "false"
				else tag.dataset.hidden = "true"
			})
		return [...document.querySelectorAll(selection + "[data-hidden=false]")]
	}

	/**
	 * @requires TagsTemplate
	 * @description handle add tag to tag wrapper when click on tag from filter drop down menu
	 * @param tags : HTMLLIElement[]
	 * @param selectedTagContainer : ParentNode
	 * @return void
	 * @static
	 */
	static handleClickOnTags(tags, selectedTagContainer) {
		tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if ($tag.dataset.active === "false") {
					const tagTpl = new TagsTemplate($tag)
					await tagTpl.appendTag()
					await TagHandler.handleSearchForTags(selectedTagContainer)
					// reset input
					$tag.parentNode.parentNode.querySelector("input").value = ""
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
	static getAllTags(observer) {
		return [...observer.querySelectorAll("li:not([data-hidden=true])")]
	}
}
