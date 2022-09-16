class App {
	fetchedData
	allReceipts
	dataFilteredByTags
	activeTags
	keyWords

	constructor() {
		this.fetchedData = []
		this.allReceipts = []
		this.dataFilteredByTags = []
		this.activeTags = []
		this.keyWords = {input: "", tags: []}
	}
	async mapData(data) {
		return data.map((d) => new Recette(d))
	}

	handleTagSelection = async () => {
		const parentNode = [...document.querySelectorAll(".filtres__filtre")]
		const filters = [...document.querySelectorAll(".filtres__button")]
		filters.forEach(btn => {
			const switcher = new MenuSwitcher(btn, parentNode, this.fetchedData)

			btn.addEventListener("click", e => {
				e.preventDefault()
				switcher.update()
			})
		})
	}

	removeTags() {
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

	async observeTags() {
		const $tagsContainer = document.querySelector("#tagsWrapper")
		const config = {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}

		const observer = new MutationObserver(async (mutationRecords, observer) => {
			this.activeTags = [...mutationRecords[0].target.childNodes]
			console.log(this.activeTags)
			if (this.activeTags[0]) {
				for (const tag of this.activeTags) {
					this.dataFilteredByTags = await FilterV1.advancedFilter(
						this.fetchedData,
						tag
					)
					await DomFactory.resetDom()
					await DomFactory.renderDOM(this.dataFilteredByTags)
					console.log(this.dataFilteredByTags)
				}
			} else {
				console.log("no tag")
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.fetchedData)
			}
			observer.takeRecords()
		})
		observer.observe($tagsContainer, config)
	}

	globalObserver() {
		const observerSearchBar = () => {
			const $mainSearchBar = document.querySelector("#searchBar")
			$mainSearchBar.addEventListener("input", async () => {
				this.removeTags()
				this.keyWords.input = $mainSearchBar.value.toLowerCase()
				const filteredData = await FilterKeyWords()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(filteredData)
			})
		}

		const observerTagContainer = () => {
			const config = {
				attributes: true,
				characterDataOldValue: true,
				childList: true,
				subtree: true,
			}
			const $tagsContainer = document.querySelector("#tagsWrapper")
			const observer = new MutationObserver(async mutationRecords => {
				const tags = [...mutationRecords[0].target.childNodes]
				this.keyWords.tags = []
				tags.forEach(tag => this.keyWords.tags.push(tag))
				await FilterKeyWords()
			})
			observer.observe($tagsContainer, config)
		}

		const FilterKeyWords = async () => {
			const {input, tags} = this.keyWords
			const regExp = new RegExp(input, "gi")
			const dataThroughFirstFilter = []
			// const dataThroughSecondFilter:  = []

			this.allReceipts.filter(card => regExp.test(card.name) && dataThroughFirstFilter.push(card))
			this.allReceipts.filter(card => regExp.test(card.description) && dataThroughFirstFilter.push(card))
			this.allReceipts.map(card => {
				card.getIngredients.forEach(({ingredient}) => {
					if (regExp.test(ingredient)) dataThroughFirstFilter.push(card)
				})
			})
			const filteredData = dataThroughFirstFilter.length > 0 ? [...new Set(dataThroughFirstFilter)] : [...allData]

			if (!!tags) {
				const allTags  = [...tags]
				const output  = []
				const filterRec = await recursiveFiltering(filteredData, allTags, output)
				console.log( filterRec)
				async function recursiveFiltering(data , tags , result ){
					if (tags.length === 0) {
						if (result.length === 0) return data
						return result
					} else {
						const tagValue = tags[0].textContentstring
						const pattern = new RegExp(tagValue.toLowerCase(), "gi")
						const tagType = tags[0].dataset.tagstring

						data.forEach(card => {
							switch (tagType) {
								case "ingredients":
									card.getIngredients.forEach(({ingredient}) => {
										if (pattern.test(ingredient)) result.push(card)
									})
									break
								case "appliance":
									if (pattern.test(card.appliance)) result.push(card)

									break
								case "ustensiles":
									card.ustensiles.forEach(ustensile => {
										if (pattern.test(ustensile)) result.push(card)
									})
									break
							}
						})

						const res = [...new Set(result)]
						const newTags = tags.length > 0 ? tags.shift() : []
						newTags.length > 0 && await recursiveFiltering(data, newTags, res)

					}
				}
			}

			// console.log([...new Set(dataThroughSecondFilter)])
			return [...new Set(dataThroughFirstFilter)] || allData
			/*	if (filterByName) return filterByName
			 else if (filterByDesc) return filterByDesc
			 else if (filterByIngredients) return filterByIngredients
			 else return allData*/
		}
		observerSearchBar()
		observerTagContainer()
	}

	async init() {
		this.fetchedData = await fetchData("data/recipes.json")
		this.allReceipts = await this.mapData(this.fetchedData)

		await DomFactory.renderDOM(this.allReceipts)
		await this.handleTagSelection()
		this.globalObserver()
	}
}

const app = new App()
app.init().catch(e => new Error("Error on loading page" + e))
