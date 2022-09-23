import { MenuObserver } from "./MenuObserver.js";
export class MenuSubject {
    constructor() {
        this.observers = [];
        this.filters = [...document.querySelectorAll(".filtres__filtre")];
        this.filters.forEach(filter => this.observers.push(new MenuObserver(filter)));
    }
    subscribe(observer) {
        this.observers.filter(filter => filter.filter === observer)[0].setState("open");
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
    unsubscribe(observer) {
        this.observers.filter(filter => filter.filter === observer)[0].setState("close");
    }
    fire() {
        this.observers.forEach(observer => observer.callContext());
    }
}
//# sourceMappingURL=MenuSubject.js.map