class Observer {
	/**
	 * @param allReceipts : Recette[]
	 */
	constructor(allReceipts) {
		// all data
		this._allReceipts = allReceipts
		// filtered data
		this.filteredDataLevel1 = []
		this.filteredDataLevel2 = []
		// keyWord = {input, tags}
		this.input = ""
		this.selectedTags = []
		// DOM
		this.$mainSearchBar = document.querySelector("#searchBar")
		this.$tagsContainer = document.querySelector("#tagsWrapper")
	}

	get allReceipts() {
		return this._allReceipts
	}

	get keyWords() {
		return {input: this.input, tags: this.selectedTags}
	}

	get config() {
		return {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}
	}

	dataThroughFirstFilter() {
		if (this.filteredDataLevel1.length > 0) return this.filteredDataLevel1
		else return this.allReceipts
	}

	dataThroughAllFilters() {
		if (this.filteredDataLevel2.length > 0) return this.filteredDataLevel2
		else this.dataThroughFirstFilter()
	}

	observerSearchBar = async () => {
		this.$mainSearchBar.addEventListener("input", async () => {
			this.input = Utility.removeAccent(this.$mainSearchBar.value)
			this.selectedTags = []
			this.filteredDataLevel1 = []
			this.filteredDataLevel2 = []
			if (this.input.length > 2) {
				const Filter = new Filtres(this.allReceipts, this.keyWords)
				this.filteredDataLevel1 = await Filter.filterBySearch()
				TagHandler.removeTags()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.filteredDataLevel1)
			} else {
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.allReceipts)
			}
		})
	}

	observerTagContainer = async () => {
		const observer = new MutationObserver(async mutationRecords => {
			const tags = [...mutationRecords[0].target.childNodes]
			this.selectedTags = []
			this.filteredDataLevel2 = []

			if (tags.length !== 0) {
				tags.forEach(tag => this.selectedTags.push(tag))
				const Filter = new Filtres(this.dataThroughFirstFilter(), this.keyWords)
				this.filteredDataLevel2 = await Filter.filterByTags()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.filteredDataLevel2)
			} else {
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.dataThroughFirstFilter())
			}
		})
		observer.observe(this.$tagsContainer, this.config)
	}

	async observeDomChange() {
		await this.observerSearchBar()
		await this.observerTagContainer()
		return this.dataThroughAllFilters()
	}
}
