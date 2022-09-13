class FilterV2 {
	static async filter(data, input) {
		let output = []
		const pattern = new RegExp(input, "gi")

		for (let i = 0; i < data.length; i++) {
			const {$title, $desc, ingredients} = data[i]

			if (testPattern($title) || testPattern($desc)) output.push(data[i])
			else {
				for (let j = 0; j < ingredients.length; j++) {
					if (testPattern(ingredients[j].ingredient)) output.push(data[i])
				}
			}
		}

		function testPattern(key) {
			return pattern.test(key.textContent)
		}

		return output
	}
}
