import global from 'global';
import { useEffect } from '@storybook/client-api';

import './styles.css';
import { NativeSmoothScroll } from './NativeSmoothScroll';

export default {
  title: 'NativeSmoothScroll',
};

export const Default = () => {
  useEffect(() => {
    const container = global.document.querySelector<HTMLElement>('#scroll-container');

    let nativeSmoothScroll: NativeSmoothScroll;

    if (container) {
      nativeSmoothScroll = new NativeSmoothScroll();
      nativeSmoothScroll.init(container);

      const scrollElements = Array.from(
        global.document.querySelectorAll<HTMLElement>('.scroll-element'),
      );

      scrollElements.forEach((block) => {
        nativeSmoothScroll.addElement(block);
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
      <div class="scroll-element scroll-element-3">3</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;
};

export const Sticky = (props: { sticky: boolean }) => {
  useEffect(() => {
    const container = global.document.querySelector<HTMLElement>('#scroll-container');

    let nativeSmoothScroll: NativeSmoothScroll;

    if (container) {
      nativeSmoothScroll = new NativeSmoothScroll();
      nativeSmoothScroll.init(container);

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
