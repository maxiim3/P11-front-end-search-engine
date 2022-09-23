var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Utility } from "./Utility.js";
export class FilterV1 {
    constructor(data, { input, tags }) {
        this.recettes = data;
        this.input = input;
        this.tags = tags;
        this.filteredByTags = [];
    }
    filterBy(type, input, recettes) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            switch (type) {
                case "ingredients":
                    recettes.forEach(recette => {
                        recette.ingredients.map(({ ingredient }) => Utility.removeAccent(ingredient).includes(input) && result.push(recette));
                    });
                    return result;
                case "ustensiles":
                    recettes.forEach(recette => recette.ustensiles.map(ustensile => Utility.removeAccent(ustensile).includes(input) && result.push(recette)));
                    return result;
                default:
                    return recettes.filter(recette => Utility.removeAccent(recette[type]).includes(input));
            }
        });
    }
    recursiveFiltering(tags, dataAccumulator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tags.length !== 0) {
                const firstTag = tags[0];
                const query = firstTag.innerText.toString();
                const tagTypeDataset = firstTag.getAttribute("data-tag");
                const tagValue = Utility.removeAccent(query);
                const tagType = Utility.removeAccent(tagTypeDataset);
                const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.recettes];
                const filterResult = yield this.filterBy(tagType, tagValue, data);
                tags.shift();
                yield this.recursiveFiltering(tags, filterResult);
            }
            else {
                this.filteredByTags = [...dataAccumulator];
            }
        });
    }
    filterBySearch() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterByName = yield this.filterBy("name", this.input, this.recettes);
            if (filterByName.length !== 0)
                return filterByName;
            else {
                const filterByDescription = yield this.filterBy("description", this.input, this.recettes);
                if (filterByDescription.length !== 0)
                    return filterByDescription;
                else {
                    const filterByIngredients = yield this.filterBy("ingredients", this.input, this.recettes);
                    if (filterByIngredients.length !== 0)
                        return filterByIngredients;
                    else
                        return [];
                }
            }
        });
    }
    filterByTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTags = [...this.tags];
            const output = [];
            yield this.recursiveFiltering(allTags, output);
            return this.filteredByTags;
        });
    }
}
//# sourceMappingURL=FilterV1.js.map