<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { NativeSmoothScroll } from '@mediamonks/native-smooth-scroll';
import VueTypes from 'vue-types';

export default {
  name: 'ScrollContainer',
  provide() {
    this.nativeSmoothScroll = new NativeSmoothScroll();
    return {
      nativeSmoothScroll: this.nativeSmoothScroll
    }
  },
  props: {
    isEnabled: VueTypes.bool,
    options: VueTypes.shape({
      lerp: VueTypes.number,
      isEnabled: VueTypes.bool,
      isResizeObserverEnabled: VueTypes.bool,
      onBeforeMeasuring: VueTypes.func,
    }),
  },
  watch: {
    isEnabled() {
      if(this.isEnabled !== undefined) {
        this.nativeSmoothScroll.setIsEnabled(this.isEnabled);
      }
    },
  },
  mounted() {
    this.nativeSmoothScroll.init(this.$el, this.options);
  },
  beforeDestroy() {
    this.nativeSmoothScroll.destruct();
    this.nativeSmoothScroll = null;
  }
};
</script>
