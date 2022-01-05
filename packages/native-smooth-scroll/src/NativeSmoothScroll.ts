import gsap from 'gsap';
import { debounce } from 'lodash-es';
import {
  NativeSmoothScrollElement,
  NativeSmoothScrollElementOptions,
} from './NativeSmoothScrollElement';

export interface NativeSmoothScrollOptions {
  lerp?: number;
}

const DEFAULT_OPTIONS: Required<NativeSmoothScrollOptions> = {
  lerp: 0.1,
};

export class NativeSmoothScroll {
  private container: HTMLElement | null = null;
  private readonly elements: Array<NativeSmoothScrollElement> = [];
  private options: Required<NativeSmoothScrollOptions> = DEFAULT_OPTIONS;

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

    gsap.ticker.add(this.updateScrollPosition);
  }

  public addElement(element: HTMLElement, options?: NativeSmoothScrollElementOptions) {
    const elementInstance = new NativeSmoothScrollElement(element, options);

    this.elements.push(elementInstance);

    this.updateSizes();
    this.update();
  }

  private update() {
    this.elements.forEach((element) => {
      element.update(this.viewportHeight, this.scrollPosition);
    });
  }

  private updateSizes() {
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
