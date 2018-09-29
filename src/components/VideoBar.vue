<template>
  <div class="bar-wrapper" @click.stop="setNewTime">
    <div class="start-time">{{secToTime(min)}}</div>
    <div class="slider" ref="slider">
      <div class="buffered" v-for="(item, idx) in buffered" :key="idx" :style="{position: 'absolute', left: (item.start / max) * 100 + '%', top: 0, width: ((item.end - item.start) / max) * 100 + '%'}"></div>
      <div class="process" :style="{width}"></div>
      <div class="thunk" @click.stop ref="trunk" :style="{left}">
        <div class="block" :style="{opacity: blockOpacity}"></div>
      </div>
    </div>
    <div class="end-time">{{secToTime(max)}}</div>
    <div class="full-screen-button"></div>
  </div>
</template>
<script>
/*
  * min 进度条最小值
  * max 进度条最大值
  * v-model 对当前值进行双向绑定实时显示拖拽进度
  * */
export default{
  props: ['min', 'max', 'value', 'buffered'],
  data () {
    return {
      blockOpacity: 1,
      slider: null,        // 滚动条DOM元素
      thunk: null,         // 拖拽DOM元素
      per: this.value     // 当前值
    }
  },
  methods: {
    secToTime (second) {
      this.$emit('setTime', 88)
      let t
      if (second > -1) {
        let hour = Math.floor(second / 3600)
        let min = Math.floor(second / 60) % 60
        let sec = second % 60
        if (hour > 0) {
          if (hour < 10) {
            t = '0' + hour + ':'
          } else {
            t = hour + ':'
          }
        } else {
          t = ''
        }

        if (min < 10) { t += '0' }
        t += min + ':'
        if (sec < 10) { t += '0' }
        t += sec
      }
      return t
    },
    setNewTime (e) {
      console.log('event', e)
      this.slider = this.$refs.slider
      let pos = this.slider.getBoundingClientRect()
      let left = e.clientX - pos.left
      if (left < 0 || left > pos.width) {
        return false
      }
      let scale = left / pos.width
      this.per = Math.ceil((this.max - this.min) * scale + this.min)
      this.per = Math.max(this.per, this.min)
      this.per = Math.min(this.per, this.max)
    }
  },
  // 渲染到页面的时候
  mounted () {
    this.slider = this.$refs.slider
    this.thunk = this.$refs.trunk
    let _this = this
    // this.thunk.onmousedown = function (e) {
    //   let width = parseInt(_this.width)
    //   let disX = e.clientX
    //   document.onmousemove = function (e) {
    //   // value, left, width
    //   // 当value变化的时候，会通过计算属性修改left，width

    //   // 拖拽的时候获取的新width
    //     let newWidth = e.clientX - disX + width
    //     // 拖拽的时候得到新的百分比
    //     let scale = newWidth / _this.slider.offsetWidth
    //     _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min)
    //     _this.per = Math.max(_this.per, _this.min)
    //     _this.per = Math.min(_this.per, _this.max)
    //   }
    //   document.onmouseup = function () {
    //     document.onmousemove = document.onmouseup = null
    //   }
    //   return false
    // }
    this.thunk.ontouchstart = function (e) {
      _this.blockOpacity = 0.6
      let width = parseInt(_this.width)
      let disX = e.touches[0].clientX
      document.ontouchmove = function (e) {
        console.log()
        // value, left, width
        // 当value变化的时候，会通过计算属性修改left，width
        // 拖拽的时候获取的新width
        let newWidth = e.touches[0].clientX - disX + width
        // 拖拽的时候得到新的百分比
        let scale = newWidth / _this.slider.offsetWidth
        _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min)
        _this.per = Math.max(_this.per, _this.min)
        _this.per = Math.min(_this.per, _this.max)
      }
      document.ontouchend = function () {
        _this.blockOpacity = 1
        document.ontouchmove = document.ontouchend = null
      }
      document.ontouchcancel = function () {
        _this.blockOpacity = 1
        document.ontouchmove = document.ontouchend = null
      }
      return false
    }
  },
  computed: {
    // 设置一个百分比，提供计算slider进度宽度和trunk的left值
    // 对应公式为  当前值-最小值/最大值-最小值 = slider进度width / slider总width
    // trunk left =  slider进度width + trunk宽度/2
    scale () {
      return (this.per - this.min) / (this.max - this.min)
    },
    width () {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale + 'px'
      } else {
        return 0 + 'px'
      }
    },
    left () {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale -  this.thunk.offsetWidth / 2  + 'px'
      } else {
        return 0 + 'px'
      }
    }
  }
}
</script>
<style>
/* 这里px用大写，不转为rem */
.bar-wrapper{
  position: relative;
  height: 20PX;
  display: flex;
  align-items: center;
  flex: 1;
}
  .slider{position:relative;flex:1;height:2PX;background:#B7B7B7;border-radius:1.5PX;cursor:pointer;overflow:visible}
  .buffered {
    position: absolute;
    background: #fff;
    height: 100%;
  }
  .slider .process{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:1.5PX 0 0 1.5PX;background:#1EB0FD}
  .slider .thunk{position:absolute;left:0;top:-11PX;width:25PX;height:25PX;display:flex;justify-content: center;align-items: center;}
  .slider .block{width:60%;height:60%;border-radius:50%;box-shadow:0 0 2.5PX rgba(0,0,0,0.5);background:#fff;transition:.2s all}
  .start-time,.end-time{
    font-size: 12PX;
    line-height: 15PX;
    color: #fff;
  }
  .start-time{
    margin-right: 12.5PX;
  }
  .end-time{
    margin-left: 12.5PX;
  }
</style>
