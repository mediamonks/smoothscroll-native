export function getStickyPosition(
  position: number,
  height: number,
  viewportHeight: number,
): number {
  if (position + height <= 0) {
    return position;
  }

  if (height + position < viewportHeight) {
    return (viewportHeight - (height + position)) * -1;
  }

  return Math.max(position, 0);
}

export function getRelativePosition(element: HTMLElement, targetElement: HTMLElement) {
  const elementBounds = element.getBoundingClientRect();
  const targetElementBounds = targetElement.getBoundingClientRect();

  return elementBounds.top - targetElementBounds.top;
}
