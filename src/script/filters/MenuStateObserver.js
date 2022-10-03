import { TagsTemplate } from "../templates/TagsTemplate.js";
export class MenuStateObserver {
    constructor(filter) {
        this.filter = filter;
        this.$tagsContainer = document.querySelector("#tagsWrapper");
        this.setState("close");
    }
    setState(state) {
        const tagWrapper = this.filter.querySelector("ul");
        const $tags = [...tagWrapper.childNodes];
        switch (state) {
            case "open":
                this.setActive($tags);
                break;
            case "close":
                this.setInactive($tags);
                break;
        }
    }
    setActive($tags) {
        this.filter.dataset.open = "true";
        this.filter.tabIndex = 0;
        this.filter.ariaHidden = "false";
        this.filter.dataset.color = this.filter.style.backgroundColor;
        $tags.forEach($tag => {
            const tagBtn = $tag.firstChild;
            tagBtn.onclick = () => {
                this.appendTagToContainer(tagBtn);
            };
        });
    }
    setInactive($tags) {
        this.filter.dataset.open = "false";
        this.filter.ariaHidden = "true";
        this.filter.blur();
        const inputSearch = this.filter.querySelector("input");
        inputSearch.value = "";
        $tags.forEach($tag => {
            $tag.setAttribute("data-hidden", "false");
        });
    }
    appendTagToContainer(tagBtn) {
        const { value, dataset } = tagBtn;
        const tagTemplate = new TagsTemplate({ value, dataset });
        if (this.$tagsContainer.childNodes.length < 3) {
            tagBtn.disabled = true;
            tagBtn.disabled = true;
            const $newTag = tagTemplate.createTag();
            this.$tagsContainer.appendChild($newTag);
            const $closeTag = $newTag.querySelector(".tag__btn");
            $closeTag.onclick = () => {
                tagBtn.disabled = false;
                this.$tagsContainer.removeChild($newTag);
            };
            return $newTag;
        }
        return;
    }
}
//# sourceMappingURL=MenuStateObserver.js.map