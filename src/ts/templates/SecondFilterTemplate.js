"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondFilterTemplate = void 0;
const StringUtility_1 = require("../utils/StringUtility");
class SecondFilterTemplate {
    constructor(data) {
        this.data = data;
    }
    getAllIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            this.data.forEach(d => {
                var _a;
                // todo check filter debugger
                (_a = d === null || d === void 0 ? void 0 : d.ingredients) === null || _a === void 0 ? void 0 : _a.forEach(({ ingredient }) => {
                    arr.push(StringUtility_1.StringUtility.capitalize(ingredient));
                });
            });
            return [...new Set(arr)];
        });
    }
    getAllAppliance() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            this.data.forEach(d => {
                arr.push(d.appliance);
            });
            return [...new Set(arr)];
        });
    }
    getAllUstensiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            this.data.forEach(d => {
                d === null || d === void 0 ? void 0 : d.ustensiles.forEach(ustensile => {
                    arr.push(StringUtility_1.StringUtility.capitalize(ustensile));
                });
            });
            return [...new Set(arr)];
        });
    }
    renderItems(filtres) {
        return __awaiter(this, void 0, void 0, function* () {
            const $categories = [
                ...document.querySelectorAll(".filtres__list"),
            ];
            return $categories.forEach($category => {
                var _a;
                const categoryType = (_a = $category === null || $category === void 0 ? void 0 : $category.dataset) === null || _a === void 0 ? void 0 : _a.filterName;
                const activeCategory = filtres === null || filtres === void 0 ? void 0 : filtres[categoryType];
                activeCategory.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    li.dataset.active = "false";
                    li.dataset.filterType = $category.dataset.filterName;
                    $category.appendChild(li);
                });
            });
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredients = yield this.getAllIngredients();
            const appliance = yield this.getAllAppliance();
            const ustensiles = yield this.getAllUstensiles();
            return yield this.renderItems({ ingredients, appliance, ustensiles });
        });
    }
}
exports.SecondFilterTemplate = SecondFilterTemplate;
//# sourceMappingURL=SecondFilterTemplate.js.map