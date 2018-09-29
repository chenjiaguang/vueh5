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
    this.video.src(
      'http://baiducdnct.inter.iqiyi.com/videos/v0/20180923/88/af/b0be1e9eaf5d77682b8ce0dbd48577a9.mp4?key=06830ea559949cbcccb85a53fccb46c53&dis_k=5619d41093b46fad9e9525f04ec60362&dis_t=1538126108&dis_dz=CT-JiangSu&dis_st=44&src=iqiyi.com&uuid=a0a0c3c-5badf11c-1bb&m=v&qd_k=20c23a14b3c07f59bbc625216dab4b00&sgti=13_a4d098c2946e11e8a837a81e8486917c_1538126108503&qd_ip=dde6a711&qd_p=dde6a711&dfp=&qd_src=02020031010000000000&ssl=&ip=221.230.167.17&qd_vip=0&dis_src=vrs&qd_uid=0&qdv=1&qd_tm=1538126108685'
    )
    this.video.ready(() => {
      // this.video.getChild('ControlBar').removeChild('PlayToggle')
      this.video.getChild('ControlBar').removeChild('VolumePanel')
      this.video.getChild('ControlBar').removeChild('PlaybackRateMenuButton')
      this.video.getChild('ControlBar').removeChild('RemainingTimeDisplay')
      // this.video.getChild('ControlBar').getChild('CurrentTimeDisplay')
      this.video
        .getChild('ControlBar')
        .addChild(
          this.video.getChild('ControlBar').getChild('DurationDisplay')
        )
      this.video
        .getChild('ControlBar')
        .addChild(
          this.video.getChild('ControlBar').getChild('FullscreenToggle')
        )

      this.video.getChild('BigPlayButton').addClass('vjs-control-bar')
      this.video.getChild('BigPlayButton').on('click', () => {
        console.log('onclick')
      })
      this.video.getChild('BigPlayButton').el().onclick = () => {
        console.log('onclick')
      }
      this.video.getChild('BigPlayButton').trigger('click')
      // vjs-big-play-button
      // vjs-control-bar

      this.video.play()
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
