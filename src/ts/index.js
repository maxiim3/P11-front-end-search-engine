import {App} from "./app/app.js"

/**
 * 
 * @type {App}
 */
const app = new App()

app.init().catch(e => console.error(e))