export class MenuContextClose {
    constructor(filter) {
        this.filter = filter;
        this.state = "close";
    }
    setInactive() {
        this.filter.dataset.open = "false";
        this.filter.ariaHidden = "true";
        this.filter.blur();
        const inputSearch = this.filter.querySelector("input");
        const tagWrapper = this.filter.querySelector("ul");
        const $tags = [...tagWrapper.querySelectorAll("li")];
        inputSearch.value = "";
        $tags.forEach($tag => {
            $tag.setAttribute("data-hidden", "false");
        });
    }
    handleContext() {
        this.setInactive();
    }
}
//# sourceMappingURL=MenuContextClose.js.map