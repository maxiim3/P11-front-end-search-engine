import {StateEnums} from "./MenuStateObserver"

export interface IContext {
	state: StateEnums.Close | StateEnums.Open
	filter: HTMLDivElement

	handleContext() : void
}