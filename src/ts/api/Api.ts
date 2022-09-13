export class Api {
	private readonly url: string

	constructor(url: string) {
		this.url = url
	}

	async fetch() {
		const promise = await fetch(this.url)
		return await promise.json()
	}
}
