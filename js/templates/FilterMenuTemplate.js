class FilterMenuTemplate {
	/**
	 * @param data : Recette[]
	 */
	constructor(data) {
		this.data = data
	}

	/**
	 *
	 * @return Promise<IngredientsConcat[]>
	 */
	async getAllIngredients() {
		const arr = []
		this.data.forEach(d => {
			d.getIngredients.forEach(({ingredient}) => {
				arr.push(Utility.firstLetterToUpperCase(ingredient))
			})
		})
		return [...new Set(arr)]
	}

	/**
	 *
	 * @return {Promise<string[]>}
	 */
	async getAllAppliance() {
		const arr = []
		this.data.forEach(d => {
			arr.push(d.appliance)
		})
		return [...new Set(arr)]
	}

	/**
	 *
	 * @return {Promise<string[]>}
	 */
	async getAllUstensiles() {
		const arr = []
		this.data.forEach(d => {
			d.ustensiles.forEach(ustensile => {
				arr.push(Utility.firstLetterToUpperCase(ustensile))
			})
		})
		return [...new Set(arr)]
	}

	/**
	 * @param filtres : Object
	 * @type ingredients : {IngredientsConcat[]}
	 * @type appliance : {string[]}
	 * @type ustensiles : {string[]}
	 * @return {Promise<void>}
	 */
	async renderItems(filtres) {
		const $categories = [...document.querySelectorAll(".filtres__list")]
		$categories.forEach($category => {
			const categoryName = $category.dataset.filterName
			const activeCategory = filtres[categoryName]

			activeCategory.forEach(item => {
				const li = document.createElement("li")
				li.textContent = item
				li.dataset.active = "false"
				li.dataset.filterType = $category.dataset.filterName
				$category.appendChild(li)
			})
		})
	}

	/**
	 *
	 * @return {Promise<void>}
	 */
	async render() {
		try {
			if (this.data.length !== 0) {
				const ingredients = await this.getAllIngredients()
				const appliance = await this.getAllAppliance()
				const ustensiles = await this.getAllUstensiles()
				await this.renderItems({ingredients, appliance, ustensiles})
			} else {
				throw new Error("There are no data...📀")
			}
		} catch (e) {
			return e
		}
	}
}
