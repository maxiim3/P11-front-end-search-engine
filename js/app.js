class App {

	constructor() {
		this.fetchedData = []
		this.allReceipts = []
	}

	/**
	 * @requires Recette
	 * @param fetchedData : Object[]
	 * @return {Promise<Recette[]>}
	 */
	async mapData(fetchedData) {
		return fetchedData.map(data => new Recette(data))
	}

	async handleDataFromJson() {
			this.fetchedData = await fetchData("data/recipes.json")
					this.allReceipts =
					 await this.mapData(this.fetchedData)
	}

	async renderDOMOnLoad() {
		await DomFactory.renderDOM(this.allReceipts)
	}

	globalObserver = async () => {
		await TagHandler.handleDropDownMenuFilter()
		const globalObserver = new Observer(this.allReceipts)
		await globalObserver.observeDomChange()
	}

	async init() {
		await this.handleDataFromJson()
		await this.renderDOMOnLoad()
		await this.globalObserver()

	}
}

const app = new App()
app.init().catch(e => console.error(e))


