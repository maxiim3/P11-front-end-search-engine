var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Recette } from "../models/Recette.js";
import { Api } from "../api/Api.js";
import { DomFactoryMethods } from "../templates/DomFactoryMethods.js";
import { QuerySearch } from "../filters/QuerySearch.js";
import { MenuStateObserver } from "../filters/MenuStateObserver.js";
export class App {
    constructor() {
        this._fetchedData = [];
        this._allReceipts = [];
    }
    handleDataFromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const api = new Api("/src/json/recipes.json");
            this._fetchedData = yield api.fetchData();
            this._allReceipts = this._fetchedData.map(data => new Recette(data));
            return this._allReceipts;
        });
    }
    renderDOMOnLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DomFactoryMethods.renderDOM(this._allReceipts);
        });
    }
    handleMenuContext() {
        const filters = [...document.querySelectorAll(".filtres__filtre")];
        const contextObservers = [];
        filters.forEach(filter => contextObservers.push(new MenuStateObserver(filter)));
        contextObservers.forEach(obs => {
            const button = obs.filter.querySelector(".filtres__button");
            button.addEventListener("click", onClickOnFilter);
        });
        function onClickOnFilter() {
            const clickedObserver = contextObservers.filter(({ filter }) => {
                return filter.querySelector(".filtres__button") === this;
            })[0];
            contextObservers.forEach(observer => {
                if (observer === clickedObserver) {
                    observer.setState("open");
                }
                else {
                    observer.setState("close");
                }
            });
        }
    }
    handleDataUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const globalObserver = new QuerySearch(this._allReceipts);
            return yield globalObserver.observeDomChange();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleDataFromJson();
            yield this.renderDOMOnLoad();
            yield this.handleDataUpdate();
            return this.handleMenuContext();
        });
    }
}
//# sourceMappingURL=App.js.map