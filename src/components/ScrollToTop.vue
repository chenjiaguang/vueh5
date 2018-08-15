<template>
  <div :class="['fix-box',visible?null:'hide']" @click="handleClick">
    <i class="iconfont icon-back_top"></i>
  </div>
</template>
<script>
export default {
  props: ['visible', 'click'],
  data () {
    return {};
  },
  computed: {},
  components: {},
  methods: {
    handleClick (event) {
      this.$emit('click', event);
    }
  }
};
</script>
<style scoped>
.fix-box {
  position: fixed;
  height: 88px;
  width: 88px;
  right: 50px;
  bottom: 153px;
  padding: 22px;
  background-color: #000000;

  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: 0.5;
  border-radius: 6px;
  transition: all 0.25s;
}
.hide {
  opacity: 0;
}
.icon-back_top {
  font-size: 44px;
  color: #ffffff;
}
</style>
