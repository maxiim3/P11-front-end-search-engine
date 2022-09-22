var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_handleDataFromJson, _App_renderDOMOnLoad, _App_globalObserver;
import { Recette } from "../models/Recette.js";
import { Api } from "../api/Api.js";
import { TagHandler } from "../tags/TagHandler.js";
import { DomFactory } from "../templates/DomFactory.js";
import { Observer } from "../filters/Observer.js";
export class App {
    constructor() {
        _App_instances.add(this);
        this._fetchedData = [];
        this._allReceipts = [];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _App_instances, "m", _App_handleDataFromJson).call(this);
            yield __classPrivateFieldGet(this, _App_instances, "m", _App_renderDOMOnLoad).call(this);
            yield __classPrivateFieldGet(this, _App_instances, "m", _App_globalObserver).call(this);
        });
    }
}
_App_instances = new WeakSet(), _App_handleDataFromJson = function _App_handleDataFromJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = new Api("/src/json/recipes.json");
        this._fetchedData = yield api.fetchData();
        this._allReceipts = this._fetchedData.map(data => new Recette(data));
        return this._allReceipts;
    });
}, _App_renderDOMOnLoad = function _App_renderDOMOnLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        yield DomFactory.renderDOM(this._allReceipts);
    });
}, _App_globalObserver = function _App_globalObserver() {
    return __awaiter(this, void 0, void 0, function* () {
        yield TagHandler.handleDropDownMenuFilter();
        const globalObserver = new Observer(this._allReceipts);
        yield globalObserver.observeDomChange();
    });
};
//# sourceMappingURL=app.js.map