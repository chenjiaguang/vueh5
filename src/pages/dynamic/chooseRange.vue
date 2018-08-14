<template>
  <transition >
    <div class="range-box">
      <div class="range-item" v-for="(item, idx) in range" :key="idx" @click="onTap(item)">
        <div class="left-box">
          <div class="title">{{item.title}}</div>
          <div class="state">{{item.state}}</div>
        </div>
        <i class="iconfont check-icon" :class="{'icon-quanzi': selected.toString() === item.code.toString(), 'icon-quan': selected.toString() !== item.code.toString()}"></i>
        </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.range-item{
  position: relative;
  height: 116px;
  overflow: visible;
  margin: 0 4%;
}
.range-item:before{
  content: "";
  display: block;
  width: 300%;
  height: 3px;
  background: #E1E1E1;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.left-box{
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.title{
  font-size: 30px;
  line-height: 46px;
}
.state{
  font-size: 24px;
  line-height: 40px;
  color: #999;
}
.check-icon{
  font-size: 48px;
  color: #E1E1E1;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.check-icon.icon-quanzi{
  color: #1EB0FD;
}
</style>

<script>
export default {
  data () {
    return {
      selected: this.$route.query.selected,
      range: [
        {
          title: '公开',
          state: '所有人可见',
          code: '0'
        },
        {
          title: '仅好友可见',
          state: '仅相互关注好友可见',
          code: '1'
        },
        {
          title: '仅自己可见',
          state: '',
          code: '2'
        }
      ]
    }
  },
  methods: {
    onTap (item) {
      console.log('onTap')
      this.selected = item.code
      this.$route.query.selected = item.code
    }
  }
}
</script>

