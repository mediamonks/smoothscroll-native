import gsap from 'gsap';
import type { Bounds } from './types';

export interface NativeSmoothScrollElementOptions {
  sticky?: boolean;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollElementOptions> = {
  sticky: false,
};

export class NativeSmoothScrollElement {
  private readonly element: HTMLElement;
  private bounds: Bounds | null = null;
  private position: number = 0;
  private readonly options: Required<NativeSmoothScrollElementOptions>;

  public constructor(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    this.element = element;

    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public get height() {
    return this.bounds?.height || 0;
  }

  public resetStyles() {
    gsap.set(this.element, { position: 'relative', y: 0 });
  }

  public applyStyles() {
    gsap.set(this.element, {
      position: 'fixed',
      top: 0,
      left: 0,
      y: this.position,
    });
  }

  public measure(scrollPosition: number) {
    const bounds = this.element.getBoundingClientRect();

    this.bounds = { ...bounds.toJSON(), top: bounds.top + scrollPosition };
  }

  public update(viewportHeight: number, scrollPosition: number) {
    if (this.bounds) {
      const rawPosition = this.bounds.top - scrollPosition;

      const position = gsap.utils.clamp(
        -this.bounds.height,
        viewportHeight + this.bounds.height,
        this.options.sticky ? this.getStickyPosition(rawPosition, viewportHeight) : rawPosition,
      );

      if (this.position !== position) {
        gsap.set(this.element, {
          y: position,
        });

        this.position = position;
      }
    }
  }

  private getStickyPosition(position: number, viewportHeight: number): number {
    if (this.bounds && this.bounds.height + position < viewportHeight) {
      return (viewportHeight - (this.bounds.height + position)) * -1;
    }

    return Math.max(position, 0);
  }
}
