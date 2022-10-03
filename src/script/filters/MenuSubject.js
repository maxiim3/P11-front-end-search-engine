import { MenuStateObserver } from "./MenuStateObserver.js";
export class MenuSubject {
    constructor() {
        this.contextObserver = [];
        this.filters = [...document.querySelectorAll(".filtres__filtre")];
        this.filters.forEach(filter => this.contextObserver.push(new MenuStateObserver(filter)));
    }
    subscribe(observer) {
        this.contextObserver.filter(filter => filter.filter === observer)[0].setState("open");
        document.addEventListener("keydown", ({ key }) => {
            if (observer.dataset.open === "true") {
                if (key === "Escape" || key === "Enter") {
                    this.unsubscribe(observer);
                    this.fire();
                }
            }
        });
        document.addEventListener("click", ev => {
            if (observer.dataset.open === "true") {
                const mouseProps = this.getMousePosition(ev);
                const containerProps = this.getObserverPosition(observer);
                if (this.mouseInObserver(mouseProps, containerProps)) {
                    return;
                }
                else {
                    this.unsubscribe(observer);
                    this.fire();
                }
            }
        });
    }
    unsubscribe(observer) {
        this.contextObserver.filter(filter => filter.filter === observer)[0].setState("close");
    }
    mouseInObserver(mouseProps, containerProps) {
        return (containerProps.positionXLeft < mouseProps.x &&
            mouseProps.x < containerProps.positionXLeft + containerProps.width &&
            containerProps.positionYTop < mouseProps.y &&
            mouseProps.y < containerProps.positionYTop + containerProps.height);
    }
    getObserverPosition(observer) {
        return {
            width: observer.clientWidth,
            height: observer.clientHeight,
            positionXLeft: observer.offsetLeft,
            positionYTop: observer.offsetTop - 10,
        };
    }
    getMousePosition(ev) {
        return {
            x: window.scrollX + ev.clientX,
            y: window.scrollY + ev.clientY,
        };
    }
    fire() {
        this.contextObserver.forEach(observer => observer.callContext());
    }
}
//# sourceMappingURL=MenuSubject.js.map