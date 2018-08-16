//滑动到顶部点击框
<template>
  <transition name="backtop-fade">
    <i v-if="visible" class="fix-box iconfont icon-back_top" :style="position ? {bottom: position.bottom + 'px', right: position.right + 'px'} : null" @click="handleClick"></i>
  </transition>
</template>
<script>
export default {
  props: ['visible', 'position', 'scroll'],
  data () {
    return {};
  },
  methods: {
    handleClick (event) {
      this.scroll.scrollTo(0, 0, 500);
    }
  }
};
</script>
<style scoped>
.fix-box {
  display: block;
  position: fixed;
  height: 88px;
  line-height: 88px;
  width: 88px;
  right: 50px;
  bottom: 153px;
  font-size: 44px;
  color: #fff;
  text-align: center;
  background-color: rgba(0,0,0,0.5);
  z-index: 1;
  border-radius: 6px;
}
.backtop-fade-enter-active, .backtop-fade-leave-active {
  transition: all .5s;
}
.backtop-fade-enter, .backtop-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
