import {TagObserver} from "./TagObserver.js"
import {Utility} from "../utils/Utility.js"

type containerPropsTypes = {height: number; positionXLeft: number; positionYTop: number; width: number}

export class MenuSwitcher {
	/**
	 * @private
	 * @type HTMLButtonElement
	 */
	private btn
	/**
	 * @private
	 * @type HTMLDivElement[]
	 */
	private tagContainers
	/**
	 * @private
	 * @type TagObserver
	 */
	private readonly TagObserver
	/**
	 * @private
	 * @type HTMLDivElement
	 */
	private buttonParentContext

	/**
	 * @requires TagObserver
	 * @param btn : HTMLButtonElement
	 */
	constructor(btn: HTMLButtonElement) {
		this.btn = btn
		this.tagContainers = [...document.querySelectorAll(".filtres__filtre")] as HTMLDivElement[]
		this.buttonParentContext = this.btn.parentElement as HTMLDivElement
		this.TagObserver = new TagObserver(this.buttonParentContext) as TagObserver
	}

	/**
	 * @description Handle Open/Close Drop Down Menu
	 * @requires TagObserver
	 * @async
	 * @private
	 */
	private async handleFilterMenuState() {
		await this.handleOtherContainers()
		await this.handleSelectedContainer()
		this.TagObserver.fire()
	}

	private handleOtherContainers() {
		this.tagContainers
			.filter(tagContainer => tagContainer !== this.buttonParentContext)
			.forEach(container => {
				this.disableContainer(container)
				this.TagObserver.unsubscribe(container)
			})
	}

	private async handleSelectedContainer() {
		this.setContainerActive()
		this.TagObserver.subscribe(this.buttonParentContext)
		// await this.selectedContainer.addEventListener("click", async () => this.#handleFocusEvent())
		await this.buttonParentContext.addEventListener("click", () => this.handleFocusEvent(this)) // passe this dans la fonction
		// document.addEventListener("keydown", e => this.handleOnEscape(e), {once: true})
	}

	private setContainerActive() {
		this.buttonParentContext.dataset.open = "true"
		this.buttonParentContext.tabIndex = 0
		this.buttonParentContext.ariaHidden = "false"
		this.buttonParentContext.focus()
		this.buttonParentContext.dataset.color = this.buttonParentContext.style.backgroundColor
	}

	private disableContainer = (container: HTMLDivElement) => {
		container.dataset.open = "false"
		container.ariaHidden = "true"
		container.blur()

		/*todo Events Listener not removed*/
		/*document.removeEventListener("keydown", this.handleOnEscape)*/
		container.removeEventListener("click", () => this.handleFocusEvent(this))
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
	private async handleFocusEvent(that: this) {
		// this = node / param this / renommé that === class
		await Utility.delay(250)

		/*const text = that.btn.textContent as string*/
		/*		const formatText = Utility.removeAccent(text).split("")
				formatText.pop()
				const containerType = formatText.join("")*/

		/*	const documentProps = {
				x: document.querySelector("html").clientWidth,
				y: document.querySelector("html").clientHeight,
			}*/

		const containerProps = {
			/*			name: containerType,*/
			width: that.buttonParentContext.clientWidth,
			height: that.buttonParentContext.clientHeight,
			positionXLeft: that.buttonParentContext.offsetLeft,
			positionYTop: that.buttonParentContext.offsetTop - 10,
		}
		document.addEventListener("mousemove", ev => this.#mousePosition(ev, containerProps, that))
		that.disableContainer(that.buttonParentContext)
		that.TagObserver.unsubscribe(that.buttonParentContext)
	}

	#mousePosition(
		ev: MouseEvent,
		{height, positionXLeft, positionYTop, width}: containerPropsTypes,
		that: MenuSwitcher
	) {
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
			that.buttonParentContext.style.backgroundColor = "gray"
		else {
			const currentColor = that.buttonParentContext.dataset.color as string
			that.buttonParentContext.style.backgroundColor = CSS.escape(currentColor)
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
	/*	private handleOnEscape(e) {
			if (e.key === "Escape") {
				this.disableContainer(this.buttonParentContext)
			}
		}*/

	/**
	 * @description Switch states of drop down tags menu
	 */
	async update() {
		await this.handleFilterMenuState()
	}
}
