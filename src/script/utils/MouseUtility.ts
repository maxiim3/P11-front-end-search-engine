type MousePositionProps = {x: number; y: number}
type ContainerPositionProps = {positionXLeft: number; width: number; positionYTop: number; height: number}

export class MouseUtility {
	static mouseInObserver(mouseProps: MousePositionProps, containerProps: ContainerPositionProps) {
		return (
			containerProps.positionXLeft < mouseProps.x &&
			mouseProps.x < containerProps.positionXLeft + containerProps.width &&
			containerProps.positionYTop < mouseProps.y &&
			mouseProps.y < containerProps.positionYTop + containerProps.height
		)
	}

	static getMousePosition(ev: MouseEvent): MousePositionProps {
		return {
			x: window.scrollX + ev.clientX,
			y: window.scrollY + ev.clientY,
		}
	}

	static getObserverPosition(observer: HTMLDivElement): ContainerPositionProps {
		return {
			width: observer.clientWidth,
			height: observer.clientHeight,
			positionXLeft: observer.offsetLeft,
			positionYTop: observer.offsetTop - 10,
		}
	}
}
