class SecondFilterTemplate {
	constructor(data) {
		this.data = data
	}

	async getAllIngredients() {
		const arr = []
		this.data.forEach(d => {
			d.ingredients.forEach(({ingredient}) => {
				arr.push(StringUtility.capitalize(ingredient))
			})
		})
		return [...new Set(arr)]
	}

	async getAllAppliance() {
		const arr = []
		this.data.forEach(d => {
			arr.push(d.appliance)
		})
		return [...new Set(arr)]
	}

	async getAllUstensiles() {
		const arr = []
		this.data.forEach(d => {
			d.ustensiles.forEach(ustensile => {
				arr.push(StringUtility.capitalize(ustensile))
			})
		})
		return [...new Set(arr)]
	}

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

	async render() {
		const ingredients = await this.getAllIngredients()
		const appliance = await this.getAllAppliance()
		const ustensiles = await this.getAllUstensiles()
		await this.renderItems({ingredients, appliance, ustensiles})
	}
}
