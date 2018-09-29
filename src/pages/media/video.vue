<template>
  <div class="video-page" @touchmove.prevent>
    <video playsinline id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
    </video>
    <div class="video-mask-wrapper">
      <div class="video-bar-wrapper">
        <video-bar :min="0" :max="100" v-model="percent" :buffered="buffered" @setTime="setTime" @toggleFullScreen="toggleFullScreen" />
      </div>
      <div class="video-title">papi酱的周一放送——做人难，做女人难，在夏天做女人才更papi酱的周一放送——做人难，做女人难，在夏天做女人难！做女人难，在夏天做女人才更难！做</div>
      <div class="comment-and-like">
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
      curremtTime: '01:34',
      durationTime: '03:38',
      percent: 0,
      buffered: [{
        start: 20,
        end: 30
      }, {
        start: 50,
        end: 70
      }],
      pageData: {
        has_like: true,
        like_num: 99,
        comment_num: 8594
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
    setTime () {
      console.log('setTime')
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
      'https://ugcbsy.qq.com/uwMRJfz-r5jAYaQXGdGnC2_ppdhgmrDlPaRvaV7F2Ic/m0719eamxsy.mp4?sdtfrom=v3010&guid=c014f13a7b7bd9b15a8637c72e27b4fb&vkey=B3654C408E441FB0E07AE3C31FD868A3500D56C381AC75F23B18582C863861AE4F17CD2546908707F1CBF93CF22DEE1A254109D23EC2041CD4C4AD22EF653616543F80F8CC1673A780265F5924FCB68D2B5DA0733E264276E9E18F54EAC810B72933ADE3D453D6B8E31716056ABE3A517E9219943DBD2F0B&platform=2'
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

// bar样式
.video-bar-wrapper{
  padding: 0 4%;
  margin-top: 200px;
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
.fade-enter-active, .fade-leave-active {
  transition: all 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5)
}
</style>
