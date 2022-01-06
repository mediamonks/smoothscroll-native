import gsap from 'gsap';
import { debounce, isBoolean } from 'lodash-es';
import {
  NativeSmoothScrollElement,
  NativeSmoothScrollElementOptions,
} from './NativeSmoothScrollElement';
import { hasTouchSupport, prefersReducedMotion } from './utils/featureDetectionUtils';

export interface NativeSmoothScrollOptions {
  lerp?: number;
  isEnabled?: boolean;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollOptions> = {
  lerp: 0.1,
  isEnabled: true,
};

export class NativeSmoothScroll {
  private container: HTMLElement | null = null;
  private elements: Array<NativeSmoothScrollElement> = [];
  private options: Required<NativeSmoothScrollOptions> = DEFAULT_OPTIONS;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _isEnabled: boolean = true;

  private scrollPosition: number = 0;
  private targetScrollPosition: number = 0;
  private viewportHeight: number = 0;

  public init(container: HTMLElement, options?: NativeSmoothScrollOptions) {
    this.container = container;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.scrollPosition = window.scrollY;
    this.targetScrollPosition = this.scrollPosition;

    this.viewportHeight = window.innerHeight;

    this.setIsEnabled(
      isBoolean(options?.isEnabled)
        ? Boolean(options?.isEnabled)
        : !hasTouchSupport() && !prefersReducedMotion(),
    );

    gsap.ticker.add(this.updateScrollPosition);
  }

  public addElement(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    const elementInstance = new NativeSmoothScrollElement(element, options);

    this.elements.push(elementInstance);

    this.updateSizes();
    this.update();

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

      instance.destruct();

      this.updateSizes();
      this.update();
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
      this.updateSizes();
      this.update();
    } else {
      this.elements.forEach((element) => {
        element.resetStyles();
      });
    }
  }

  private update() {
    if (!this.isEnabled) {
      return;
    }

    this.elements.forEach((element) => {
      element.update(this.viewportHeight, this.scrollPosition);
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

    this.updateSizes();
    this.update();
  }, 200);

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
