import {MenuObserver, StateEnums} from "./MenuObserver.js"

type MousePositionProps = {x: number; y: number}
type ContainerPositionProps = {positionXLeft: number; width: number; positionYTop: number; height: number}

export class MenuSubject {
	observers: MenuObserver[]
	filters: HTMLDivElement[]

	constructor() {
		this.observers = [] as MenuObserver[]
		this.filters = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		this.filters.forEach(filter => this.observers.push(new MenuObserver(filter)))
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
		this.observers.forEach(observer => observer.callContext())
	}
}
