class FilterV3 {
	static async filter(input) {
		const pattern = new RegExp(input, "gi")
		const recettesCards = [...document.querySelectorAll(".container .recette")]

		recettesCards.forEach(card => {
			const cardId = `.recette[data-id=${CSS.escape(card.dataset.id)}]`
			const $target = document.querySelector(cardId)
			const {$title, $desc, ingredients} = checkers(card, cardId)

			if (testPattern($title) || testPattern($desc))
				$target.dataset.hidden = "false"
			else
				ingredients.forEach($ingredient => {
					if (testPattern($ingredient)) $target.dataset.hidden = "false"
					else $target.dataset.hidden = "true"
				})
		})

		function testPattern(key) {
			return pattern.test(key.textContent)
		}

		function checkers(card, cardId) {
			const $title = card.querySelector("h3")
			const $desc = card.querySelector(".recette__description")
			const ingredients = [...document.querySelectorAll(cardId + ".key")]
			return {$title, $desc, ingredients}
		}
	}
}
