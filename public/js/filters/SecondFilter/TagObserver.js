var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FilterV1 } from "../../utils/FilterV1";
import { TagsTemplate } from "../../templates/TagsTemplate";
export class TagObserver {
    constructor(data, filterWrapper) {
        this.data = data;
        this.filterWrapper = filterWrapper;
        this.observers = [];
        this.tags = [];
    }
    subscribe(obs) {
        this.observers.push(obs);
    }
    unsubscribe(obs) {
        const index = this.observers.indexOf(obs);
        this.observers.slice(index, 1);
        const input = obs.querySelector("input");
        input.value = "";
        document.removeEventListener("input", this.updateListOfTags);
    }
    updateListOfTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tagListWrapper = this.filterWrapper.querySelector("ul");
            const { filterName } = tagListWrapper.dataset;
            const { value } = this.filterWrapper.querySelector("input");
            if (filterName)
                this.tags = yield FilterV1.handleTagFiltered(value, filterName);
        });
    }
    selectTags() {
        this.tags.forEach($tag => {
            $tag.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (!$tag.getAttribute("disabled")) {
                    const tagTpl = new TagsTemplate($tag);
                    tagTpl.appendTag();
                    const directParent = $tag.parentNode;
                    const grandParent = directParent.parentNode;
                    const inputElement = grandParent.querySelector("input");
                    inputElement.value = "";
                    yield this.updateListOfTags();
                }
            }));
        });
    }
    fire() {
        this.observers.forEach(obs => {
            this.tags = [...obs.querySelectorAll("li:not([data-hidden=true])")];
            const input = obs.querySelector("input");
            input.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateListOfTags();
            }));
            this.selectTags();
        });
    }
}
//# sourceMappingURL=TagObserver.js.map