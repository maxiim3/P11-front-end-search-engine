import {TagObserver} from "./TagObserver.js"
import {Utility} from "../utils/Utility.js"

export class MenuSwitcher {
	/**
	 * @private
	 * @type HTMLButtonElement
	 */
	#btn
	/**
	 * @private
	 * @type HTMLDivElement[]
	 */
	#tagContainers
	/**
	 * @private
	 * @type ParentNode
	 */
	#selectedNode
	/**
	 * @private
	 * @type TagObserver
	 */
	#TagObserver
	/**
	 * @private
	 * @type HTMLDivElement
	 */
	selectedContainer

	/**
	 * @requires TagObserver
	 * @param btn : HTMLButtonElement
	 */
	constructor(btn) {
		this.#btn = btn
		this.#tagContainers = [...document.querySelectorAll(".filtres__filtre")]
		this.#selectedNode = this.#btn.parentNode
		this.selectedContainer = this.#btn.parentElement
		//todo this.#btn.parentElement 
		//todo this.#btn.closest('element')
		this.#TagObserver = new TagObserver(this.#selectedNode) 
	}

	/**
	 * @description Handle Open/Close Drop Down Menu
	 * @requires TagObserver
	 */
	async #handleFilterMenuState() {
	/*	this.selectedContainer = this.#tagContainers.filter(
			tagContainer => tagContainer === this.#selectedNode,
		)[0]*/
		await this.#handleOtherContainers()
		await this.#handleSelectedContainer()
		this.#TagObserver.fire()
	}

	async #handleSelectedContainer() {
		this.selectedContainer = this.#tagContainers.filter(
			tagContainer => tagContainer === this.#selectedNode
		)[0]
		this.#setContainerActive()
		this.#TagObserver.subscribe(this.selectedContainer)
		// await this.selectedContainer.addEventListener("click", async () => this.#handleFocusEvent())
		await this.selectedContainer.addEventListener("click", this.#handleFocusEvent(this)) // passe this dans la fonction
		// document.addEventListener("keydown", e => this.handleOnEscape(e), {once: true})
	}

	#handleOtherContainers() {
		this.#tagContainers
			.filter(tagContainer => tagContainer !== this.selectedNode)
			.forEach(container => {
				this.#disableContainer(container)
				this.#TagObserver.unsubscribe(container)
			})
	}

	#setContainerActive() {
		this.selectedContainer.dataset.open = "true"
		this.selectedContainer.tabIndex = 0
		this.selectedContainer.ariaHidden = "false"
		this.selectedContainer.focus()
		this.selectedContainer.dataset.color = this.selectedContainer.style.backgroundColor
	}

	#disableContainer = container => {
		container.dataset.open = "false"
		container.ariaHidden = true
		container.blur()

		/*todo Events Listener not removed*/
		/*document.removeEventListener("keydown", this.handleOnEscape)*/
		container.removeEventListener("click",this.#handleFocusEvent)
	}

	/**
	 * todo - Implementer un state pattern qui va gérer les menus en fonctions de 2 etats
	 * ## STATS
	 *  - OPEN
	 *  - CLOSE
	 *  
	 * ## EVENTS:
	 *  - (A) : EVENT LISTENER (CLICK ON TAG || CLICK OUT OF THE BOX || CLICK ON ESCAPE ==> CHANGE STATE TO BTN.PARENT_ELEMENT : CLOSED) + TODO??(HANDLE ADD TAGS AND HANDLE FILTER SEARCH BAR ??) == SUBSCRIBE/UNSUBSCIBRE
	 *  - (B) : EVENT LISTENER CLICK => CHANGE STATE TO BTN.PARENT_ELEMENT : OPEN + + TODO??(REMOVE HANDLE ADD TAGS AND HANDLE FILTER SEARCH BAR ??) == SUBSCRIBE/UNSUBSCIBE
	 *
	 *  1 - IF STATE MENU IS CLOSED  --> 	- ADD (B ON THIS) / REMOVE (A ON THIS)
	 *
	 * 	2 - IF STATE MENU IS OPEN	  -->   - ADD (A ON THIS) / REMOVE (B ON THIS) / ALL OTHERS ARE STATE : CLOSED
	 * @param that
	 * @return {Promise<void>}
	 */
	async #handleFocusEvent(that) { // this = node / param this / renommé that === class
		console.log(that.selectedContainer)
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
		document.addEventListener("mousemove", ev => this.#mousePosition(ev, containerProps))
		that.#disableContainer(that.selectedContainer)
		that.#TagObserver.unsubscribe(that.selectedContainer)
	}

	#mousePosition(ev, {height, positionXLeft, positionYTop, width}) {
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
			this.selectedContainer.style.backgroundColor = "gray"
		else {
			this.selectedContainer.style.backgroundColor = this.selectedContainer.dataset.color
			// todo Appelle nxfiltres
			/*document.addEventListener("click", () => {
				this.#tagContainers.forEach(container => {
					this.#disableContainer(container)
					this.#TagObserver.unsubscribe(container)
				})
			})*/
		}
	}

	// todo
	#handleOnEscape(e) {
		if (e.key === "Escape") {
			this.#disableContainer(this.selectedContainer)
		}
	}

	/**
	 * @description Switch states of drop down tags menu
	 */
	async update() {
		await this.#handleFilterMenuState()
	}
}
