import {App} from "./app/App.js"

/**
 *
 * @type {App}
 */
const app = new App()

app.init().catch(e => console.error(e))

