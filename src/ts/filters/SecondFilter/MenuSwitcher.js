class MenuSwitcher {
	constructor(btn, parent, data) {
		this.btn = btn
		this.parent = parent
		this.data = data
	}

	buttonSwitchState() {
		const tags = new TagObserver(this.data, this.btn.parentNode)

		this.parent.forEach(f => {
			if (f === this.btn.parentNode) {
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
