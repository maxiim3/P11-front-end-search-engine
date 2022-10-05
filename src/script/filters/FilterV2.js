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
var _FilterV2_instances, _FilterV2_recursiveFiltering;
import { StringUtility } from "../utils/StringUtility.js";
export class FilterV2 {
    constructor(data, { input, tags }) {
        _FilterV2_instances.add(this);
        this.recettes = data;
        this.input = input;
        this.tags = tags;
        this.filteredByTags = [];
    }
    filterBy(type, input, recettes) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            if (type === "ingredients") {
                for (let i = 0; i < recettes.length; i++) {
                    for (const { ingredient } of recettes[i].ingredients) {
                        if (StringUtility.removeAccent(ingredient).includes(input))
                            result.push(recettes[i]);
                    }
                }
            }
            else if (type === "ustensiles") {
                for (let i = 0; i < recettes.length; i++) {
                    for (const ustensile of recettes[i].ustensiles) {
                        if (StringUtility.removeAccent(ustensile).includes(input))
                            result.push(recettes[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < recettes.length; i++) {
                    if (StringUtility.removeAccent(recettes[i][type]).includes(input))
                        result.push(recettes[i]);
                }
            }
            return result;
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
            yield __classPrivateFieldGet(this, _FilterV2_instances, "m", _FilterV2_recursiveFiltering).call(this, allTags, output);
            return this.filteredByTags;
        });
    }
}
_FilterV2_instances = new WeakSet(), _FilterV2_recursiveFiltering = function _FilterV2_recursiveFiltering(tags, dataAccumulator) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tags.length !== 0) {
            const firstTag = tags[0];
            const query = firstTag.innerText.toString();
            const tagTypeDataset = firstTag.getAttribute("data-tag");
            const tagValue = StringUtility.removeAccent(query);
            const tagType = StringUtility.removeAccent(tagTypeDataset);
            const data = dataAccumulator.length !== 0 ? [...dataAccumulator] : [...this.recettes];
            const filterResult = yield this.filterBy(tagType, tagValue, data);
            tags.shift();
            yield __classPrivateFieldGet(this, _FilterV2_instances, "m", _FilterV2_recursiveFiltering).call(this, tags, filterResult);
        }
        else {
            this.filteredByTags = [...dataAccumulator];
        }
    });
};
//# sourceMappingURL=FilterV2.js.map