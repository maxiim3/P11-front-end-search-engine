class App {
	constructor() {
		this.url = "data/recipes.json"
		this.api = new Api(this.url)
		this.initialData = []
		this.dataFilteredByTags = []
		this.activeTags = []

		this.keyWords = {input: "", tags: []}
	}

	removeTags() {
		const tagsInList = [...document.querySelectorAll(".filtres__list li")]
		const activeTagsContainer = document.querySelector("#tagsWrapper")
		const activeTags = [...activeTagsContainer.querySelectorAll(".tag")]
		this.dataFilteredByTags = []
		activeTags.forEach(tag => {
			if (tag) {
				const that = tagsInList.find(
					li => li.textContent === tag.textContent
				)
				that.dataset.active = "false"
				that.dataset.hidden = "false"
				that.disabled = false
				activeTagsContainer.removeChild(tag)
			}
		})
	}

	handleFirstFilter = async data => {
		const $mainSearchBar = document.querySelector("#searchBar")
		const filter = new MainFilter(data)

		$mainSearchBar.addEventListener("input", async () => {
			this.initialData = await filter.update()

			return this.initialData
		})
	}

	handleTagSelection = async () => {
		const parentNode = [...document.querySelectorAll(".filtres__filtre")]
		const buttons = [...document.querySelectorAll(".filtres__button")]
		buttons.forEach(btn => {
			const switcher = new MenuSwitcher(btn, parentNode, this.initialData)

			btn.addEventListener("click", e => {
				e.preventDefault()
				switcher.update()
			})
		})
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
						this.initialData,
						tag
					)
					await DomFactory.resetDom()
					await DomFactory.renderDOM(this.dataFilteredByTags)
					console.log(this.dataFilteredByTags)
				}
			} else {
				console.log("no tag")
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.initialData)
			}
			observer.takeRecords()
		})
		observer.observe($tagsContainer, config)
	}

	globalObserver() {
		const config = {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}

		const observerSearchBar = () => {
			const $mainSearchBar = document.querySelector("#searchBar")
			$mainSearchBar.addEventListener("input", async () => {
				this.removeTags()
				this.keyWords.input = $mainSearchBar.value
				await FilterKeyWords()
			})
		}

		const observerTagContainer = () => {
			const $tagsContainer = document.querySelector("#tagsWrapper")
			const observer = new MutationObserver(
				async (mutationRecords, observer) => {
					const tags = [...mutationRecords[0].target.childNodes]
					this.keyWords.tags = []
					tags.forEach(tag => this.keyWords.tags.push(tag))
					await FilterKeyWords()
				}
			)
			observer.observe($tagsContainer, config)
		}

		const FilterKeyWords = async () => {
			const {input, tags} = this.keyWords
			const dataFilteredByMainSearch = await FilterV1.mainFilter(
				this.initialData,
				input
			)
			if (tags.length > 0) {
				for (const tag of tags) {
					const data =
						this.dataFilteredByTags.length > 0
							? this.dataFilteredByTags
							: dataFilteredByMainSearch

					this.dataFilteredByTags = await FilterV1.advancedFilter(
						data,
						tag
					)
				}
			}
			const outputData =
				this.dataFilteredByTags.length > 0
					? this.dataFilteredByTags
					: dataFilteredByMainSearch
			console.log(outputData)
			await DomFactory.resetDom()
			return await DomFactory.renderDOM(outputData)
		}
		observerSearchBar()
		observerTagContainer()
	}

	async init() {
		this.initialData = await this.api.fetch()

		await DomFactory.renderDOM(this.initialData)
		await this.handleTagSelection()
		this.globalObserver()
		// recuperer les nom des input  + filtres on chanege

		// rerender with all keywords

		/*		await this.handleFirstFilter(initialFetchedData)
				await this.observeTags()*/
	}
}

const app = new App()
app.init().catch(e => new Error("Error on loading page" + e))
