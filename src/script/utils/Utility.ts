export class Utility {
	/**
	 * Capitalize first Letter of word
	 * @static
	 * @param word {string}
	 * @return {string}
	 */
	static firstLetterToUpperCase(word: string) {
		// words to array
		const words = word.toLowerCase().split(" ")

		// get first word
		const firstWord = words.splice(0, 1)

		// split letters of first word into an array
		const letters = firstWord[0].split("")

		// get the first letter of the first word
		const firstLetter = letters.splice(0, 1)

		// join the letters of the first word with first letter capitalized
		const joinFirstWord = [firstLetter[0].toUpperCase(), ...letters].join("")

		// join all words
		return [joinFirstWord, ...words].join(" ")
	}

	/**
	 * @static
	 * @param words {string}
	 * @return {string}
	 */
	static removeAccent(words: string) {
		const e = ["é", "è", "ê", "ë", "ē", "ė"]
		const a = ["à", "á", "â", "ä"]
		const i = ["î", "ï"]
		const o = ["ô", "ó", "ø"]
		const u = ["û", "ü", "ù", "ú"]
		words = words.toLowerCase()
		const letters = words.split("")
		const out = [] as string[]
		letters.map(letter => {
			e.forEach(voy => (letter = letter === voy ? "e" : letter))
			a.forEach(voy => (letter = letter === voy ? "a" : letter))
			i.forEach(voy => (letter = letter === voy ? "i" : letter))
			o.forEach(voy => (letter = letter === voy ? "o" : letter))
			u.forEach(voy => (letter = letter === voy ? "u" : letter))
			letter = letter === "œ" ? "eu" : letter
			letter = letter === "ç" ? "c" : letter
			out.push(letter.toLowerCase())
		})
		return out.join("")
	}

	/**
	 * @static
	 * @param ms : number
	 * @return {Promise<unknown>}
	 */
	static async delay(ms : number): Promise<void> {
		return new Promise<void>(resolve => {
			setTimeout(() => {
				resolve()
			}, ms)
		})
	}
}
