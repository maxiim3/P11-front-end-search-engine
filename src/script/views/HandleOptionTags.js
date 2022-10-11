var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StringUtility } from "../utils/StringUtility.js";
export class HandleOptionTags {
    constructor(data) {
        this.recettes = data;
    }
    getAllIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            const allIngredients = [];
            this.recettes.map(recette => {
                recette.ingredients.forEach(({ ingredient }) => {
                    const ingredientFormatted = StringUtility.firstLetterToUpperCase(ingredient);
                    allIngredients.push(ingredientFormatted);
                });
            });
            return [...new Set(allIngredients)];
        });
    }
    getAllAppliance() {
        return __awaiter(this, void 0, void 0, function* () {
            const allAppliance = [];
            this.recettes.forEach(({ appliance }) => {
                const applianceFormatted = StringUtility.firstLetterToUpperCase(appliance);
                allAppliance.push(applianceFormatted);
            });
            return [...new Set(allAppliance)];
        });
    }
    getAllUstensiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUstensiles = [];
            this.recettes.forEach(recette => {
                recette.ustensiles.forEach(ustensile => {
                    const ustensileFormatted = StringUtility.firstLetterToUpperCase(ustensile);
                    allUstensiles.push(ustensileFormatted);
                });
            });
            return [...new Set(allUstensiles)];
        });
    }
    getAllOptionTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredients = (yield this.getAllIngredients());
            const appliance = (yield this.getAllAppliance());
            const ustensiles = (yield this.getAllUstensiles());
            return { ingredients, appliance, ustensiles };
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recettes.length !== 0) {
                const allOptionTags = yield this.getAllOptionTags();
                yield this.appendOptionTagsToEachFilter(Object.assign({}, allOptionTags));
            }
        });
    }
    appendOptionTagsToEachFilter(arrayOfTags) {
        return __awaiter(this, void 0, void 0, function* () {
            const $filterType = [...document.querySelectorAll(".filtres__list")];
            $filterType.forEach($filter => {
                const categoryName = $filter.dataset.filterName;
                const tags = [...arrayOfTags[categoryName]];
                tags.forEach(tag => {
                    const btn = document.createElement("button");
                    btn.textContent = tag;
                    btn.value = tag;
                    btn.dataset.filterType = categoryName;
                    const li = document.createElement("li");
                    li.dataset.value = StringUtility.removeAccent(tag);
                    li.dataset.visible = "true";
                    li.dataset.active = "true";
                    li.appendChild(btn);
                    $filter.appendChild(li);
                });
            });
        });
    }
}
//# sourceMappingURL=HandleOptionTags.js.map