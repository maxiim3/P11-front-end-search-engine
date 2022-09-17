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
		this.selectedContainer = this.tagContainers.filter(
			tagContainer => tagContainer === this.selectedNode
		)[0]
		await this.handleOtherContainers()
		await this.handleSelectedContainer()
		this.TagObserver.fire()
	}

	async handleSelectedContainer() {
		this.selectedContainer = this.tagContainers.filter(
			tagContainer => tagContainer === this.selectedNode
		)[0]
		this.setContainerActive()
		this.TagObserver.subscribe(this.selectedContainer)
		await this.selectedContainer.addEventListener("click", async () => this.handleFocusEvent())
		// document.addEventListener("keydown", e => this.handleOnEscape(e), {once: true})
	}

	handleOtherContainers() {
		this.tagContainers
			// .filter(tagContainer => tagContainer !== this.selectedNode)
			.forEach(container => {
				this.disableContainer(container)
				this.TagObserver.unsubscribe(container)
			})
	}

	setContainerActive = () => {
		this.selectedContainer.dataset.open = "true"
		this.selectedContainer.tabIndex = 0
		this.selectedContainer.ariaHidden = "false"
		this.selectedContainer.focus({"focus-visible": true})
		this.selectedContainer.dataset.color = this.selectedContainer.style.backgroundColor
	}

	disableContainer = container => {
		container.dataset.open = "false"
		container.ariaHidden = true
		container.blur()

		/*todo Events Listener not removed*/
		/*document.removeEventListener("keydown", this.handleOnEscape)*/
		// container.removeEventListener("focusout", () => this.handleFocusEvent())
	}

	handleFocusEvent = async () => {
		await Utility.delay(250)

		const text = this.selectedContainer.querySelector("button").textContent
		const formatText = Utility.removeAccent(text).split("")
		formatText.pop()
		const containerType = formatText.join("")

		const documentProps = {
			x: document.querySelector("html").clientWidth,
			y: document.querySelector("html").clientHeight,
		}

		const containerProps = {
			name: containerType,
			width: this.selectedContainer.clientWidth,
			height: this.selectedContainer.clientHeight,
			positionXLeft: this.selectedContainer.offsetLeft,
			positionYTop: this.selectedContainer.offsetTop - 10,
		}
		document.addEventListener("mousemove", ev => this.mousePosition(ev, containerProps), )
		// this.disableContainer(this.selectedContainer)
		// this.TagObserver.unsubscribe(this.selectedContainer)
	}

	mousePosition(ev, {height, positionXLeft, positionYTop, width}) {
		const mouseProps = {
			x: window.scrollX + ev.clientX,
			y: window.scrollY + ev.clientY,
		}
				
		if (
			positionXLeft < mouseProps.x &&
			mouseProps.x < positionXLeft + width &&
			positionYTop < mouseProps.y &&
			mouseProps.y < positionYTop + height
		)
			this.selectedContainer.style.backgroundColor = 'gray'
		else {
			this.selectedContainer.style.backgroundColor = this.selectedContainer.dataset.color
			document.addEventListener('click', () => {
				this.tagContainers
					.forEach(container => {
						this.disableContainer(container)
						this.TagObserver.unsubscribe(container)
					})
			})
		}
	}

	handleOnEscape(e) {
		if (e.key === "Escape") {
			this.disableContainer(this.selectedContainer)
		}
	}

	/**
	 * @description Switch states of drop down tags menu
	 */
	update = async () => {
		await this.handleFilterMenuState()
	}
	
}
