import {StateEnums} from "./MenuObserver.js"

export interface IContext {
	state: StateEnums.Close | StateEnums.Open
	filter: HTMLDivElement

	handleContext() : void
}