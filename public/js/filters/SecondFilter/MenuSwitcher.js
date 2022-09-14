import { TagObserver } from "./TagObserver";
export class MenuSwitcher {
    constructor(btn, filters, data) {
        this.btn = btn;
        this.allFilters = filters;
        this.parent = this.btn.parentNode;
        this.data = data;
    }
    buttonSwitchState() {
        const tags = new TagObserver(this.data, this.parent);
        this.allFilters.forEach(f => {
            if (f === this.parent) {
                f.dataset.open = "true";
                tags.subscribe(f);
            }
            else {
                f.dataset.open = "false";
                tags.unsubscribe(f);
            }
        });
        tags.fire();
    }
    update() {
        this.buttonSwitchState();
    }
}
//# sourceMappingURL=MenuSwitcher.js.map