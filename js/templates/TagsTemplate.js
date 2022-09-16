class TagsTemplate {
	/**
	 * render a tag element in tag Wrapper from selected tag in filter drop down menu
	 * @param tag : HTMLLIElement
	 */
	constructor(tag) {
		this.tag = tag
		this.$tagsContainer = document.querySelector("#tagsWrapper")
	}

	async createTag() {
		const {textContent: value, dataset} = this.tag

		const $icon = document.createElement("span")
		$icon.classList.value = "fa-regular fa-circle-xmark icon"
		$icon.ariaHidden = "true"

		const $btn = document.createElement("button")
		$btn.classList.value = "tag__btn"
		$btn.appendChild($icon)

		const $p = document.createElement("p")
		$p.classList.value = "tag__text"

		const $tag = document.createElement("li")
		$tag.classList.value = "tag"
		$tag.dataset.tag = dataset.filterType
		$tag.textContent = value
		$tag.appendChild($p)
		$tag.appendChild($btn)

		return $tag
	}

	/**
	 * @description append tag to selected tag wrapper | handle tag delete on click
	 * @return {Promise<HTMLLIElement>}
	 */
	async appendTag() {
		const $tag = await this.createTag()
		if (this.$tagsContainer.childNodes.length < 3) {
			this.$tagsContainer.appendChild($tag)
			this.tag.dataset.active = "true"
			this.tag.disabled = true
			$tag.querySelector(".tag__btn").addEventListener("click", e => {
				this.tag.dataset.active = "false"
				this.tag.disabled = false
				this.$tagsContainer.removeChild($tag)
			})
			return $tag
		}
	}
}
