import { MenuContextOpen } from "./MenuContextOpen.js";
import { MenuContextClose } from "./MenuContextClose.js";
export class MenuObserver {
    constructor(filter) {
        this.filter = filter;
        this.states = { close: new MenuContextClose(filter), open: new MenuContextOpen(filter) };
        this.currentState = this.states["close"];
    }
    setState(state) {
        return (this.currentState = this.states[state]);
    }
    callContext() {
        return this.currentState.handleContext();
    }
}
//# sourceMappingURL=MenuObserver.js.map