export class TagsTemplate {
    constructor({ value, dataset }) {
        this.textContent = value;
        this.dataset = dataset;
    }
    createTag() {
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
        $tag.dataset.tag = this.dataset["filterType"];
        $tag.textContent = this.textContent;
        $tag.appendChild($p);
        $tag.appendChild($btn);
        return $tag;
    }
}
