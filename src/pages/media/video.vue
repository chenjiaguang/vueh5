<template>
  <div class="video-page" @click.stop="toggleShowButtons" @touchmove.prevent>
    <video playsinline id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
    </video>
    <div :style="{opacity: pageData.show_buttons ? 1 : 0, zIndex: 2, backgroundColor: (pageData.ended && pageData.paused) ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'}" class="video-mask-wrapper">
      <div @click.stop class="video-bar-wrapper">
        <video-bar ref="videoBar" :video="video" :min="pageData.min" :max="pageData.max" v-model="pageData.percent" :buffered="buffered" @setTime="setTime" @toggleFullScreen="toggleFullScreen" />
      </div>
      <div @click.stop class="video-title">papi酱的周一放送——做人难，做女人难，在夏天做女人才更papi酱的周一放送——做人难，做女人难，在夏天做女人难！做女人难，在夏天做女人才更难！做</div>
      <div @click.stop class="comment-and-like">
        <div class="comment-and-like-item" @click.stop="changeLike" :style="{paddingLeft: 0, color: pageData.has_like ? '#FE5273' : '#fff'}">
          <div class="comment-and-like-icon-box">
            <transition name="fade">
              <i v-if="pageData.has_like" class='iconfont icon-like_v_2_5 comment-and-like-icon'></i>
            </transition>
            <transition name="fade">
              <i v-if="!pageData.has_like" class='iconfont icon-dislike_v_2_5 comment-and-like-icon'></i>
            </transition>
            <span>{{likeNumber || '赞'}}</span>
          </div>
        </div>
        <div class="comment-and-like-item" style="padding-right: 0;">
          <div class="comment-and-like-icon-box">
            <i class="iconfont icon-comment_icon comment-and-like-icon"></i>
            <span>{{commentNumber || '评论'}}</span>
          </div>
        </div>
      </div>
      <div v-show="!pageData.waiting && !(pageData.ended && pageData.paused)" @click.stop="togglePlay" class="pause-and-play">
        <i class="big-play-icon iconfont" :class="{'icon-pause': (!pageData.ended) && (!pageData.paused), 'icon-play': (!pageData.ended) && pageData.paused, 'icon-replay': pageData.ended && pageData.paused}"></i>
      </div>
      <div v-show="!pageData.waiting && pageData.ended && pageData.paused" @click.stop="replay" class="replay-btn column">
        <i class="big-replay-icon iconfont icon-replay"></i>
        <div class="big-replay-text">重新播放</div>
      </div>
      <div v-show="pageData.waiting" class="loading-box" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets/image/video_waiting.png)'}"></div>
    </div>
    <div v-show="!pageData.show_buttons" :style="{zIndex: 3}" class="video-mask-wrapper"></div>
    <div v-if="pageData.show_error" :style="{zIndex: 4}" class="video-mask-wrapper">
      <div class="error-text">视频链接已失效</div>
      <div class="error-back-btn">返回</div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import VideoBar from '@/components/VideoBar'
export default {
  data () {
    return {
      video: null,
      buffered: [{
        start: 0,
        end: 0
      }],
      pageData: {
        show_buttons: true,
        has_like: true,
        like_num: 99,
        comment_num: 8594,
        min: 0,
        max: 0,
        percent: 0,
        paused: false,
        ended: false,
        waiting: false,
        show_error: false
      }
    }
  },
  components: {VideoBar},
  computed: {
    likeNumber () {
      let num = parseInt(this.pageData.like_num)
      return num > 999 ? '999+' : num
    },
    commentNumber () {
      let num = parseInt(this.pageData.comment_num)
      return num > 999 ? '999+' : num
    }
  },
  methods: {
    replay () {
      this.pageData.percent = 0
      this.video.play()
    },
    togglePlay () {
      if (this.video.paused()) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    toggleShowButtons () {
      this.pageData.show_buttons = !this.pageData.show_buttons
    },
    setTime (second) {
      this.video.currentTime(second)
    },
    toggleFullScreen () {
      console.log('fullScreen')
    },
    changeLike () {
      this.pageData.has_like = !this.pageData.has_like
    }
  },
  mounted () {
    this.video = videojs('fantuan_video', {
      muted: true,
      controls: false,
      loop: false,
      fluid: false,
      inactivityTimeout: 5000,
      nativeControlsForTouch: false,
      playbackRates: [0.5, 1, 1.5, 2]
    })
    this.video.src(
      'https://lmsjy.qq.com/usdfsf7b7bd9b15a8637c72e27b4fb&vkey=0208C9AD3644D667BA2919468028040329954C9A198D7380B3435882FEB623BC2B40DEEBD831CA1485CF184DB850B76E8E7B1F3B924D53D715140B6A638A88DE42C0B436C0DEE4BECE5B5E83E4696C0B135885320614420F06A10F0BF9663F555147BAFF0916AC4A03178996CD9A3686E52DCCC61D7F0D78&platform=2'
    )
    this.video.on('durationchange', e => {
      this.pageData.min = 0
      this.pageData.max = this.video.duration()
      this.buffered[0].start = this.video.buffered().start(0)
      this.buffered[0].end = this.video.buffered().end(0)
    })
    this.video.on('timeupdate', e => {
      this.pageData.percent = this.video.currentTime()
    })
    this.video.on('progress', e => {
      let len = this.video.buffered().length
      let _buffered = []
      for (let i = 0; i < len; i++) {
        _buffered.push({start: this.video.buffered().start(i), end: this.video.buffered().end(i)})
      }
      this.buffered = _buffered
    })
    this.video.on('play', e => {
      console.log('play')
      this.pageData.paused = false
      this.pageData.ended = false
    })
    this.video.on('pause', e => {
      this.pageData.paused = true
    })
    this.video.on('ended', e => {
      console.log('ended')
      this.pageData.ended = true
    })
    this.video.on('waiting', () => {
      console.log('缓冲中')
      this.pageData.waiting = true
    })
    this.video.on('canplay', () => {
      this.pageData.waiting = false
    })
    this.video.on('error', e => { // 播放出错
      console.log('播放出错')
      this.pageData.show_error = true
    })
    // 隐藏默认缓冲中的样式
    this.video.getChild('LoadingSpinner').hide()

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
.video-js .vjs-error-display {
  display: none;
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
  position: relative;
  width: 100%;
  height: 100%;
}
.video-mask-wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: opacity 500ms;
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
  z-index: 1;
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

// 视频上覆盖的mask层样式
.video-bar-wrapper{
  padding: 0 4%;
}
@media all and (orientation : landscape){
  body .video-bar-wrapper{
    height: 65PX;
    display: flex;
    align-self: stretch;
    align-items: center;
    background: linear-gradient(rgba(12, 12, 12, 0), rgba(0, 0, 0, 1));
  }
  body .video-title, body .comment-and-like{
    display: none;
  }
}
@media all and (orientation : portrait){
  .video-bar-wrapper{
    height: 20PX;
  }
}
.video-title{
  position: relative;
  font-size: 14PX;
  line-height: 17PX;
  color: #fff;
  margin-top: 12PX;
  padding: 0 4%;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.like-and-comment{
  position: relative;
  height: 45PX;
  display: flex;
}

.comment-and-like{
  display: flex;
  width: 100%;
  height:45PX;
  line-height: 45PX;
  text-align: center;
  position: relative;
  box-sizing: content-box;
  padding-top: 33PX;
}
.comment-and-like-item{
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 4%;
  color: #fff;
  position: relative;
}
.comment-and-like-icon-box{
  height: 100%;
  overflow: hidden;
  text-align: center;
  position: absolute;
  padding-left: 40PX;
  padding-right: 10PX;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-size: 13PX;
}
.comment-and-like-icon{
  display: block;
  position: absolute;
  left: 10PX;
  // top: 50%;
  // transform: translateY(-50%);
  font-size: 20PX;
  line-height: 45PX;
  color: inherit;
  overflow: visible;
}
.icon-like_v_2_5{
  color: #FE5273;
}
.icon-dislike_v_2_5{
  color: #fff;
}
.pause-and-play{
  width: 50PX;
  height: 50PX;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.replay-btn{
  height: 50PX;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: 17PX;
  transform: translate(-50%, -50%);
  box-sizing: content-box;
}
.big-play-icon{
  font-size: 20PX;
  line-height: 30PX;
  color: #fff;
}
.big-replay-icon{
  font-size: 40PX;
  line-height: 44PX;
  color: #fff;
}
.big-replay-text{
  font-size: 14PX;
  line-height: 34PX;
  color: #fff;
}
.loading-box{
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 30PX;
  height: 30PX;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -15PX;
  margin-left: -15PX;
  animation: linearRotate 1s linear infinite;
}
@keyframes linearRotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
.error-text{
  font-size: 14PX;
  line-height: 18PX;
  color: #fff;
}
.error-back-btn{
  width: 90PX;
  height: 40PX;
  font-size: 40PX;
  line-height: 40PX;
  color: #fff;
  background: #1EB0FD;
  text-align: center;
  border-radius: 3PX;
  margin-top: 23PX;
}
.fade-enter-active, .fade-leave-active {
  transition: all 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5)
}
</style>
