<template>
  <keep-alive>
    <div class="option-box" @click.stop="onTap">
      <div class="option-header clearfix" :style="{paddingRight: option.rightIcon ? '11%' : 0}">
        <i :class="leftIconClass" v-if="option.leftIcon"></i>
        <div class="title fl" :style="{width: (option.rightText || option.rightIcon) ? '60%' : '100%'}">{{option.title}}</div>
        <div class="right-text fr" v-if="option.rightText">{{option.rightText}}</div>
        <i :class="rightIconClass" v-if="option.rightIcon"></i>
      </div>
      <div class="extra-box">
        <slot name="extra"></slot>
      </div>
    </div>
  </keep-alive>
</template>

<style lang="scss" scoped>
.option-box{
  padding-bottom: 26px;
  position: relative;
}
.option-box:before{
  content: "";
  display: block;
  width: 300%;
  height: 3px;
  background: #E1E1E1;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 100%;
}
.option-header{
  position: relative;
  box-sizing:border-box;
  font-size: 30px;
  line-height: 48px;
  padding: 26px 0 0 11%;
  overflow: visible;
}
.left-icon{
  font-size: 40px;
  color: #4B4B4B;
  position: absolute;
  left: 0.3%;
  top: 26px;
}
.title{
  width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.right-text{
  width: 40%;
  color: #999;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right-icon{
  font-size: 20px;
  color: #BBBBBB;
  position: absolute;
  right: 0;
  top: 26px;
}
.right-icon.next{
  transform: translateX(18%);
}
</style>

<script>
export default {
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    leftIconClass () {
      let _class = ''
      if (this.option.leftIcon) {
        _class = 'iconfont left-icon icon-' + this.option.leftIcon
      } else {
        _class = 'left-icon'
      }
      return _class
    },
    rightIconClass () {
      let _class = ''
      if (this.option.rightIcon) {
        if (this.option.rightIcon === 'next') {
          _class = 'iconfont right-icon next icon-' + this.option.rightIcon
        } else {
          _class = 'iconfont right-icon icon-' + this.option.rightIcon
        }
      } else {
        _class = 'right-icon'
      }
      return _class
    }
  },
  methods: {
    onTap () {
      this.$emit('tapFunc')
    }
  }
}
</script>
