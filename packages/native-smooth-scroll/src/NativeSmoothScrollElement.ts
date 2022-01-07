import gsap from 'gsap';
import type { Align, Bounds } from './types';
import { getRelativePosition, getStickyPosition } from './utils/positionUtils';

export interface NativeSmoothScrollElementOptions {
  sticky?: boolean;
  stickyElement?: HTMLElement | null;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollElementOptions> = {
  sticky: false,
  stickyElement: null,
};

export class NativeSmoothScrollElement {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _element: HTMLElement | null;
  private bounds: Bounds | null = null;
  private position: number = 0;
  private progress: number = 0;
  private readonly options: Required<NativeSmoothScrollElementOptions>;

  public constructor(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    // eslint-disable-next-line no-underscore-dangle
    this._element = element;

    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public get element() {
    // eslint-disable-next-line no-underscore-dangle
    return this._element;
  }

  public get height() {
    return this.bounds?.height || 0;
  }

  public get top() {
    return this.bounds?.top || 0;
  }

  public resetStyles() {
    gsap.set(this.element, {
      position: 'relative',
      y: 0,
      willChange: 'auto',
      visibility: 'visible',
    });

    if (this.options.sticky && this.options.stickyElement) {
      gsap.set(this.options.stickyElement, { position: 'sticky', top: 0 });
    }
  }

  public resetVisibility() {
    gsap.set(this.element, {
      visibility: 'visible',
    });
  }

  public applyStyles() {
    gsap.set(this.element, {
      position: 'fixed',
      top: 0,
      left: 0,
      willChange: 'transform',
    });

    if (this.options.sticky && this.options.stickyElement) {
      gsap.set(this.options.stickyElement, { position: 'relative', top: 0 });
    }
  }

  public measure(scrollPosition: number) {
    if (this.element) {
      const bounds = this.element.getBoundingClientRect();

      this.bounds = { ...bounds.toJSON(), top: bounds.top + scrollPosition };
    }
  }

  public update(
    viewportHeight: number,
    scrollPosition: number,
    force: boolean = false,
    updateVisibility: boolean = true,
  ) {
    if (this.bounds) {
      const rawPosition = Math.round(this.bounds.top - scrollPosition);
      const minPosition = -this.bounds.height;
      const maxPosition = viewportHeight;

      const position = gsap.utils.clamp(
        minPosition,
        maxPosition,
        this.options.sticky
          ? getStickyPosition(rawPosition, this.bounds.height, viewportHeight)
          : rawPosition,
      );

      this.progress = gsap.utils.clamp(
        0,
        1,
        gsap.utils.normalize(maxPosition, minPosition, rawPosition),
      );

      if (force || this.position !== position) {
        gsap.set(this.element, {
          y: position,
          visibility:
            updateVisibility && (this.progress === 0 || this.progress === 1) ? 'hidden' : 'visible',
        });

        this.position = position;
      }
    }
  }

  public getRelativeChildPosition(target: string | HTMLElement, align: Align = 'top') {
    if (this.element) {
      if (target instanceof HTMLElement) {
        if (target === this.element || this.element?.contains(target)) {
          return getRelativePosition(target, this.element, align);
        }
      } else {
        const targetElement =
          (this.element?.matches(`#${target}`) && this.element) ||
          this.element?.querySelector<HTMLElement>(`#${target}`);

        if (targetElement) {
          return getRelativePosition(targetElement, this.element, align);
        }
      }
    }

    return null;
  }

  public destruct() {
    // eslint-disable-next-line no-underscore-dangle
    this._element = null;
    this.bounds = null;
  }
}
