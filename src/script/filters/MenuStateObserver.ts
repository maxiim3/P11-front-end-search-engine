import {inputTypeProps, TagsTemplate} from "../templates/TagsTemplate.js"

export class MenuStateObserver {
	filter: HTMLDivElement
	private $tagsContainer: HTMLDivElement

	// private readonly states: StateType

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
		this.setState("close")
	}

	setState(state: "open" | "close") {
		const tagWrapper = this.filter.querySelector("ul") as HTMLUListElement
		const $tags = [...tagWrapper.childNodes] as HTMLLIElement[]
		switch (state) {
			case "open":
				this.setActive($tags)
				break
			case "close":
				this.setInactive($tags)
				break
		}
	}

	private setActive($tags: HTMLLIElement[]) {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"
		this.filter.dataset.color = this.filter.style.backgroundColor
		// const inputSearch = this.filter.querySelector("input") as HTMLInputElement

		/*		inputSearch.addEventListener("input", async () => {
					const query = Utility.removeAccent(inputSearch.value) as string
					$tags.map(async $tag => {
						const formatTagName = Utility.removeAccent($tag.innerText) as string
						if (formatTagName.includes(query)) $tag.setAttribute("data-hidden", "false")
						else $tag.setAttribute("data-hidden", "true")
					})
				})*/
		$tags.forEach($tag => {
			const tagBtn = $tag.firstChild as HTMLButtonElement

			tagBtn.onclick = () => {
				this.appendTagToContainer(tagBtn)
			}
		})
	}

	private setInactive($tags: HTMLLIElement[]) {
		this.filter.dataset.open = "false"
		this.filter.ariaHidden = "true"
		this.filter.blur()
		const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		inputSearch.value = ""
		$tags.forEach($tag => {
			$tag.setAttribute("data-hidden", "false")
		})
	}

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
}
