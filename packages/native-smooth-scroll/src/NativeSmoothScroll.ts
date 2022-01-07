import gsap from 'gsap';
import { debounce, isBoolean, isNumber } from 'lodash-es';
import {
  NativeSmoothScrollElement,
  NativeSmoothScrollElementOptions,
} from './NativeSmoothScrollElement';
import { hasTouchSupport, prefersReducedMotion } from './utils/featureDetectionUtils';
import type { ScrollOptions } from './types';
import { getAlignPosition, getAlignPositionByElement } from './utils';

export interface NativeSmoothScrollOptions {
  lerp?: number;
  isEnabled?: boolean;
  isResizeObserverEnabled?: boolean;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollOptions> = {
  lerp: 0.1,
  isEnabled: true,
  isResizeObserverEnabled: false,
};

export class NativeSmoothScroll {
  private container: HTMLElement | null = null;
  private elements: Array<NativeSmoothScrollElement> = [];
  private options: Required<NativeSmoothScrollOptions> = DEFAULT_OPTIONS;
  private resizeObserver: ResizeObserver | null = null;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _isEnabled: boolean = true;
  private isTabbing: boolean = false;

  private scrollPosition: number = 0;
  private targetScrollPosition: number = 0;
  private viewportHeight: number = 0;

  public init(container: HTMLElement, options?: NativeSmoothScrollOptions) {
    this.container = container;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.container.addEventListener('focusin', this.onFocusIn);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('keydown', this.onKeyDown);

    this.scrollPosition = window.scrollY;
    this.targetScrollPosition = this.scrollPosition;

    this.viewportHeight = window.innerHeight;

    this.setIsEnabled(
      isBoolean(options?.isEnabled)
        ? Boolean(options?.isEnabled)
        : !hasTouchSupport() && !prefersReducedMotion(),
    );

    gsap.ticker.add(this.updateScrollPosition);

    if (this.options.isResizeObserverEnabled) {
      this.resizeObserver = new ResizeObserver(this.onResize);
    }
  }

  public addElement(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    const elementInstance = new NativeSmoothScrollElement(element, options);

    this.elements.push(elementInstance);

    if (this.options.isResizeObserverEnabled) {
      this.resizeObserver?.observe(element);
    }

    this.invalidate();

    return elementInstance;
  }

  public removeElement(element: HTMLElement | NativeSmoothScrollElement) {
    let instance: NativeSmoothScrollElement | null;

    if (element instanceof HTMLElement) {
      instance =
        this.elements.find((elementInstance) => elementInstance.element === element) || null;
    } else {
      instance = element;
    }

    if (instance) {
      this.elements = this.elements.filter((elementInstance) => elementInstance !== instance);

      if (this.options.isResizeObserverEnabled && instance.element) {
        this.resizeObserver?.unobserve(instance.element);
      }

      instance.destruct();

      this.invalidate();
    }
  }

  public get isEnabled() {
    // eslint-disable-next-line no-underscore-dangle
    return this._isEnabled;
  }

  public setIsEnabled(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._isEnabled = value;

    if (this.isEnabled) {
      this.invalidate();
    } else {
      this.elements.forEach((element) => {
        element.resetStyles();
      });
    }
  }

  public invalidate() {
    this.updateSizes();
    this.update(true);
  }

  public scrollTo(
    target: string | number | NativeSmoothScrollElement | HTMLElement,
    options?: ScrollOptions,
  ) {
    let targetPosition: number | null = null;

    if (isNumber(target)) {
      targetPosition = target;
    } else if (target instanceof NativeSmoothScrollElement) {
      if (this.isEnabled) {
        targetPosition = getAlignPosition(target.top, target.height, options?.align || 'top');
      } else if (target.element) {
        targetPosition =
          getAlignPositionByElement(target.element, options?.align || 'top') + window.scrollY;
      }
    } else {
      for (const elementInstance of this.elements) {
        const position = elementInstance.getRelativeChildPosition(target, options?.align || 'top');

        if (position !== null) {
          targetPosition =
            position +
            (this.isEnabled
              ? elementInstance.top
              : (elementInstance.element?.getBoundingClientRect().top || 0) + window.scrollY);
          break;
        }
      }
    }

    if (targetPosition !== null) {
      const alignedPosition =
        targetPosition - getAlignPosition(0, this.viewportHeight, options?.align || 'top');

      if (options?.shouldIgnoreWhenVisible) {
        const scrollPosition = window.scrollY;

        if (
          targetPosition > scrollPosition &&
          targetPosition < scrollPosition + this.viewportHeight
        ) {
          return;
        }
      }

      window.scroll({
        left: 0,
        top: alignedPosition,
        behavior: this.isEnabled ? 'auto' : 'smooth',
      });
    }
  }

  private update(force: boolean = false) {
    if (!this.isEnabled) {
      return;
    }

    this.elements.forEach((element) => {
      element.update(this.viewportHeight, this.scrollPosition, force, !this.isTabbing);
    });
  }

  private updateSizes() {
    if (!this.isEnabled) return;

    const scrollPosition = window.scrollY;

    this.elements.forEach((element) => {
      element.resetStyles();
    });

    this.elements.forEach((element) => {
      element.measure(scrollPosition);
    });

    this.elements.forEach((element) => {
      element.applyStyles();
    });

    const height = this.elements.reduce((result, element) => {
      return result + element.height;
    }, 0);

    gsap.set(this.container, { height });
  }

  private readonly onScroll = () => {
    this.targetScrollPosition = Math.max(window.scrollY, 0);
  };

  private readonly onResize = debounce(() => {
    this.viewportHeight = window.innerHeight;

    this.invalidate();
  }, 200);

  private readonly onFocusIn = (event: FocusEvent) => {
    if (event.target) {
      this.scrollTo(event.target as HTMLElement, {
        align: 'middle',
        shouldIgnoreWhenVisible: true,
      });
    }
  };

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Tab') {
      if (!this.isTabbing) {
        this.isTabbing = true;

        this.elements.forEach((element) => {
          element.resetVisibility();
        });
      }

      this.resetTabbing();
    }
  };

  private readonly resetTabbing = debounce(() => {
    this.isTabbing = false;

    this.update(true);
  }, 1000);

  private readonly updateScrollPosition = () => {
    if (Math.abs(this.scrollPosition - this.targetScrollPosition) > 0.001) {
      this.scrollPosition = gsap.utils.interpolate(
        this.scrollPosition,
        this.targetScrollPosition,
        this.options.lerp,
      );

      this.update();
    }
  };

  public destruct() {
    gsap.ticker.remove(this.updateScrollPosition);

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);

    this.elements.forEach((element) => {
      element.destruct();
    });
  }
}
