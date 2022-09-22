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
var _a, _DomFactory_renderTagsFilter, _DomFactory_renderRecettesCards, _DomFactory_removeRecettesCards, _DomFactory_removeTagsFilter;
import { FilterMenuTemplate } from "./FilterMenuTemplate.js";
import { CardTemplate } from "./CardTemplate.js";
export class DomFactory {
    static resetDom() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(DomFactory, _a, "m", _DomFactory_removeRecettesCards).call(DomFactory);
            yield __classPrivateFieldGet(DomFactory, _a, "m", _DomFactory_removeTagsFilter).call(DomFactory);
        });
    }
    static renderDOM(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(DomFactory, _a, "m", _DomFactory_renderTagsFilter).call(DomFactory, data);
            yield __classPrivateFieldGet(DomFactory, _a, "m", _DomFactory_renderRecettesCards).call(DomFactory, data);
        });
    }
}
_a = DomFactory, _DomFactory_renderTagsFilter = function _DomFactory_renderTagsFilter(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const advancedFilter = new FilterMenuTemplate(data);
        return advancedFilter.render();
    });
}, _DomFactory_renderRecettesCards = function _DomFactory_renderRecettesCards(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return data.forEach(d => {
            const cardTemplate = new CardTemplate(d);
            const $card = cardTemplate.render();
            DomFactory.container.appendChild($card);
        });
    });
}, _DomFactory_removeRecettesCards = function _DomFactory_removeRecettesCards() {
    return __awaiter(this, void 0, void 0, function* () {
        DomFactory.container.innerHTML = "";
    });
}, _DomFactory_removeTagsFilter = function _DomFactory_removeTagsFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        return DomFactory.filters.forEach(filter => (filter.innerHTML = ""));
    });
};
DomFactory.container = document.querySelector(".container");
DomFactory.filters = [...document.querySelectorAll(".filtres__filtre ul")];
//# sourceMappingURL=DomFactory.js.map