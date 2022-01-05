import gsap from 'gsap';
import type { Bounds } from './types';

export interface NativeSmoothScrollElementOptions {
  sticky?: boolean;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollElementOptions> = {
  sticky: false,
};

export class NativeSmoothScrollElement {
  private element: HTMLElement | null;
  private bounds: Bounds | null = null;
  private position: number = 0;
  private progress: number = 0;
  private readonly options: Required<NativeSmoothScrollElementOptions>;

  public constructor(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    this.element = element;

    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public get height() {
    return this.bounds?.height || 0;
  }

  public resetStyles() {
    gsap.set(this.element, { position: 'relative', y: 0, willChange: 'auto' });
  }

  public applyStyles() {
    gsap.set(this.element, {
      position: 'fixed',
      top: 0,
      left: 0,
      y: this.position,
      willChange: 'transform',
    });
  }

  public measure(scrollPosition: number) {
    if (this.element) {
      const bounds = this.element.getBoundingClientRect();

      this.bounds = { ...bounds.toJSON(), top: bounds.top + scrollPosition };
    }
  }

  public update(viewportHeight: number, scrollPosition: number) {
    if (this.bounds) {
      const rawPosition = Math.round(this.bounds.top - scrollPosition);
      const minPosition = -this.bounds.height;
      const maxPosition = viewportHeight;

      const position = gsap.utils.clamp(
        minPosition,
        maxPosition,
        this.options.sticky ? this.getStickyPosition(rawPosition, viewportHeight) : rawPosition,
      );

      this.progress = gsap.utils.clamp(
        0,
        1,
        gsap.utils.normalize(maxPosition, minPosition, rawPosition),
      );

      if (this.position !== position) {
        gsap.set(this.element, {
          y: position,
          visibility: this.progress === 0 || this.progress === 1 ? 'hidden' : 'visible',
        });

        this.position = position;
      }
    }
  }

  private getStickyPosition(position: number, viewportHeight: number): number {
    if (this.bounds && position + this.bounds.height <= 0) {
      return position;
    }

    if (this.bounds && this.bounds.height + position < viewportHeight) {
      return (viewportHeight - (this.bounds.height + position)) * -1;
    }

    return Math.max(position, 0);
  }

  public destruct() {
    this.element = null;
    this.bounds = null;
  }
}
