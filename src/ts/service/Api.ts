export class Api {
	private readonly url: string

	constructor(url: string) {
		this.url = url
		console.log("Depuis API")
	}

	async fetch() {
		const promise = await fetch(this.url)
		return await promise.json()
	}
}
