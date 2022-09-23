var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Utility } from "../utils/Utility.js";
import { TagsTemplate } from "../templates/TagsTemplate.js";
export class MenuContextOpen {
    constructor(filter) {
        this.filter = filter;
        this.state = "open";
    }
    setActive() {
        this.filter.dataset.open = "true";
        this.filter.tabIndex = 0;
        this.filter.ariaHidden = "false";
        this.filter.focus();
        this.filter.dataset.color = this.filter.style.backgroundColor;
        const inputSearch = this.filter.querySelector("input");
        const tagWrapper = this.filter.querySelector("ul");
        const $tags = [...tagWrapper.querySelectorAll("li")];
        inputSearch.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
            const query = Utility.removeAccent(inputSearch.value);
            $tags.map(($tag) => __awaiter(this, void 0, void 0, function* () {
                const formatTagName = Utility.removeAccent($tag.innerText);
                if (formatTagName.includes(query))
                    $tag.setAttribute("data-hidden", "false");
                else
                    $tag.setAttribute("data-hidden", "true");
            }));
        }));
        $tags.forEach($tag => {
            $tag.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if ($tag.dataset.active === "false") {
                    const tagTpl = new TagsTemplate($tag);
                    yield tagTpl.appendTag();
                    inputSearch.value = "";
                }
            }));
        });
    }
    handleContext() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setActive();
        });
    }
}
//# sourceMappingURL=MenuContextOpen.js.map