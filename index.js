async function getOutput() {
	const promesse = await fetch("http://localhost:9821/api")
	return await promesse.json()
}

function addToHeader(node) {
	document.head.appendChild(node)
}

function createLink(link) {
	const script = document.createElement("script")
	script.src = link
	script.type = "module"
	script.defer = true

	return script
}

async function init() {
	const links = await getOutput()
	// console.log(links)
	links.forEach(link => {
		const $link = createLink(link)
		addToHeader($link)
	})
}

window.onload = () => {
	init().catch(e => e)
	console.log("header links loaded")
}
