import {TagHandler} from "./TagHandler.js"

export class TagObserver {
	/**
	 * @private
	 * @type ParentNode
	 */
	#selectedTagContainer
	/**
	 * @private
	 * @type HTMLDivElement[]
	 */
	#observers
	/**
	 * @private
	 * @type HTMLLIElement[]
	 */
	#tags

	/**
	 * @requires TagHandler
	 * @requires TagsTemplate
	 * @description Observe Filters
	 * @param selectedTagContainer : ParentNode
	 */
	constructor(selectedTagContainer) {
		this.#selectedTagContainer = selectedTagContainer
		this.#observers = []
		this.#tags = []
	}

	/**
	 * @param obs : HTMLDivElement
	 */
	subscribe(obs) {
		this.#observers.push(obs)
	}

	/**
	 * @requires TagHandler
	 * @param obs : HTMLDivElement
	 */
	unsubscribe(obs) {
		const index = this.#observers.indexOf(obs)
		this.#observers.slice(index, 1)
		obs.querySelector("input").value = ""
		document.removeEventListener("input", TagHandler.handleSearchForTags)
	}

	/**
	 * @requires TagHandler
	 */
	fire() {
		if (this.#observers.length === 1) {
			this.#tags = TagHandler.getAllTags(this.#observers[0])
			this.#observers[0]
				.querySelector("input")
				.addEventListener(
					"input",
					async () => await TagHandler.handleSearchForTags(this.#selectedTagContainer)
				)
			TagHandler.handleClickOnTags(this.#tags, this.#selectedTagContainer)
		}
	}
}
