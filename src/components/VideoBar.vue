<template>
  <div class="bar-wrapper" @click.stop="setNewTime">
    <div class="start-time">
      <div class="max-time-hidden">{{Math.ceil(max) > 3600 ? '59:59:59' : '59:59'}}</div>
      <span class="start-time-show">{{secToTime(per)}}</span>
    </div>
    <div class="slider" ref="slider">
      <div class="buffered" v-for="(item, idx) in buffered" :key="idx" :style="{position: 'absolute', left: (item.start / max) * 100 + '%', top: 0, width: ((item.end - item.start) / max) * 100 + '%'}"></div>
      <div class="process" :style="{width}"></div>
      <div class="thunk" @click.stop ref="trunk" :style="{left}">
        <div class="block" :style="{opacity: pressDown ? 0.6 : 1}"></div>
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
  props: ['video', 'min', 'max', 'value', 'buffered'],
  data () {
    return {
      pressDown: false,
      slider: null,        // 滚动条DOM元素
      thunk: null,         // 拖拽DOM元素
      per: this.value     // 当前值
    }
  },
  methods: {
    secToTime (second) {
      let t
      // 只取到秒数
      second = Math.floor(second)
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
      this.$emit('setTime', this.per)
      if (this.video.paused()) {
        this.video.play()
      }
    }
  },
  watch: {
    value () {
      if (this.pressDown) {
        return false
      }
      this.per = this.value
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
      _this.pressDown = true
      let width = parseInt(_this.width)
      let disX = e.touches[0].clientX
      _this.video.pause()
      document.ontouchmove = function (e) {
        // value, left, width
        // 当value变化的时候，会通过计算属性修改left，width
        // 拖拽的时候获取的新width
        let newWidth = e.touches[0].clientX - disX + width
        // 拖拽的时候得到新的百分比
        let scale = newWidth / _this.slider.offsetWidth
        _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min)
        _this.per = Math.max(_this.per, _this.min)
        _this.per = Math.min(_this.per, _this.max)
        _this.$emit('setTime', _this.per)
      }
      document.ontouchend = function () {
        _this.pressDown = false
        document.ontouchmove = document.ontouchend = null
        _this.video.play()
      }
      document.ontouchcancel = function () {
        _this.pressDown = false
        document.ontouchmove = document.ontouchend = null
        _this.video.play()
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
        return this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2  + 'px'
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
  .slider .process{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:1.5PX 0 0 1.5PX;background:#1EB0FD;/*transition:width 250ms linear;*/}
  .slider .thunk{position:absolute;left:0;top:-11PX;width:25PX;height:25PX;display:flex;justify-content: center;align-items: center;/*transition:left 250ms linear;*/}
  .slider .block{width:60%;height:60%;border-radius:50%;box-shadow:0 0 2.5PX rgba(0,0,0,0.5);background:#fff;transition:.2s all}
  .start-time,.end-time{
    font-size: 12PX;
    line-height: 15PX;
    color: #fff;
  }
  .start-time{
    margin-right: 12.5PX;
    position: relative;
  }
  .max-time-hidden{
    opacity: 0;
  }
  .start-time-show{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .end-time{
    margin-left: 12.5PX;
  }
</style>
