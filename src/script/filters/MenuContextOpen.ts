/*
// import {Utility} from "../utils/Utility.js"
import {TagsTemplate} from "../templates/TagsTemplate.js"

export class MenuContextOpen {
	filter: HTMLDivElement
	private $tagsContainer: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
	}

	setActive() {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"
		this.filter.dataset.color = this.filter.style.backgroundColor
		// const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		const tagWrapper = this.filter.querySelector("ul") as HTMLUListElement
		const $tags = [...tagWrapper.childNodes] as HTMLLIElement[]

		/!*		inputSearch.addEventListener("input", async () => {
					const query = Utility.removeAccent(inputSearch.value) as string
					$tags.map(async $tag => {
						const formatTagName = Utility.removeAccent($tag.innerText) as string
						if (formatTagName.includes(query)) $tag.setAttribute("data-hidden", "false")
						else $tag.setAttribute("data-hidden", "true")
					})
				})*!/

		$tags.forEach($tag => {
			$tag.onclick = () => {
				$tag.dataset.active = "true"
				// this.appendTagToContainer($tag)
			}
		})
	}

	// appendTagToContainer($tag: HTMLLIElement) {
	// 	const tagTemplate = new TagsTemplate($tag)
	// 	if (this.$tagsContainer.childNodes.length < 3) {
	// 		const $tag = tagTemplate.createTag()
	// 		this.$tagsContainer.appendChild($tag)
	// 		const $closeTag = $tag.querySelector(".tag__btn") as HTMLButtonElement
	//
	// 		$closeTag.onclick = () => {
	// 			$tag.dataset.active = "false"
	// 			this.$tagsContainer.removeChild($tag)
	// 		}
	// 		return $tag
	// 	}
	// 	return
	// }

	async handleContext() {
		this.setActive()
	}
}
*/
