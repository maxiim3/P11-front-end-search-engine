import {Utility} from "../utils/Utility.js"
import {TagsTemplate} from "../templates/TagsTemplate.js"
import {StateEnums} from "./MenuObserver.js"
import {IContext} from "./IContext.js"

export class MenuContextOpen implements IContext{
	state: StateEnums.Open
	filter: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.state = StateEnums.Open
	}

	setActive() {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"
		this.filter.focus()
		this.filter.dataset.color = this.filter.style.backgroundColor
		const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		const tagWrapper = this.filter.querySelector("ul") as HTMLUListElement
		const $tags = [...tagWrapper.querySelectorAll("li")] as HTMLLIElement[]

		inputSearch.addEventListener("input", async () => {
			const query = Utility.removeAccent(inputSearch.value) as string
			$tags.map(async $tag => {
				const formatTagName = Utility.removeAccent($tag.innerText) as string
				if (formatTagName.includes(query)) $tag.setAttribute("data-hidden", "false")
				else $tag.setAttribute("data-hidden", "true")
			})
		})

		$tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if ($tag.dataset.active === "false") {
					const tagTpl = new TagsTemplate($tag)
					await tagTpl.appendTag()
					inputSearch.value = ""
				}
			})
		})
	}

	async handleContext() {
		this.setActive()
	}
}
