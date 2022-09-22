var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagHandler } from "./TagHandler.js";
export class TagObserver {
    constructor(selectedTagContainer) {
        this.selectedTagContainer = selectedTagContainer;
        this.observers = [];
        this.tags = [];
    }
    subscribe(obs) {
        this.observers.push(obs);
    }
    unsubscribe(obs) {
        const index = this.observers.indexOf(obs);
        this.observers.slice(index, 1);
        let tagSearchForm = obs.querySelector("input");
        tagSearchForm.value = "";
        document.removeEventListener("input", () => TagHandler.handleSearchForTags(obs));
    }
    fire() {
        if (this.observers.length === 1) {
            this.tags = TagHandler.getAllTags(this.observers[0]);
            let tagSearchForm = this.observers[0].querySelector("input");
            tagSearchForm.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () { return yield TagHandler.handleSearchForTags(this.selectedTagContainer); }));
            TagHandler.handleClickOnTags(this.tags, this.selectedTagContainer);
        }
    }
}
//# sourceMappingURL=TagObserver.js.map