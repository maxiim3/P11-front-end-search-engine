class App {
	constructor() {
		this.url = "data/recipes.json"
		this.api = new Api(this.url)
		this.dataFilteredByMainSearch = []
		this.dataFilteredByTags = []
		this.activeTags = []
	}

	handleFirstFilter = async data => {
		const $mainSearchBar = document.querySelector("#searchBar")
		const filter = new MainFilter(data)

		$mainSearchBar.addEventListener("input", async () => {
			this.dataFilteredByMainSearch = await filter.update()

			const tagsInList = [...document.querySelectorAll(".filtres__list li")]
			const activeTagsContainer = document.querySelector("#tagsWrapper")
			const activeTags = [...activeTagsContainer.querySelectorAll(".tag")]
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
			return this.dataFilteredByMainSearch
		})
	}

	handleSecondFilter = async () => {
		const parentNode = [...document.querySelectorAll(".filtres__filtre")]
		const buttons = [...document.querySelectorAll(".filtres__button")]
		buttons.forEach(btn => {
			const switcher = new MenuSwitcher(
				btn,
				parentNode,
				this.dataFilteredByMainSearch
			)

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
						this.dataFilteredByMainSearch,
						tag
					)
					await DomFactory.resetDom()
					await DomFactory.renderDOM(this.dataFilteredByTags)
					console.log(this.dataFilteredByTags)
				}
			} else {
				console.log("no tag")
				await DomFactory.resetDom()
				await DomFactory.renderDOM(this.dataFilteredByMainSearch)
			}
			observer.takeRecords()
		})
		observer.observe($tagsContainer, config)
	}

	async init() {
		const initialFetchedData = await this.api.fetch()
		this.dataFilteredByMainSearch = initialFetchedData

		await DomFactory.renderDOM(initialFetchedData)

		await this.handleFirstFilter(initialFetchedData)
		await this.handleSecondFilter()
		await this.observeTags()
	}
}

const app = new App()
app.init().catch(e => new Error("Error on loading page" + e))
