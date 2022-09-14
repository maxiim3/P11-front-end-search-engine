/*
class FilterByTags {
	constructor(tag, data) {
		this.tag = tag
		this.data = data
		this.updatedData = []
	}

	async resetDom(data) {
		await DomFactory.resetDom()
		await DomFactory.renderDOM(data)
	}

	async filtering(data, tag) {
		return FilterV1.mainFilter(data, tag)
	}

	async allTags() {
		let data = this.updatedData[0] ? this.updatedData : this.data
		this.updatedData = await this.filtering(data, this.tag)

		return this.updatedData[0] ? this.updatedData : this.data
	}

	async update() {
		const newData = await this.allTags()
		console.log(this.updatedData)
	}
}
*/
