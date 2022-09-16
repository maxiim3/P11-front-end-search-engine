const fetchData = async (url: string) => {
	const promise = await fetch(url)

	const output: Promise<JSONRecette[]> = await promise.json()
	return output
}

class App {
	constructor() {}

	async mapData(data: JSONRecette[]): Promise<Recette[]> {
		return data.map((d: JSONRecette) => new Recette(d))
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
		const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLUListElement

		if ($tagsContainer.childNodes) {
			const $selectedTags = [...$tagsContainer.childNodes] as HTMLLIElement[]
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

	globalObserver(allData: Recette[]) {
		// console.log(allData)
		const keyWords = {
			input: "" as string,
			tags: [] as HTMLLIElement[],
		}

		const observerSearchBar = () => {
			const $mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
			$mainSearchBar.addEventListener("input", async () => {
				this.removeTags()
				keyWords.input = $mainSearchBar.value.toLowerCase() as string
				const filteredData = await FilterKeyWords()
				await DomFactory.resetDom()
				await DomFactory.renderDOM(filteredData)
			})
		}
		const FilterKeyWords = async () => {
			const {input, tags} = keyWords
			const regExp = new RegExp(input, "gi")
			const dataThroughFirstFilter = [] as Recette[]
			// const dataThroughSecondFilter: Recette[] = []

			allData.filter(card => regExp.test(card.name) && dataThroughFirstFilter.push(card))
			allData.filter(card => regExp.test(card.description) && dataThroughFirstFilter.push(card))
			allData.map(card => {
				card.getIngredients.forEach(({ingredient}: MappedIngredients) => {
					if (regExp.test(ingredient)) dataThroughFirstFilter.push(card)
				})
			})
			const filteredData = dataThroughFirstFilter.length > 0 ? [...new Set(dataThroughFirstFilter)] : [...allData]

			if (!!tags) {
				const allTags: HTMLLIElement[] = [...tags]
					const output: Recette[] = []
				const filterRec = await recursiveFiltering(filteredData, allTags, output)
				console.log( filterRec)
				async function recursiveFiltering(data: Recette[], tags: HTMLLIElement[], result : Recette[]): Promise<Recette[] | any> {
					if (tags.length === 0) {
						if (result.length === 0) return data
						return result
					} else {
						const tagValue = tags[0].textContent as string
						const pattern = new RegExp(tagValue.toLowerCase(), "gi")
						const tagType = tags[0].dataset.tag as string

						data.forEach(card => {
							switch (tagType) {
								case "ingredients":
									card.getIngredients.forEach(({ingredient}: MappedIngredients) => {
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
							const newTags: HTMLLIElement[] | any = tags.length > 0 ? tags.shift() : []
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
		const observerTagContainer = () => {
			const config = {
				attributes: true,
				characterDataOldValue: true,
				childList: true,
				subtree: true,
			}
			const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
			const observer = new MutationObserver(async mutationRecords => {
				const tags: HTMLLIElement[] = [...mutationRecords[0].target.childNodes] as HTMLLIElement[]
				keyWords.tags = []
				tags.forEach(tag => keyWords.tags.push(tag))
				await FilterKeyWords()
			})
			observer.observe($tagsContainer, config)
		}

		observerSearchBar()
		observerTagContainer()
	}

	async init() {
		const initialData: JSONRecette[] = await fetchData("/src/data/recipes.json")
		const allReceipts: Recette[] = await this.mapData(initialData)
		await DomFactory.renderDOM(allReceipts)
		await this.handleTagSelection(allReceipts)
		this.globalObserver(allReceipts)
	}
}

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

class DomFactory {
	static async renderTagsFilter(data: Recette[]): Promise<void> {
		const advancedFilter = new SecondFilterTemplate(data)
		return advancedFilter.render()
	}

	static async renderRecettesCards(data: Recette[]) {
		return data.forEach(d => {
			const cardTemplate = new CardTemplate(d)
			const $card = cardTemplate.render()
			const container = document.querySelector(".container") as HTMLDivElement
			return container.appendChild($card)
		})
	}

	static async removeRecettesCards() {
		const container = document.querySelector(".container") as HTMLDivElement
		return (container.innerHTML = "")
	}

	static async removeTagsFilter() {
		return [...document.querySelectorAll(".filtres__filtre ul")].forEach(filter => (filter.innerHTML = ""))
	}

	static async resetDom() {
		await DomFactory.removeRecettesCards()
		await DomFactory.removeTagsFilter()
	}

	static async renderDOM(data: Recette[]) {
		await DomFactory.renderTagsFilter(data)
		await DomFactory.renderRecettesCards(data)
	}
}

class SecondFilterTemplate {
	private data: Recette[]

	constructor(data: Recette[]) {
		this.data = data
	}

	async getAllIngredients(): Promise<string[]> {
		const arr: string[] = []
		// todo check filter debugger
		this.data.forEach(({getIngredients}: Recette) =>
			getIngredients.forEach(({ingredient}: MappedIngredients) => arr.push(StringUtility.capitalize(ingredient)))
		)
		return [...new Set(arr)]
	}

	async getAllAppliance(): Promise<string[]> {
		const arr: string[] = []
		this.data.forEach(d => {
			arr.push(d.appliance)
		})
		return [...new Set(arr)]
	}

	async getAllUstensiles(): Promise<string[]> {
		const arr: string[] = []
		this.data.forEach(d => {
			d?.ustensiles.forEach(ustensile => {
				arr.push(StringUtility.capitalize(ustensile))
			})
		})
		return [...new Set(arr)]
	}

	async renderItems(filtres: {ingredients: string[]; appliance: string[]; ustensiles: string[]}): Promise<void> {
		const $categories: HTMLDivElement[] = [...document.querySelectorAll(".filtres__list")] as HTMLDivElement[]
		return $categories.forEach($category => {
			// @ts-ignore
			const categoryType: string = $category?.dataset?.filterName
			// @ts-ignore
			const activeCategory: any[] = filtres?.[categoryType]

			activeCategory.forEach(item => {
				const li = document.createElement("li")
				li.textContent = item
				li.dataset.active = "false"
				li.dataset.filterType = $category.dataset.filterName
				$category.appendChild(li)
			})
		})
	}

	async render(): Promise<void> {
		const ingredients: string[] = await this.getAllIngredients()
		const appliance: string[] = await this.getAllAppliance()
		const ustensiles: string[] = await this.getAllUstensiles()
		return await this.renderItems({ingredients, appliance, ustensiles})
	}
}

class StringUtility {
	/**
	 * Capitalize first Letter of word
	 * @param word {string}
	 * @return {string}
	 */
	static capitalize(word: string): string {
		// words to array
		const words = word.toLowerCase().split(" ")

		// get first word
		const firstWord = words.splice(0, 1)

		// split letters of first word into an array
		const letters = firstWord[0].split("")

		// get the first letter of the first word
		const firstLetter = letters.splice(0, 1)

		// join the letters of the first word with first letter capitalized
		const joinFirstWord = [firstLetter[0].toUpperCase(), ...letters].join("")

		// join all words
		return [joinFirstWord, ...words].join(" ")
	}
}

class CardTemplate {
	private data: Recette

	constructor(data: Recette) {
		this.data = data
	}

	generateCard(...children: HTMLDivElement[]) {
		const $children = [...children]
		const $card: HTMLDivElement = document.createElement("div") as HTMLDivElement
		$card.classList.value = "recette"
		$card.setAttribute("data-id", this.data?.id.toString())
		$children.forEach(child => $card.appendChild(child))

		return $card
	}

	generateBody(...children: HTMLDivElement[]): HTMLDivElement {
		const $children = [...children]
		const $body = document.createElement("section") as HTMLDivElement
		$body.classList.value = "recette__body"
		$children.forEach(child => $body.appendChild(child))

		return $body
	}

	generateHeader(): HTMLDivElement {
		return document.createElement("header") as HTMLDivElement
	}

	generateTitle(): HTMLDivElement {
		const timeIcon = document.createElement("span")
		timeIcon.classList.value = "fa-regular fa-clock"

		const time = document.createElement("p")
		time["textContent"] = this.data?.time
		time.prepend(timeIcon)

		const title = document.createElement("h3")
		title.textContent = this.data?.name

		const sectionTitle = document.createElement("section") as HTMLDivElement
		sectionTitle.classList.value = "recette__title"
		sectionTitle.appendChild(title)
		sectionTitle.appendChild(time)

		return sectionTitle
	}

	generateInformations(): HTMLDivElement {
		const description = document.createElement("p") as HTMLParagraphElement
		description.classList.value = "recette__description"
		description.textContent = this.data?.description

		const ingredients = document.createElement("ul") as HTMLUListElement
		ingredients.classList.value = "recette__ingredients"

		this.data.getIngredients.forEach(i => {
			const ingredient = document.createElement("li") as HTMLLIElement

			const key = document.createElement("span") as HTMLSpanElement
			key.classList.value = "key"
			key.textContent = `${i.ingredient}`
			ingredient.appendChild(key)

			if (i?.quantityUnit) {
				const value = document.createElement("span") as HTMLSpanElement
				value.classList.value = "value"
				value.textContent = ` : ${i.quantityUnit}`
				ingredient.appendChild(value)
			}

			ingredients.appendChild(ingredient)
		})

		const sectionInformation = document.createElement("section") as HTMLDivElement
		sectionInformation.classList.value = "recette__informations"
		sectionInformation.appendChild(ingredients)
		sectionInformation.appendChild(description)

		return sectionInformation
	}

	render() {
		const $header = this.generateHeader()
		const $informationsSection = this.generateInformations()
		const $titleSection = this.generateTitle()
		const $body = this.generateBody($titleSection, $informationsSection)

		return this.generateCard($header, $body)
	}
}

class TagsTemplate {
	private readonly tag: HTMLLIElement
	private $tagsContainer: HTMLDivElement

	constructor(tag: HTMLLIElement) {
		this.tag = tag
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
	}

	createTag(): HTMLLIElement {
		const {textContent: value, dataset} = this.tag

		const $icon = document.createElement("span") as HTMLSpanElement
		$icon.classList.value = "fa-regular fa-circle-xmark icon"
		$icon.ariaHidden = "true"

		const $btn = document.createElement("button") as HTMLButtonElement
		$btn.classList.value = "tag__btn"
		$btn.appendChild($icon)

		const $p = document.createElement("p") as HTMLParagraphElement
		$p.classList.value = "tag__text"

		const $tag = document.createElement("li") as HTMLLIElement
		$tag.classList.value = "tag"
		$tag.dataset.tag = dataset.filterType
		$tag.textContent = value
		$tag.appendChild($p)
		$tag.appendChild($btn)

		return $tag
	}

	appendTag(): HTMLLIElement | void {
		if (this.$tagsContainer.childNodes.length < 3) {
			const $tag = this.createTag()
			this.$tagsContainer.appendChild($tag)
			this.tag.dataset.active = "true"
			this.tag.setAttribute("disabled", "true")
			const $button = $tag.querySelector(".tag__btn") as HTMLButtonElement

			$button.addEventListener("click", () => {
				this.tag.dataset.active = "false"
				this.tag.setAttribute("disabled", "false")
				this.$tagsContainer.removeChild($tag)
			})
			return $tag
		}
	}
}

class TagObserver {
	protected data: Object[]
	private filterWrapper: HTMLLIElement
	private observers: HTMLLIElement[]
	protected tags: HTMLLIElement[]

	constructor(data: Object[], filterWrapper: HTMLLIElement) {
		this.data = data
		this.filterWrapper = filterWrapper
		this.observers = []
		this.tags = []
	}

	subscribe(obs: HTMLLIElement) {
		this.observers.push(obs)
	}

	unsubscribe(obs: HTMLLIElement) {
		const index = this.observers.indexOf(obs)
		this.observers.slice(index, 1)
		const input = obs.querySelector("input") as HTMLInputElement
		input.value = ""
		document.removeEventListener("input", this.updateListOfTags)
	}

	async updateListOfTags() {
		const tagListWrapper = this.filterWrapper.querySelector("ul") as HTMLUListElement
		const {filterName} = tagListWrapper.dataset
		const {value} = this.filterWrapper.querySelector("input") as HTMLInputElement
		if (filterName) this.tags = await FilterV1.handleTagFiltered(value, filterName)
	}

	selectTags() {
		this.tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if (!$tag.getAttribute("disabled")) {
					const tagTpl = new TagsTemplate($tag)
					tagTpl.appendTag()
					const directParent = $tag.parentNode as HTMLDivElement
					const grandParent = directParent.parentNode as HTMLDivElement
					const inputElement = grandParent.querySelector("input") as HTMLInputElement
					inputElement.value = ""
					await this.updateListOfTags()
				}
			})
		})
	}

	fire() {
		this.observers.forEach(obs => {
			this.tags = [...obs.querySelectorAll("li:not([data-hidden=true])")] as HTMLLIElement[]
			const input = obs.querySelector("input") as HTMLInputElement
			input.addEventListener("input", async () => {
				await this.updateListOfTags()
			})
			this.selectTags()
		})
	}
}

class MenuSwitcher {
	private btn: HTMLButtonElement
	private readonly parent: HTMLLIElement
	private readonly data: Object[]
	private allFilters: HTMLLIElement[]

	constructor(btn: HTMLButtonElement, filters: HTMLLIElement[], data: Object[]) {
		this.btn = btn
		this.allFilters = filters
		this.parent = this.btn.parentNode as HTMLLIElement
		this.data = data
	}

	buttonSwitchState() {
		const tags = new TagObserver(this.data, this.parent)
		this.allFilters.forEach(f => {
			if (f === this.parent) {
				f.dataset.open = "true"
				tags.subscribe(f)
			} else {
				f.dataset.open = "false"
				tags.unsubscribe(f)
			}
		})
		tags.fire()
	}

	update() {
		this.buttonSwitchState()
	}
}

class FilterV1 {
	static async handleTagFiltered(input: string, type: string): Promise<HTMLLIElement[]> {
		const pattern: RegExp = new RegExp(input, "gi")
		const selection: string = `ul[data-filter-name=${CSS.escape(type)}] li`
		const $tags: HTMLLIElement[] = [...document.querySelectorAll(selection)] as HTMLLIElement[]

		if (input.length === 0) $tags.forEach(tag => (tag.dataset.hidden = "false"))
		else
			$tags.forEach((tag: HTMLLIElement) => {
				const value = tag?.textContent?.toLowerCase()
				if (value && pattern.test(value)) tag.dataset.hidden = "false"
				else tag.dataset.hidden = "true"
			})
		return [...document.querySelectorAll(selection + "[data-hidden=false]")] as HTMLLIElement[]
	}
}
