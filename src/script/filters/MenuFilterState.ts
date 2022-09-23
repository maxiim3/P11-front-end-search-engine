import {Utility} from "../utils/Utility.js"
import {TagsTemplate} from "../templates/TagsTemplate.js"

export const enum StateEnums {
	Close = "close",
	Open = "open",
}

type StateType = {
	close: CloseMenu
	open: OpenMenu
}
type MousePositionProps = {x: number; y: number}
type ContainerPositionProps = {positionXLeft: number; width: number; positionYTop: number; height: number}

export class MenuFilterState {
	private readonly states: StateType
	protected currentState: CloseMenu | OpenMenu
	filter: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.states = {close: new CloseMenu(filter), open: new OpenMenu(filter)}
		this.currentState = this.states[StateEnums.Close]
	}

	setState(state: StateEnums.Open | StateEnums.Close) {
		return (this.currentState = this.states[state])
	}

	fire() {
		return this.currentState.fire()
	}
}

export class OpenMenu {
	state: StateEnums.Open
	filter: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.state = StateEnums.Open
	}

	setActive() {
		this.filter.dataset.open = "true"
		this.filter.tabIndex = 0
		this.filter.ariaHidden = "false"
		this.filter.focus()
		this.filter.dataset.color = this.filter.style.backgroundColor
		const inputSearch = this.filter.querySelector("input") as HTMLInputElement
		const tagWrapper = this.filter.querySelector("ul") as HTMLUListElement
		const $tags = [...tagWrapper.querySelectorAll("li")] as HTMLLIElement[]

		inputSearch.addEventListener("input", async () => {
			const query = Utility.removeAccent(inputSearch.value) as string
			$tags.map(async $tag => {
				const formatTagName = Utility.removeAccent($tag.innerText) as string
				if (formatTagName.includes(query)) $tag.setAttribute("data-hidden", "false")
				else $tag.setAttribute("data-hidden", "true")
			})
		})

		$tags.forEach($tag => {
			$tag.addEventListener("click", async () => {
				if ($tag.dataset.active === "false") {
					const tagTpl = new TagsTemplate($tag)
					await tagTpl.appendTag()
					inputSearch.value = ""
				}
			})
		})
	}

	async fire() {
		this.setActive()
	}
}

export class CloseMenu {
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

	fire() {
		this.setInactive()
	}
}

export class MenuSubject {
	observers: MenuFilterState[]
	filters: HTMLDivElement[]

	constructor() {
		this.observers = [] as MenuFilterState[]
		this.filters = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		this.filters.forEach(filter => this.observers.push(new MenuFilterState(filter)))
	}

	subscribe(observer: HTMLDivElement) {
		this.observers.filter(filter => filter.filter === observer)[0].setState(StateEnums.Open)
		document.addEventListener("keydown", ({key}) => {
			if (observer.dataset.open === "true") {
				if (key === "Escape" || key === "Enter") {
					this.unsubscribe(observer)
					this.fire()
				}
			}
		})
		document.addEventListener("click", ev => {
			if (observer.dataset.open === "true") {
				const mouseProps = this.getMousePosition(ev)
				const containerProps = this.getObserverPosition(observer)
				if (this.mouseInObserver(mouseProps, containerProps)) {
					return
				} else {
					this.unsubscribe(observer)
					this.fire()
				}
			}
		})
	}

	mouseInObserver(mouseProps: MousePositionProps, containerProps: ContainerPositionProps) {
		return (
			containerProps.positionXLeft < mouseProps.x &&
			mouseProps.x < containerProps.positionXLeft + containerProps.width &&
			containerProps.positionYTop < mouseProps.y &&
			mouseProps.y < containerProps.positionYTop + containerProps.height
		)
	}

	getObserverPosition(observer: HTMLDivElement): ContainerPositionProps {
		return {
			width: observer.clientWidth,
			height: observer.clientHeight,
			positionXLeft: observer.offsetLeft,
			positionYTop: observer.offsetTop - 10,
		}
	}

	getMousePosition(ev: MouseEvent): MousePositionProps {
		return {
			x: window.scrollX + ev.clientX,
			y: window.scrollY + ev.clientY,
		}
	}

	unsubscribe(observer: HTMLDivElement) {
		this.observers.filter(filter => filter.filter === observer)[0].setState(StateEnums.Close)
	}

	fire() {
		this.observers.forEach(observer => observer.fire())
	}
}
