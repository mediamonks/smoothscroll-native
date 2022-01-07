import type { Align } from '../types';

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

export function getRelativePosition(
  element: HTMLElement,
  targetElement: HTMLElement,
  align: Align = 'top',
) {
  const elementBounds = element.getBoundingClientRect();
  const targetElementBounds = targetElement.getBoundingClientRect();

  return (
    elementBounds.top + getAlignPosition(0, elementBounds.height, align) - targetElementBounds.top
  );
}

export function getAlignPosition(top: number, height: number, align: Align = 'top') {
  switch (align) {
    case 'middle':
      return top + height * 0.5;
    case 'bottom':
      return top + height;
    case 'top':
    default:
      return top;
  }
}

export function getAlignPositionByElement(element: HTMLElement, align: Align = 'top') {
  const bounds = element.getBoundingClientRect();

  return getAlignPosition(bounds.top, bounds.height, align);
}
