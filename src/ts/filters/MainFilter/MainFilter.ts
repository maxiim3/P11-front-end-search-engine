class MainFilter {
	constructor(data) {
		this.data = data
		this.$mainSearchBar = document.querySelector("#searchBar")
	}

	async resetDom(data) {
		await DomFactory.resetDom()
		await DomFactory.renderDOM(data)
	}

	async filtering(data, input) {
		return FilterV1.mainFilter(data, input)
	}

	async update() {
		const input = this.$mainSearchBar.value
		if (input.length < 3) {
			this.$mainSearchBar.dataset.hasResults = ""
			return await this.resetDom(this.data)
		}

		const updatedData = await this.filtering(this.data, input)

		if (updatedData.length === 0) this.$mainSearchBar.dataset.hasResults = "false"
		else this.$mainSearchBar.dataset.hasResults = "true"

		await this.resetDom(updatedData)
		return updatedData
	}
}
