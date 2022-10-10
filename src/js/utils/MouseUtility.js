export class MouseUtility {
    static mouseInObserver(pointer, $div) {
        const xAxis = $div.xStart < pointer.posX && pointer.posX < $div.xEnd;
        const yAxis = $div.yStart < pointer.posY && pointer.posY < $div.yEnd;
        return xAxis && yAxis;
    }
    static getMousePosition(ev) {
        return {
            posX: window.scrollX + ev.pageX,
            posY: window.scrollY + ev.pageY,
        };
    }
    static getDivElementPosition(divElement) {
        return {
            xStart: divElement.offsetLeft,
            xEnd: divElement.offsetLeft + divElement.offsetWidth,
            yStart: divElement.offsetTop,
            yEnd: divElement.offsetTop + divElement.offsetHeight,
        };
    }
}