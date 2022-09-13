import {Api} from "./api/Api"
import {DomFactory} from "./templates/DomFactory"
import {FilterV1} from "./utils/FilterV1"
import {MenuSwitcher} from "./filters/SecondFilter/MenuSwitcher"
import {Recette} from "./models/Recette"

export class App {
	private readonly url: string
	private api: Api
	private initialData: Object[]
	private dataFilteredByTags: Object[]
	private keyWords = {
		input: "",
		tags: [],
	}

	constructor() {
		this.url = "data/recipes.json"
		this.api = new Api(this.url)
		this.initialData = []
		this.dataFilteredByTags = []
	}

	async mapData(data: Object[]): Promise<Recette[]> {
		return data.map(d => new Recette(d))
	}

	handleTagSelection = async (data) => {
		const buttons = [...document.querySelectorAll(".filtres__button")] as HTMLButtonElement[]
		const filters = [...document.querySelectorAll(".filtres__filtre")] as HTMLLIElement[]

		buttons.forEach(btn => {
			const switcher = new MenuSwitcher(btn, filters, data)

			btn.addEventListener("click", e => {
				e.preventDefault()
				switcher.update()
			})
		})
	}

	removeTags() {
		const $allTags = [...document.querySelectorAll(".filtres__list li")] as HTMLLIElement[]
		const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
		const $selectedTags = [...$tagsContainer.querySelectorAll(".tag")] as HTMLDivElement[]
		this.dataFilteredByTags = []

		$selectedTags.forEach((tag: HTMLDivElement) => {
			if (tag) {
				$allTags.filter(li => {
					if (li.textContent === tag.textContent) {
						li.dataset.active = "false"
						li.dataset.hidden = "false"
						li.setAttribute("disabled", "false")
						$tagsContainer.removeChild(li)
					}
				})
			}
		})
	}

	globalObserver(allData:Recette[]) {
		const config = {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}
		// todo faire le filtrage global dans le filtres pour keywords
		const observerSearchBar = () => {
			const $mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
			$mainSearchBar.addEventListener("input", async () => {
				this.removeTags()
				this.keyWords.input = $mainSearchBar.value
				await FilterKeyWords()
			})
		}

		const observerTagContainer = () => {
			const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
			const observer = new MutationObserver(async mutationRecords => {
				const tags: HTMLLIElement[] = [...mutationRecords[0].target.childNodes] as HTMLLIElement[]
				this.keyWords.tags = []
				console.log(typeof tags)
				// tags.forEach(tag => this.keyWords.tags.push(tag))
				await FilterKeyWords()
			})
			observer.observe($tagsContainer, config)
		}

		/*		const FilterKeyWords = async () => {
		 const {input, tags} = this.keyWords
		 const dataFilteredByMainSearch = await FilterV1.mainFilter(this.initialData, input)
		 if (tags.length > 0) {
		 for (const tag of tags) {
		 const data = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch

		 this.dataFilteredByTags = await FilterV1.advancedFilter(data, tag)
		 }
		 }
		 const outputData = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch
		 console.log(outputData)
		 await DomFactory.resetDom()
		 return await DomFactory.renderDOM(outputData)
		 }*/
		const FilterKeyWords = async () => {
			let firstFilterOutput: Recette[] = []
			const {input, tags} = this.keyWords
			const regExp = new RegExp(input, "gi")

			allData.forEach((card:Recette) => {
				if (regExp.test(card.name) || regExp.test(card.description)) return firstFilterOutput.push(card)
				else {
					card.getIngredients.forEach((data) => {
						if (regExp.test(data.ingredient)) return firstFilterOutput.push(card)
					})
				}
			})

			if (!!tags.length) {
				for (const tag of tags) {
					const data = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : firstFilterOutput

					this.dataFilteredByTags = await FilterV1.advancedFilter(data, tag)
				}
			}
			const outputData = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : firstFilterOutput
			console.log(outputData)
			await DomFactory.resetDom()
			return await DomFactory.renderDOM(outputData)
		}
		observerSearchBar()
		observerTagContainer()
	}

	async init() {
		this.initialData = await this.api.fetch()
		const allReceipts = await this.mapData(this.initialData)
		await DomFactory.renderDOM(allReceipts)
		await this.handleTagSelection(allReceipts)
		this.globalObserver(allReceipts)
	}
}
