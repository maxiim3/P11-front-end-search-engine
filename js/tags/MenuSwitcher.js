class MenuSwitcher {
	/**
	 * @requires TagObserver
	 * @param btn : HTMLButtonElement
	 */
	constructor(btn) {
		this.btn = btn
		this.tagContainers = [...document.querySelectorAll(".filtres__filtre")]
		this.selectedNode = this.btn.parentNode
		this.TagObserver = new TagObserver(this.selectedNode)
		this.selectedContainer = []
	}

	/**
	 * @description Handle Open/Close Drop Down Menu
	 * @requires TagObserver
	 */
	handleFilterMenuState = async () => {
		await this.handleSelectedContainer()
		await this.handleOtherContainers()
		this.TagObserver.fire()
	}

	async handleSelectedContainer() {
		this.selectedContainer = this.tagContainers.filter(
			tagContainer => tagContainer === this.selectedNode
		)[0]
		this.setContainerActive()
		this.TagObserver.subscribe(this.selectedContainer)
		this.selectedContainer.addEventListener("blur", () => this.handleFocusEvent(), {once: true})
		document.addEventListener("keydown", e => this.handleOnEscape(e), {once: true})
	}

	handleOtherContainers() {
		this.tagContainers
			.filter(tagContainer => tagContainer !== this.selectedNode)
			.forEach(container => {
				this.disableContainer(container)
				this.TagObserver.unsubscribe(container)
			})
	}

	handleFocusEvent = () => {
		this.disableContainer(this.selectedContainer)
		this.TagObserver.unsubscribe(this.selectedContainer)
	}

	handleOnEscape(e) {
		if (e.key === "Escape") {
			this.disableContainer(this.selectedContainer)
		}
	}

	setContainerActive = () => {
		this.selectedContainer.dataset.open = "true"
		this.selectedContainer.tabIndex = 0
		this.selectedContainer.ariaHidden = "false"
		this.selectedContainer.focus({"focus-visible": true})
	}

	disableContainer = container => {
		container.dataset.open = "false"
		container.ariaHidden = true
		container.blur()

		/*todo Events Listener not removed*/
		/*document.removeEventListener("keydown", this.handleOnEscape)*/
		// container.removeEventListener("focusout", () => this.handleFocusEvent())
	}

	/**
	 * @description Switch states of drop down tags menu
	 */
	update = async () => {
		await this.handleFilterMenuState()
	}


}
