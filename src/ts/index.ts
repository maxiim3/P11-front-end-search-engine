
import {App} from "./app"

const app = new App("data/recipes.json")
app.init().catch(e => new Error("Error on loading page" + e))

console.log("Testing")