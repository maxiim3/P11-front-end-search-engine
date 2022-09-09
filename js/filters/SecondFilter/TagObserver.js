class TagObserver {
	constructor(data, filterWrapper) {
		this.data = data
		this.filterWrapper = filterWrapper
		this.observers = []
		this.tags = []
	}

	subscribe(obs) {
		this.observers.push(obs)
	}

	unsubscribe(obs) {
		const index = this.observers.indexOf(obs)
		this.observers.slice(index, 1)
		obs.querySelector("input").value = ""
		document.removeEventListener("input", this.updateListOfTags)
	}

	async updateListOfTags() {
		const type = this.filterWrapper.querySelector("ul").dataset.filterName
		const input = this.filterWrapper.querySelector("input").value
		this.tags = await FilterV1.handleTagFiltered(input, type)
	}

	selectTags() {
		this.tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if (!$tag.disabled) {
					const tagTpl = new TagsTemplate($tag)
					await tagTpl.appendTag()
					$tag.parentNode.parentNode.querySelector("input").value = ""
					await this.updateListOfTags($tag.parentNode.parentNode)
				}
			})
		})
	}

	fire() {
		this.observers.forEach(obs => {
			this.tags = [...obs.querySelectorAll("li:not([data-hidden=true])")]
			obs.querySelector("input").addEventListener("input", async () => {
				await this.updateListOfTags()
			})
			this.selectTags()
		})
	}
}
