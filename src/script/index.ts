import {App} from "./app/App.js"

/**
 *
 * @type {App}
 */
const app = new App()

app.init().catch(e => console.error(e))

// todo screen shot du benchmark avec DATA
// todo Version JS
// todo bug filtres