import {FilterV1} from "../../utils/FilterV1"
import {TagsTemplate} from "../../templates/TagsTemplate"

export class TagObserver {
	protected data: Object[]
	private filterWrapper: HTMLLIElement
	private observers: HTMLLIElement[]
	protected tags: HTMLLIElement[]

	constructor(data: Object[], filterWrapper: HTMLLIElement) {
		this.data = data
		this.filterWrapper = filterWrapper
		this.observers = []
		this.tags = []
	}

	subscribe(obs: HTMLLIElement) {
		this.observers.push(obs)
	}

	unsubscribe(obs: HTMLLIElement) {
		const index = this.observers.indexOf(obs)
		this.observers.slice(index, 1)
		const input = obs.querySelector("input") as HTMLInputElement
		input.value = ""
		document.removeEventListener("input", this.updateListOfTags)
	}

	async updateListOfTags() {
		const tagListWrapper = this.filterWrapper.querySelector("ul") as HTMLUListElement
		const {filterName} = tagListWrapper.dataset
		const {value} = this.filterWrapper.querySelector("input") as HTMLInputElement
		if (filterName) this.tags = await FilterV1.handleTagFiltered(value, filterName)
	}

	selectTags() {
		this.tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if (!$tag.getAttribute("disabled")) {
					const tagTpl = new TagsTemplate($tag)
					tagTpl.appendTag()
					const directParent = $tag.parentNode as HTMLDivElement
					const grandParent = directParent.parentNode as HTMLDivElement
					const inputElement = grandParent.querySelector("input") as HTMLInputElement
					inputElement.value = ""
					await this.updateListOfTags()
				}
			})
		})
	}

	fire() {
		this.observers.forEach(obs => {
			this.tags = [...obs.querySelectorAll("li:not([data-hidden=true])")] as HTMLLIElement[]
			const input = obs.querySelector("input") as HTMLInputElement
			input.addEventListener("input", async () => {
				await this.updateListOfTags()
			})
			this.selectTags()
		})
	}
}
