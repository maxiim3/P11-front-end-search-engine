import {Api} from "../service/Api"
import {DomFactory} from "../templates/DomFactory"
import {MenuSwitcher} from "../filters/SecondFilter/MenuSwitcher"
import {JSONRecette, MappedIngredients, Recette} from "../models/Recette"

export class App {
	private api: Api
	protected url: string
	private initialData: JSONRecette[]
	private keyWords = {
		input: "",
		tags: [],
	}

	constructor(url: string) {
		console.log(this)
		this.url = url
		this.api = new Api(this.url)
		this.initialData = []
		console.log(this)
	}

	async mapData(data: JSONRecette[]): Promise<Recette[]> {
		return data.map(d => new Recette(d))
	}

	handleTagSelection = async (data: Recette[]) => {
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

	globalObserver(allData: Recette[]) {
		const config = {
			attributes: true,
			characterDataOldValue: true,
			childList: true,
			subtree: true,
		}
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

		const FilterKeyWords = async () => {
			/*let firstFilterOutput: Recette[] = []
			 const {input, tags} = this.keyWords
			 const regExp = new RegExp(input, "gi")

			 allData.forEach((card:Recette) => {
			 if (regExp.test(card.name) || regExp.test(card.description)) return firstFilterOutput.push(card)
			 else {
			 card.getIngredients.forEach(({ingredient, quantityUnit}: MappedIngredients) => {
			 if (regExp.test(ingredient)) return firstFilterOutput.push(card)
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
			 return await DomFactory.renderDOM(outputData)*/
			const {input, tags} = this.keyWords
			const regExp = new RegExp(input, "gi")

			allData
				.filter((card: Recette) => regExp.test(card.name) || (regExp.test(card.description) && card))
				.filter((card: Recette) =>
					card.getIngredients.forEach(({ingredient}: MappedIngredients) => regExp.test(ingredient) && card)
				)
				.some((card: Recette) => {
					if (!!tags.length) {
						for (let {textContent, dataset} of tags) {
							console.log(textContent, dataset, card)
						}
					}
				})

			/*await DomFactory.resetDom()
			 return await DomFactory.renderDOM(outputData)*/
		}
		observerSearchBar()
		observerTagContainer()
	}

	async init() {
		this.initialData = await this.api.fetch()
		const allReceipts: Recette[] = await this.mapData(this.initialData)
		await DomFactory.renderDOM(allReceipts)
		await this.handleTagSelection(allReceipts)
		this.globalObserver(allReceipts)
	}
}


const app = new App("data/recipes.json")

app.init().catch(e => new Error("Error on loading page" + e))
