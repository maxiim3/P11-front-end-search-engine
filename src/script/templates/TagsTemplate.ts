export class TagsTemplate {
	private readonly dataset: {filterType: string}
	private readonly textContent: string

	constructor({value, dataset}: inputTypeProps) {
		this.textContent = value
		this.dataset = dataset
	}

	createTag(): HTMLLIElement {
		const $icon = document.createElement("span") as HTMLSpanElement
		$icon.classList.value = "fa-regular fa-circle-xmark icon"
		$icon.ariaHidden = "true"

		const $btn = document.createElement("button") as HTMLButtonElement
		$btn.classList.value = "tag__btn"
		$btn.appendChild($icon)

		const $p = document.createElement("p") as HTMLParagraphElement
		$p.classList.value = "tag__text"

		const $tag = document.createElement("li") as HTMLLIElement
		$tag.classList.value = "tag"
		$tag.dataset.tag = this.dataset["filterType"]
		$tag.textContent = this.textContent
		$tag.appendChild($p)
		$tag.appendChild($btn)

		return $tag
	}
}

export type inputTypeProps = {
	value: string
	dataset: {filterType: string}
}
