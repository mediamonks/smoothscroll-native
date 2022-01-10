// eslint-disable-next-line import/no-relative-packages
import '../../native-smooth-scroll/src/styles.css';
import { NativeSmoothScroll } from '@mediamonks/native-smooth-scroll/src';

export default {
  title: 'NativeSmoothScroll',
};

export const Default = (args, { argTypes }) => ({
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
