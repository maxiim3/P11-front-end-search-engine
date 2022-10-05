export class MouseUtility {
    static mouseInObserver(mouseProps, containerProps) {
        return (containerProps.positionXLeft < mouseProps.x &&
            mouseProps.x < containerProps.positionXLeft + containerProps.width &&
            containerProps.positionYTop < mouseProps.y &&
            mouseProps.y < containerProps.positionYTop + containerProps.height);
    }
    static getMousePosition(ev) {
        return {
            x: window.scrollX + ev.clientX,
            y: window.scrollY + ev.clientY,
        };
    }
    static getObserverPosition(observer) {
        return {
            width: observer.clientWidth,
            height: observer.clientHeight,
            positionXLeft: observer.offsetLeft,
            positionYTop: observer.offsetTop - 10,
        };
    }
}
//# sourceMappingURL=MouseUtility.js.map