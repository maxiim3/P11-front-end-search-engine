class Keyboard {
	escape(e) {
		if (e.key === "Escape" || e.key === "Enter") {
			this.$searchBar.blur()
			document.removeEventListener("keydown", e => this.listenToKeyboard(e))
		}
	}


	closeWithKeyboard(e, dom) {
		if (e.key === "Escape") {
			dom.dataset.open = "false"
			document.removeEventListener("keydown", this.closeWithKeyboard)
		}
	}
}