export const enum StateEnums {
	Close = "close",
	Open = "open",
}

type StateType = {
	close: CloseMenu
	open: OpenMenu
}

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
	}

	fire() {
		this.setInactive()
	}
}

type MousePositionProps = {x: number; y: number}
type ContainerPositionProps = {positionXLeft: number; width: number; positionYTop: number; height: number}

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
					// todo handle add tags
					// handle input search
					return
				} else {
					this.unsubscribe(observer)
					this.fire()
					//todo empty input tags
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
