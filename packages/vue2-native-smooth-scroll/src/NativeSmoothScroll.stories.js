// eslint-disable-next-line import/no-relative-packages
import '../../native-smooth-scroll/src/styles.css';
import { NativeSmoothScroll } from '@mediamonks/native-smooth-scroll';
import ScrollContainer from './components/ScrollContainer/ScrollContainer.vue';
import ScrollElement from './components/ScrollElement/ScrollElement.vue';

export default {
  title: 'NativeSmoothScroll',
};

export const Simple = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {},
  mounted() {
    const nativeSmoothScroll = new NativeSmoothScroll();
    nativeSmoothScroll.init(this.$refs.container);

    this.$refs.element.forEach((element) => {
      nativeSmoothScroll.addElement(element);
    });
  },
  template: `<div ref="container" id="scroll-container">
    <div ref="element" v-for="(element, index) in Array(4)" :key="index" :class="['scroll-element', 'scroll-element-' + (index + 1)]">{{index + 1}}</div>
  </div>`,
});

export const Components = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ScrollContainer, ScrollElement },
  template: `<ScrollContainer :options="{ isResizeObserverEnabled: true }">
    <ScrollElement class="scroll-element scroll-element-1">1</ScrollElement>
    <ScrollElement class="scroll-element scroll-element-2">2</ScrollElement>
    <ScrollElement class="scroll-element scroll-element-3">3</ScrollElement>
    <ScrollElement class="scroll-element scroll-element-4">4</ScrollElement>
  </ScrollContainer>`,
});
