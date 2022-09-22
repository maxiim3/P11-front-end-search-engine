import {TagHandler} from "./TagHandler.js"

export class TagObserver {
	/**
	 * @private
	 * @type HTMLDivElement
	 */
	private readonly selectedTagContainer: HTMLDivElement
	/**
	 * @private
	 * @type HTMLDivElement[]
	 */
	private readonly observers: HTMLDivElement[]
	/**
	 * @private
	 * @type HTMLLIElement[]
	 */
	private tags: HTMLLIElement[]

	/**
	 * @requires TagHandler
	 * @requires TagsTemplate
	 * @description Observe Filters
	 * @param selectedTagContainer : ParentNode
	 */
	constructor(selectedTagContainer: HTMLDivElement) {
		this.selectedTagContainer = selectedTagContainer
		this.observers = []
		this.tags = []
	}

	/**
	 * @param obs : HTMLDivElement
	 */
	subscribe(obs: HTMLDivElement) {
		this.observers.push(obs)
	}

	/**
	 * @requires TagHandler
	 * @param obs : HTMLDivElement
	 */
	unsubscribe(obs: HTMLDivElement) {
		const index = this.observers.indexOf(obs)
		this.observers.slice(index, 1)
		let tagSearchForm = obs.querySelector("input") as HTMLInputElement
		tagSearchForm.value = ""
		document.removeEventListener("input", () => TagHandler.handleSearchForTags(obs))
	}

	/**
	 * @requires TagHandler
	 */
	fire() {
		if (this.observers.length === 1) {
			this.tags = TagHandler.getAllTags(this.observers[0])

			let tagSearchForm = this.observers[0].querySelector("input") as HTMLInputElement
			tagSearchForm.addEventListener(
				"input",
				async () => await TagHandler.handleSearchForTags(this.selectedTagContainer)
			)
			TagHandler.handleClickOnTags(this.tags, this.selectedTagContainer)
		}
	}
}
