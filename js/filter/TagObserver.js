class TagObserver {
	constructor(data, filterWrapper) {
		this.data = data
		this.filterWrapper = filterWrapper
		this.observers = []
	}

	subscribe(obs) {
		this.observers.push(obs)
	}

	unsubscribe(obs) {
		const index = this.observers.indexOf(obs)
		this.observers.slice(index, 1)
		obs.querySelector("input").value = ""
		document.removeEventListener("input", this.tagFilter)
	}

	async tagFilter() {
		const type = this.filterWrapper.querySelector("ul").dataset.filterName
		const input = this.filterWrapper.querySelector("input").value
		await FilterV1.handleTagFiltered(this.data, input, type)
		//todo manage tag onclick => append tag / remove tag from tagWrapper
		// todo whdn tag added or reoved in tagWrapper => filter Data by #tag1|typeOfTag #tag2|typeOfTag #tag3|typeOfTag
	}

	fire() {
		this.observers.forEach(obs => {
			obs.querySelector("input").addEventListener("input", () =>
				this.tagFilter()
			)
		})
	}
}
