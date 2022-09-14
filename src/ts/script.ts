const fetchData = async (url: string) => {
	const promise = await fetch(url)

	const output: Promise<JSONRecette[]> = await promise.json()
	return output
}

class App {
	/*
	 private keyWords = {
	 input: "",
	 tags: [],
	 }
	 */

	constructor() {}

	async mapData(data: JSONRecette[]): Promise<Recette[]> {
		console.log("data")
		return data.map((d: JSONRecette) => new Recette(d))
	}

	/*handleTagSelection = async (data: Recette[]) => {
	 const buttons = [...document.querySelectorAll(".filtres__button")] as HTMLButtonElement[]
	 const filters = [...document.querySelectorAll(".filtres__filtre")] as HTMLLIElement[]

	 buttons.forEach(btn => {
	 const switcher = new MenuSwitcher(btn, filters, data)

	 btn.addEventListener("click", e => {
	 e.preventDefault()
	 switcher.update()
	 })
	 })
	 }*/

	/*removeTags() {
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
	 }*/

	/*globalObserver(allData: Recette[]) {
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

	 /!*await DomFactory.resetDom()
	 return await DomFactory.renderDOM(outputData)*!/
	 }
	 observerSearchBar()
	 observerTagContainer()
	 }*/

	async init() {
		const initialData: JSONRecette[] = await fetchData("/src/data/recipes.json")
		const allReceipts: Recette[] = await this.mapData(initialData)
		// await DomFactory.renderDOM(allReceipts)
		console.log(allReceipts)
		// await this.handleTagSelection(allReceipts)
		// this.globalObserver(allReceipts)
	}
}

console.log("coucou")
const app = new App()
app.init()

type JSONRecette = {
	id: number
	name: string
	servings: number
	ingredients: {
		ingredient: string
		quantity: number
		unit: string | null
	}[]
	time: number
	description: string
	appliance: string
	ustensiles: string[]
}

type MappedIngredients = {
	ingredient: string
	quantityUnit: string | null | undefined
}

type RecetteOuput = {
	id: number
	name: string
	servings: number
	getIngredients: MappedIngredients[]
	time: string
	description: string
	appliance: string
	ustensiles: string[]
}

class Recette {
	private readonly _id
	private readonly _ustensiles
	private readonly _appliance
	private readonly _name
	private readonly _servings
	private ingredients
	private readonly _time
	private readonly _description

	constructor(data: JSONRecette) {
		this._id = data.id
		this._name = data.name
		this._servings = data.servings
		this.ingredients = data.ingredients
		this._time = data.time
		this._description = data.description
		this._appliance = data.appliance
		this._ustensiles = data.ustensiles
	}

	get id(): number {
		return this._id
	}

	get name(): string {
		return this._name
	}

	get servings(): number {
		return this._servings
	}

	/**
	 *
	 * @return {Object}
	 */
	get getIngredients(): MappedIngredients[] {
		const mappedData: MappedIngredients[] = []
		this.ingredients.map(data => {
			if (!data.quantity) mappedData.push({ingredient: data.ingredient, quantityUnit: null})
			else {
				let quantityUnit: string = !data.unit
					? `${data.quantity}`
					: `${data.quantity}${this.unitAdapter(data.unit)}`
				mappedData.push({ingredient: data.ingredient, quantityUnit})
			}
		})
		return mappedData
	}

	unitAdapter(unit: string | undefined | null): string | undefined | null {
		if (!unit) return ""
		if (unit === "grammes") return "g"
		if (unit === "cuillères à soupe") return "cs."
		if (unit === "cuillères à café") return "cc."
		if (unit.length > 3) return ` ${unit}`
		return unit
	}

	get time(): string {
		return `${this._time} min`
	}

	get description(): string {
		return this._description
	}

	get appliance(): string {
		return this._appliance
	}

	get ustensiles(): string[] {
		return this._ustensiles
	}
}
