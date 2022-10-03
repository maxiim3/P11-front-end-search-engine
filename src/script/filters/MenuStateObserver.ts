import {MenuContextOpen} from "./MenuContextOpen.js"
import {MenuContextClose} from "./MenuContextClose.js"

export const enum StateEnums {
	Close = "close",
	Open = "open",
}

type StateType = {
	close: MenuContextClose
	open: MenuContextOpen
}

export class MenuStateObserver {
	private readonly states: StateType
	currentState: MenuContextClose | MenuContextOpen
	filter: HTMLDivElement

	constructor(filter: HTMLDivElement) {
		this.filter = filter
		this.states = {close: new MenuContextClose(filter), open: new MenuContextOpen(filter)}
		this.currentState = this.states[StateEnums.Close]
	}

	setState(state: StateEnums.Open | StateEnums.Close) {
		return (this.currentState = this.states[state])
	}

	callContext() {
		return this.currentState.handleContext()
	}
}

