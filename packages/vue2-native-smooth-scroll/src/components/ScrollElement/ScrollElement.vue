<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'ScrollElement',
  inject: ['nativeSmoothScroll'],
  props: {
    isSticky: VueTypes.bool,
  },
  watch: {
    isEnabled() {
      if(this.isEnabled !== undefined) {
        this.nativeSmoothScroll.setIsEnabled(this.isEnabled);
      }
    },
  },
  mounted() {
    if(this.nativeSmoothScroll) {
      this.elementInstance = this.nativeSmoothScroll.addElement(this.$el, {
        isSticky: this.isSticky || false
      });
    }
  },
  beforeDestroy() {
    if(this.nativeSmoothScroll && this.elementInstance && !this.elementInstance.isDestructed) {
      this.nativeSmoothScroll.removeElement(this.elementInstance);
    }
  }
};
</script>
