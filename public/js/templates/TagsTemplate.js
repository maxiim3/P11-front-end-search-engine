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
    }
}
//# sourceMappingURL=TagsTemplate.js.map