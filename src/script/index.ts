import {App} from "./App.js"

const app = new App()

app.init()
	.then()
	.catch(e => console.error(e))

