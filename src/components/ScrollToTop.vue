//滑动到顶部点击框
<template>
  <transition name="fade-normal">
    <i v-if="visible" class="fix-box iconfont icon-back_top" :style="position ? {bottom: position.bottom + 'px', right: position.right + 'px', marginRight: marginRight + 'px'} : null" @click="handleClick"></i>
  </transition>
</template>
<script>
export default {
  props: ['visible', 'position', 'scroll', 'isMeScroll'],
  data () {
    let _marginRight = (window.innerWidth - (window.innerWidth > 800 ? 800 : window.innerWidth)) / 2
    return {
      marginRight: _marginRight
    }
  },
  methods: {
    handleClick (event) {
      if (this.isMeScroll) {
        this.scroll.scrollTo(0, 500)
      } else {
        this.scroll.scrollTo(0, 0, 500)
      }
    }
  }
}
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
</style>
