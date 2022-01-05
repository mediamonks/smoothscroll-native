import global from 'global';
import { useEffect } from '@storybook/client-api';

import './styles.css';
import NativeSmoothScroll from './NativeSmoothScroll';

export default {
  title: 'NativeSmoothScroll',
};

export const Default = () => {
  useEffect(() => {
    const container = global.document.querySelector<HTMLElement>('#scroll-container');

    if (container) {
      const nativeSmoothScroll = new NativeSmoothScroll(container);
      const scrollElements = Array.from(
        global.document.querySelectorAll<HTMLElement>('.scroll-element'),
      );

      scrollElements.forEach((block) => {
        nativeSmoothScroll.addElement(block);
      });
    }
  }, []);

  return `<div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3">3</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;
};
