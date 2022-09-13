"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const app = new app_1.App();
app.init().catch(e => new Error("Error on loading page" + e));
//# sourceMappingURL=index.js.map