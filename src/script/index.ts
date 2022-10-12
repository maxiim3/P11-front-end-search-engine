import {App} from "./App.js"

const app = new App()
app.init().catch(e => console.error(e))

/**
 * todo Documentation de l'algo :
 * - isoler les fonctions qui concerne le filtre principal
 * - faire le test JSBench en passant des  parametres (recettes api) , faire le test avec des inputs (1 nom, 1 description, 1 ingredient)
 * -  faire la meme chose avec le second filtre
 */
// todo implementer V2 algo
// todo screen shot du benchmark avec DATA
// todo Version JS
