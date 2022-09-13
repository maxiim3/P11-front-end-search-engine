import {Recette} from "../models/Recette"

export class CardTemplate {
	private data: Recette

	constructor(data: Recette) {
		this.data = data
	}

	generateCard(...children: HTMLDivElement[]) {
		const $children = [...children]
		const $card: HTMLDivElement = document.createElement("div") as HTMLDivElement
		$card.classList.value = "recette"
		$card.setAttribute("data-id", this.data?.id.toString())
		$children.forEach(child => $card.appendChild(child))

		return $card
	}

	generateBody(...children: HTMLDivElement[]): HTMLDivElement {
		const $children = [...children]
		const $body = document.createElement("section") as HTMLDivElement
		$body.classList.value = "recette__body"
		$children.forEach(child => $body.appendChild(child))

		return $body
	}

	generateHeader(): HTMLDivElement {
		return document.createElement("header") as HTMLDivElement
	}

	generateTitle(): HTMLDivElement {
		const timeIcon = document.createElement("span")
		timeIcon.classList.value = "fa-regular fa-clock"

		const time = document.createElement("p")
		time["textContent"] = this.data?.time
		time.prepend(timeIcon)

		const title = document.createElement("h3")
		title.textContent = this.data?.name

		const sectionTitle = document.createElement("section") as HTMLDivElement
		sectionTitle.classList.value = "recette__title"
		sectionTitle.appendChild(title)
		sectionTitle.appendChild(time)

		return sectionTitle
	}

	generateInformations(): HTMLDivElement {
		const description = document.createElement("p") as HTMLParagraphElement
		description.classList.value = "recette__description"
		description.textContent = this.data?.description

		const ingredients = document.createElement("ul") as HTMLUListElement
		ingredients.classList.value = "recette__ingredients"

		this.data.ingredients.forEach((i) => {
			const ingredient = document.createElement("li") as HTMLLIElement

			const key = document.createElement("span") as HTMLSpanElement
			key.classList.value = "key"
			key.textContent = `${i.ingredient}`
			ingredient.appendChild(key)

			if (i?.quantityUnit) {
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

	render() {
		const $header = this.generateHeader()
		const $informationsSection = this.generateInformations()
		const $titleSection = this.generateTitle()
		const $body = this.generateBody($titleSection, $informationsSection)

		return this.generateCard($header, $body)
	}
}
