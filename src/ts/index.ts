
import {App} from "./app"

const app = new App()
app.init().catch(e => new Error("Error on loading page" + e))

console.log("BABEEEELL")