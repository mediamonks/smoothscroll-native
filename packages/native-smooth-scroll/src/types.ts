export interface Bounds {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export interface ScrollOptions {
  align?: Align;
  shouldIgnoreWhenVisible?: boolean;
}

export type Align = 'top' | 'middle' | 'bottom';
