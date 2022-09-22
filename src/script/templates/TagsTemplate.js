var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TagsTemplate {
    constructor(tag) {
        this.tag = tag;
        this.$tagsContainer = document.querySelector("#tagsWrapper");
    }
    createTag() {
        const { textContent: value, dataset } = this.tag;
        const $icon = document.createElement("span");
        $icon.classList.value = "fa-regular fa-circle-xmark icon";
        $icon.ariaHidden = "true";
        const $btn = document.createElement("button");
        $btn.classList.value = "tag__btn";
        $btn.appendChild($icon);
        const $p = document.createElement("p");
        $p.classList.value = "tag__text";
        const $tag = document.createElement("li");
        $tag.classList.value = "tag";
        $tag.dataset.tag = dataset.filterType;
        $tag.textContent = value;
        $tag.appendChild($p);
        $tag.appendChild($btn);
        return $tag;
    }
    appendTag() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$tagsContainer.childNodes.length < 3) {
                const $tag = this.createTag();
                this.$tagsContainer.appendChild($tag);
                this.tag.dataset.active = "true";
                this.tag.setAttribute("disabled", "true");
                const $button = $tag.querySelector(".tag__btn");
                $button.addEventListener("click", () => {
                    this.tag.dataset.active = "false";
                    this.tag.setAttribute("disabled", "false");
                    this.$tagsContainer.removeChild($tag);
                });
                return $tag;
            }
        });
    }
}
//# sourceMappingURL=TagsTemplate.js.map