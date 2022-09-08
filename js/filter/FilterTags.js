class FilterTags {
	constructor(filterWrapper, data) {
		this.filterWrapper = filterWrapper
		this.type = this.filterWrapper.querySelector("ul").dataset.filterName
		this.data = data
		this.input = this.filterWrapper.querySelector("input").value
	}


	async filtering(data, input, type) {
		return await FilterV1.handleTagFiltered(data, input, type)
	}

	async updateFilter() {
		await this.filtering(this.data, this.input, this.type)
	}

	/*	constructor(data) {
			this.data = data
		}
	
		async updateData() {
			await DomFactory.renderDOM(this.data)
			// filter return filteredData || inputData
		}
	
		async appendTag(tag, li) {
			if (this.$tagsContainer.childNodes.length > 3)
				this.$tagsContainer.replaceChild(tag, this.$tagsContainer.lastChild)
			else this.$tagsContainer.appendChild(tag)
			this.handleTags(tag, li)
		}
	
		handleTags(tag, li) {
			tag.querySelector(".tag__btn").addEventListener("click", e =>
				this.removeTag(e, tag, li)
			)
		}
	
		async removeTag(e, tag, li) {
			e.preventDefault()
			this.$tagsContainer.removeChild(tag)
			li.disabled = false
			li.dataset.active = "false"
			document.removeEventListener("click", this.removeTag)
			await this.handleFilter()
		}
	
		async selectTag(li) {
			if (li.disabled) return
	
			await this.renderTags(li)
			li.dataset.active = "true"
			li.disabled = true
			this.closeDropDownMenu(li.parentNode.parentNode)
			await this.handleFilter()
		}
	
		async renderTags(li) {
			const {textContent: value, dataset} = li
	
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
	
			await this.appendTag($tag, li)
		}
	
		async handleFilter() {
			const tags = [...document.querySelectorAll(".tagsWrapper .tag")]
			for (const tag of tags) {
				const filter = new FilterV1(this.data, tag.textContent)
				await filter.filterV1()
			}
	
	
	
		}*/
}
