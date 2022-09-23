import {StateEnums} from "./MenuObserver.js"
import {IContext} from "./IContext.js"

export class MenuContextClose implements IContext{
	state: StateEnums.Close
	filter: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.state = StateEnums.Close
	}

	setInactive() {
		this.filter.dataset.open = "false"
		this.filter.ariaHidden = "true"
		this.filter.blur()
		const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		const tagWrapper = this.filter.querySelector("ul") as HTMLUListElement
		const $tags = [...tagWrapper.querySelectorAll("li")] as HTMLLIElement[]
		inputSearch.value = ""
		$tags.forEach($tag => {
			$tag.setAttribute("data-hidden", "false")
		})
	}

	handleContext() {
		this.setInactive()
	}
}