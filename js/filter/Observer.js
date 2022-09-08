
class Observer {
	constructor(data) {
		this.data = data
		this.dataFromMainFilter = this.data
		this.$mainSearchBar = document.querySelector("#searchBar")
		this.buttons = [...document.querySelectorAll(".filtres__button")]
	}

	buttonSwitchState(e, btn) {
		const filters = [...document.querySelectorAll(".filtres__filtre")]
		const observer = new TagObserver(this.dataFromMainFilter, btn.parentNode)
		filters.forEach(f => {
			if (f === btn.parentNode) {
				f.dataset.open = "true"
				observer.subscribe(f)
			}
			else {
				f.dataset.open = "false"
				observer.unsubscribe(f)
			}
		})
		observer.fire()
	}

	listenToMainSearchBar = async () => {
		const filter = new FilterByMainSearch(this.data)
		this.dataFromMainFilter =  await filter.updateData()
	}

	async fire() {
		this.$mainSearchBar.addEventListener("input", this.listenToMainSearchBar)
		this.buttons.forEach(btn => {
			btn.addEventListener("click", (e) => this.buttonSwitchState(e, btn))
		})
	}
}
