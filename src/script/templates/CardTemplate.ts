import {Recette} from "../models/Recette.js"

/**
 * @class CardTemplate
 * @classdesc Render HTML of Card Element
 */
export class CardTemplate {
	/**
	 * @type Recette
	 * @private
	 */
	private recette: Recette

	/**
	 * @param data : Recette
	 */
	constructor(data: Recette) {
		this.recette = data
	}

	/**
	 * @private
	 * @return HTMLDivElement
	 */
	private generateTitle(): HTMLDivElement {
		const timeIcon = document.createElement("span") as HTMLSpanElement
		timeIcon.classList.value = "fa-regular fa-clock"

		const time = document.createElement("p") as HTMLParagraphElement
		time.textContent = this.recette.time
		time.prepend(timeIcon)

		const title = document.createElement("h3") as HTMLHeadingElement
		title.textContent = this.recette.name

		const sectionTitle = document.createElement("section") as HTMLDivElement
		sectionTitle.classList.value = "recette__title"
		sectionTitle.appendChild(title)
		sectionTitle.appendChild(time)

		return sectionTitle
	}

	/**
	 * @private
	 * @return HTMLDivElement
	 */
	private generateInformations(): HTMLDivElement {
		const description = document.createElement("p") as HTMLParagraphElement
		description.classList.value = "recette__description"
		description.textContent = this.recette.description

		const ingredients = document.createElement("ul") as HTMLUListElement
		ingredients.classList.value = "recette__ingredients"

		this.recette.ingredients.map(i => {
			const ingredient = document.createElement("li") as HTMLLIElement

			const key = document.createElement("span") as HTMLSpanElement
			key.classList.value = "key"
			key.textContent = `${i.ingredient}`
			ingredient.appendChild(key)

			if (i.quantityUnit) {
				const value = document.createElement("span") as HTMLSpanElement
				value.classList.value = "value"
				value.textContent = ` : ${i.quantityUnit}`
				ingredient.appendChild(value)
			}

			ingredients.appendChild(ingredient)
		})

		const sectionInformation = document.createElement("section") as HTMLDivElement
		sectionInformation.classList.value = "recette__informations"
		sectionInformation.appendChild(ingredients)
		sectionInformation.appendChild(description)

		return sectionInformation
	}

	/**
	 * @private
	 * @return HTMLDivElement
	 */
	private generateBody(...children: HTMLDivElement[]): HTMLDivElement {
		const $children = [...children] as HTMLDivElement[]
		const $body = document.createElement("section") as HTMLDivElement
		$body.classList.value = "recette__body"
		$children.forEach(child => $body.appendChild(child))

		return $body
	}

	/**
	 * @return HTMLDivElement
	 */
	private generateHeader(): HTMLDivElement {
		return document.createElement("header") as HTMLDivElement
	}

	/**
	 * @param children : HTMLDivElement
	 * @return {HTMLDivElement}
	 */
	#generateCard(...children: HTMLDivElement[]): HTMLDivElement {
		const $children = [...children] as HTMLDivElement[]
		const $card = document.createElement("div") as HTMLDivElement
		$card.classList.value = "recette"
		$card.dataset.id = this.recette.id.toString()

		$children.forEach(child => $card.appendChild(child))

		return $card
	}

	/**
	 * @public
	 * @return HTMLDivElement
	 */
	render(): HTMLDivElement {
		const $informationsSection = this.generateInformations() as HTMLDivElement
		const $titleSection = this.generateTitle() as HTMLDivElement

		const $header = this.generateHeader() as HTMLDivElement
		const $body = this.generateBody($titleSection, $informationsSection) as HTMLDivElement

		return this.#generateCard($header, $body) as HTMLDivElement
	}
}
