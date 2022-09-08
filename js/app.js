class App {
	constructor() {
		this.url = "data/recipes.json"
		this.api = new Api(this.url)
	}

	async listenToUserInputs(data) {
		const observer = new Observer(data)
		await observer.fire()
	}

	async init() {
		const fetchedData = await this.api.fetch()
		await DomFactory.renderDOM(fetchedData)
		await this.listenToUserInputs(fetchedData)
	}
}

const app = new App()
app.init()
