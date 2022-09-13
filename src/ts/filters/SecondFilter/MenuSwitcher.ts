import {TagObserver} from "./TagObserver"

export class MenuSwitcher {
	private btn: HTMLButtonElement
	private readonly parent: HTMLLIElement
	private readonly data: Object[]
	private allFilters: HTMLLIElement[]

	constructor(btn: HTMLButtonElement, filters: HTMLLIElement[], data: Object[]) {
		this.btn = btn
		this.allFilters = filters
		this.parent = this.btn.parentNode as HTMLLIElement
		this.data = data
	}

	buttonSwitchState() {
		const tags = new TagObserver(this.data, this.parent)
		this.allFilters.forEach(f => {
			if (f === this.parent) {
				f.dataset.open = "true"
				tags.subscribe(f)
			} else {
				f.dataset.open = "false"
				tags.unsubscribe(f)
			}
		})
		tags.fire()
	}

	update() {
		this.buttonSwitchState()
	}
}
