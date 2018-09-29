<template>
  <div class="video-page" @touchmove.prevent>
    <video playsinline id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
    </video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
export default {
  data () {
    return {
      video: null,
      curremtTime: '01:34',
      durationTime: '03:38'
    }
  },
  mounted () {
    this.video = videojs('fantuan_video', {
      muted: true,
      controls: true,
      loop: false,
      fluid: false,
      inactivityTimeout: 5000,
      nativeControlsForTouch: false,
      playbackRates: [0.5, 1, 1.5, 2]
    })
    // 设置视频
    this.video.src(
      'https://vjs.zencdn.net/v/oceans.mp4'
    )
    // 设置封面
    // this.video.poster('http://example.com/myImage.jpg')
    // 当前是否暂停
    // console.log(this.video.paused())
    // 视频播放
    // this.video.play()
    // 视频暂停
    // this.video.pause()
    // 设置当前时间
    // this.video.currentTime(30)
    this.video.ready(() => {
      this.video.play()
      this.video.on('timeupdate', e => {
        // console.log('播放进度更新', this.video.currentTime())
      })
      this.video.on('progress', e => {
        // console.log('下载进度更新')
        // console.log('buffered_start', this.video.buffered().start(0))
        // console.log('buffered_end', this.video.buffered().end(0))
      })
      this.video.on('ended', e => {
        console.log('播放完毕')
      })
      this.video.on('play', e => {
        console.log('播放')
      })
      this.video.on('pause', e => {
        console.log('暂停')
      })
      this.video.on('durationchange', e => {
        console.log('总时长', this.video.duration())
      })
      this.video.on('error', e => {
        console.log('播放出错')
      })
      this.video.on('waiting', e => {
        console.log('缓冲')
      })
      this.video.on('canplay', e => {
        console.log('可以播放（缓冲结束）')
      })
    })
  }
}
</script>

<style>
.video-js .vjs-control-bar {
  margin-bottom: 30px;
  height: 40px;
  background-color: #000000;
}
.video-js .vjs-control {
  width: auto;
  padding-left: 0;
  padding-right: 0;
}
.video-js .vjs-play-progress {
  color: #ffffff;
  background-color: #1eb0fd;
}
.video-js .vjs-time-control {
  line-height: 40px;
}

.video-js .vjs-big-play-button {
  height: 100px;
  width: 100px;
  margin: auto;
}

/* 缓冲条 */
.video-js .vjs-load-progress div {
  background-color: #ffffff;
}
/* 整个进度条 */
.video-js .vjs-load-progress {
  background-color: #b7b7b7;
}
.video-js .vjs-progress-holder {
  height: 4px;
}

/* 拖拽的圆圈 */
.video-js .vjs-play-progress:before {
  font-size: 30px;
  top: -13px;
  box-shadow: #000000;
}

/* 全屏按钮 */
.vjs-button > .vjs-icon-placeholder:before {
  position: relative;
  font-size: 54px;
  line-height: 42px;
}
.vjs-fullscreen-control {
  margin-left: 24px !important;
  margin-right: 30px !important;
}

/* 总时长 */
.video-js .vjs-duration,
.vjs-no-flex .vjs-duration {
  display: block;
}
.vjs-duration-display {
  line-height: 42px;
  font-size: 20px;
}
.vjs-duration {
  width: 70px !important;
  text-align: right !important;
}

/* 当前时间 */
.video-js .vjs-current-time,
.vjs-no-flex .vjs-current-time {
  display: block;
}
.vjs-current-time-display {
  line-height: 42px;
  font-size: 20px;
}
.vjs-current-time {
  margin-left: 30px !important;
  width: 66px !important;
  text-align: left !important;
}
</style>

<style lang="scss" scoped>
.video-page {
}
.my-video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: auto;
  height: auto;
}
.my-control-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
}
.current-time {
  font-size: 20px;
  color: #ffffff;
  width: 76px;
  margin-left: 30px;
}
.progress-control {
  flex: 1;
  height: 50px;
}

.duration-time {
  font-size: 20px;
  color: #ffffff;
  width: 70px;
  text-align: right;
}
.all-screen {
  height: 38px;
  width: 38px;
  margin-left: 24px;
  margin-right: 30px;
}
</style>
