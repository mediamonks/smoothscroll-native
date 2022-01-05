import global from 'global';
import { useEffect } from '@storybook/client-api';

import './styles.css';
import { NativeSmoothScroll, NativeSmoothScrollOptions } from './NativeSmoothScroll';
import type { NativeSmoothScrollElementOptions } from './NativeSmoothScrollElement';

export default {
  title: 'NativeSmoothScroll',
};

const getNativeSmoothScrollInstance = (
  containerSelector: string,
  options?: NativeSmoothScrollOptions,
) => {
  const container = global.document.querySelector<HTMLElement>(containerSelector);

  if (container) {
    const instance = new NativeSmoothScroll();
    instance.init(container, options);

    return instance;
  }

  return null;
};

const addScrollElements = (
  instance: NativeSmoothScroll | null,
  selector: string,
  options?: NativeSmoothScrollElementOptions,
) => {
  if (instance) {
    const scrollElements = Array.from(global.document.querySelectorAll<HTMLElement>(selector));

    scrollElements.forEach((block) => {
      instance.addElement(block, options);
    });
  }
};

const defaultHtml = `<div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3">3</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;

export const Default = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');
    addScrollElements(nativeSmoothScroll, '.scroll-element');

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return defaultHtml;
};

export const Sticky = (props: { sticky: boolean }) => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    if (nativeSmoothScroll) {
      const scrollElements = Array.from(
        global.document.querySelectorAll<HTMLElement>('.scroll-element'),
      );

      scrollElements.forEach((block, index) => {
        nativeSmoothScroll.addElement(block, { sticky: props.sticky && index === 2 });
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `<div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3">3 (sticky if enabled)</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;
};

Sticky.args = {
  sticky: true,
};

export const Lerp = (props: { lerp: number }) => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container', {
      lerp: props.lerp,
    });
    addScrollElements(nativeSmoothScroll, '.scroll-element');

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return defaultHtml;
};

Lerp.args = {
  lerp: 0.1,
};

Lerp.argTypes = {
  lerp: {
    control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
  },
};
