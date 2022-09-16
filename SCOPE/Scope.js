
class Scope {
	/**
	 * @description -  🌈 - La **référence** de la fonction est passée pour l'eventListener
	 * @description - On ne pourra pas utiliser les membres de la classes car le **scope (this) à changé** et fait référence à #document
	 * @description - ☀️ - On ne pourra retirer l'eventListener qu'en appelant la **référence de la fonction** (ie sans parenthèse "()")
	 * @description - 💥 - Si on fait removeEventListener en utilisant une **fonction fléchée** (ligne du dessous), celui-ci ne sera **pas retiré** (pas de référence à la fonction)
	 * */
	constructor() {
		this.message = "COUCOU"

		document.addEventListener("click", this.callWithoutParenthesis) // calls function reference 🌈
		document.addEventListener("click", () => this.callWithArrowFunction()) // execute function
		setTimeout(() => {
			console.log("\n %clisteners Removed \n", "font-weight: black; text-transform : uppercase; background-color: white; color: red; font-size: 32px")
			document.removeEventListener("click", this.callWithoutParenthesis) // ☀️
			/*document.removeEventListener("click", () => this.callWithoutParenthesis()) // 💥 Cette fois-ci ne retirera pas l' eventListener*/

			document.removeEventListener("click", this.callWithArrowFunction)
			/*document.removeEventListener("click", () => this.callWithArrowFunction()) // Même résultat que ☝️*/
		}, 3000)
	}

	callWithoutParenthesis() {
		console.warn("")
		console.dir(this) // Scopes #Document
		console.log('%c document.addEventListener("click", this.callWithoutParenthesis)', "color: tomato")
		console.log(this.message) // undefined
		console.log("\n")
	}

	callWithArrowFunction() {
		console.dir(this) // Scope Class
		console.log('%c document.addEventListener("click", () => this.callWithArrowFunction())', "color: lime")
		console.log(this.message) // "COUCOU"
		console.log("\n")
	}

}
new Scope()