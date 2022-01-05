import gsap from 'gsap';
import { debounce } from 'lodash-es';
import NativeSmoothScrollElement, {
  NativeSmoothScrollElementOptions,
} from './NativeSmoothScrollElement';

export default class NativeSmoothScroll {
  private readonly element: HTMLElement;
  private readonly elements: Array<NativeSmoothScrollElement> = [];

  private scrollPosition: number = 0;
  private targetScrollPosition: number = 0;
  private viewportHeight: number;

  public constructor(element: HTMLElement) {
    this.element = element;

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    this.scrollPosition = window.scrollY;
    this.viewportHeight = window.innerHeight;

    gsap.ticker.add(this.updateScrollPosition);
  }

  public addElement(element: HTMLElement, options?: Partial<NativeSmoothScrollElementOptions>) {
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

    gsap.set(this.element, { height });
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
        0.1,
      );

      this.update();
    }
  };
}
