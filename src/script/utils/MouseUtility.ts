type MousePositionProps = {posX: number; posY: number}
type ContainerPositionProps = {xStart: number; xEnd: number; yStart: number; yEnd: number}

export class MouseUtility {
	/**
	 * @description Compare position of pointer and div element
	 * @see mouseInObserver
	 * @see getDivElementPosition
	 * @param pointer
	 * @param $div
	 */
	static mouseInObserver(pointer: MousePositionProps, $div: ContainerPositionProps) {
		const xAxis = $div.xStart < pointer.posX && pointer.posX < $div.xEnd
		const yAxis = $div.yStart < pointer.posY && pointer.posY < $div.yEnd
		return xAxis && yAxis
	}

	/**
	 * @description Get position of pointer
	 * @param ev
	 */
	static getMousePosition(ev: MouseEvent): MousePositionProps {
		return {
			posX: window.scrollX + ev.pageX,
			posY: window.scrollY + ev.pageY,
		}
	}

	/**
	 * @description Get position of provided divElement
	 * @param divElement
	 */
	static getDivElementPosition(divElement: HTMLDivElement): ContainerPositionProps {
		return {
			xStart: divElement.offsetLeft,
			xEnd: divElement.offsetLeft + divElement.offsetWidth,
			yStart: divElement.offsetTop,
			yEnd: divElement.offsetTop + divElement.offsetHeight,
		}
	}
}
