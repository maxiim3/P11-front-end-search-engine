export class TagsTemplate {
	private readonly tag: HTMLLIElement
	private $tagsContainer: HTMLDivElement

	constructor(tag: HTMLLIElement) {
		this.tag = tag
		this.$tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
	}

	createTag(): HTMLLIElement {
		const {textContent: value, dataset} = this.tag

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
		$tag.dataset.tag = dataset.filterType
		$tag.textContent = value
		$tag.appendChild($p)
		$tag.appendChild($btn)

		return $tag
	}

	appendTag(): HTMLLIElement | void {
		if (this.$tagsContainer.childNodes.length < 3) {
			const $tag = this.createTag()
			this.$tagsContainer.appendChild($tag)
			this.tag.dataset.active = "true"
			this.tag.setAttribute("disabled", "true")
			const $button = $tag.querySelector(".tag__btn") as HTMLButtonElement

			$button.addEventListener("click", () => {
				this.tag.dataset.active = "false"
				this.tag.setAttribute("disabled", "false")
				this.$tagsContainer.removeChild($tag)
			})
			return $tag
		}
	}
}
