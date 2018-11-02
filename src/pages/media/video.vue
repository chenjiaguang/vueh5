<template>
  <div class="video-page" :style="{backgroundImage: 'url(' + (video ? pageData.poster_url : '') + ')'}" ref="videoPage" @touchstart="pageTouchstart"  @touchmove.prevent @touchend="pageTouchend" @click.stop="toggleShowButtons">
    <!-- <video ref="video" playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5" x5-video-player-fullscreen="true" id="fantuan_video" class="my-video video-js"></video> -->
    <!-- <video src="https://baobab.kaiyanapp.com/api/v1/playUrl?vid=4468&resourceType=video&editionType=default&source=aliyun&ptl=true" playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5" x5-video-player-fullscreen="true" controls></video> -->
    <!-- <canvas id="canvas" width="375" height="200"></canvas> -->
    <div :class="{ended: pageData.ended && pageData.paused}" :style="{opacity: (!pageData.show_error && pageData.show_buttons) ? 1 : 0, zIndex: 2}" class="video-mask-wrapper">
      <div @click.stop class="video-bar-wrapper">
        <video-bar ref="videoBar" :video="video" :min="pageData.min" :max="pageData.max" v-model="pageData.percent" :buffered="buffered" @setTime="setTime" @toggleFullScreen="toggleFullScreen" />
      </div>
      <div @click.stop class="video-title">{{pageData.title}}</div>
      <div @click.stop class="comment-and-like" v-if="$route.query.dynamic_id">
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
        <div class="comment-and-like-item" @click.stop="goComment" style="padding-right: 0;">
          <div class="comment-and-like-icon-box">
            <i class="iconfont icon-comment_icon comment-and-like-icon"></i>
            <span>{{commentNumber || '评论'}}</span>
          </div>
        </div>
      </div>
      <div ref="bigPlayBtn" v-show="!pageData.waiting && !(pageData.ended && pageData.paused)" @click.stop="togglePlay" class="pause-and-play">
        <i class="big-play-icon iconfont" :class="{'icon-pause': (!pageData.ended) && (!pageData.paused), 'icon-play': (!pageData.ended) && pageData.paused, 'icon-replay': pageData.ended && pageData.paused}"></i>
      </div>
      <div v-show="!pageData.waiting && pageData.ended && pageData.paused" @click.stop="replay" class="replay-btn column">
        <i class="big-replay-icon iconfont icon-replay"></i>
        <div class="big-replay-text">重新播放</div>
      </div>
      <div v-show="pageData.waiting" class="loading-box" :style="{backgroundImage: 'url(' + $assetsPublicPath + '/cwebassets/image/video_waiting.png)'}"></div>
    </div>
    <div v-show="!pageData.show_buttons && !pageData.show_error" :style="{zIndex: 3}" class="video-mask-wrapper"></div>
    <div v-if="pageData.show_error" :style="{zIndex: 4}" class="video-mask-wrapper error">
      <div class="error-content">
        <div class="error-text">视频链接已失效</div>
        <div class="error-back-btn" @click.stop="$router.go(-1)">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/lib/utils'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-flash'
// import 'videojs-flvjs/dist/videojs-flvjs.min.js'
import VideoBar from '@/components/VideoBar'
// from参数(1表示上个页面是列表页，2表示上个页面是详情页)
export default {
  data () {
    localStorage.video_url = this.$route.params.video_url || localStorage.video_url || ''
    localStorage.poster_url = this.$route.params.poster_url || localStorage.poster_url || ''
    localStorage.video_title = this.$route.params.video_title || localStorage.video_title || ''
    return {
      timer: null,
      video: null,
      buffered: [{
        start: 0,
        end: 0
      }],
      pageData: {
        video_url: this.$route.params.video_url || localStorage.video_url,
        poster_url: this.$route.params.poster_url || localStorage.poster_url,
        refresh: false,
        first: true,
        title: this.$route.params.video_title || localStorage.video_title,
        show_buttons: true,
        has_like: this.$route.query.has_like,
        like_num: this.$route.query.like_num,
        comment_num: this.$route.query.comment_num,
        min: 0,
        max: 0,
        percent: 0,
        paused: true,
        ended: false,
        waiting: true,
        show_error: false,
        url: ''
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
  watch: {
    'pageData.show_buttons' (val, oldVal) {
      if (val && !oldVal) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.pageData.show_buttons = false
        }, 3000)
      } else {
        clearTimeout(this.timer)
      }
    },
    'pageData.ended' (val, oldVal) {
      if (val && !oldVal) {
        this.pageData.show_buttons = true
        this.$nextTick(() => {
          clearTimeout(this.timer)
        })
      } else if (!val && oldVal) {
        this.timer = setTimeout(() => {
          this.pageData.show_buttons = false
        }, 3000)
      }
    }
  },
  methods: {
    pageTouchstart () {
      if (this.pageData.show_buttons) {
        clearTimeout(this.timer)
      }
    },
    pageTouchend () {
      if (this.pageData.show_buttons && !this.pageData.ended) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.pageData.show_buttons = false
        }, 3000)
      }
    },
    replay () {
      this.pageData.percent = 0
      this.video.play()
    },
    togglePlay () {
      // console.log('togglePlay', this.video)
      if (this.video.paused()) {
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    toggleShowButtons () {
      if (this.pageData.ended) {
        return false
      }
      this.pageData.show_buttons = !this.pageData.show_buttons
    },
    setTime (second) {
      this.video.currentTime(second)
    },
    toggleFullScreen () {
      console.log('fullScreen')
    },
    showVideoBuffered () {
      let len = this.video.buffered().length
      let _buffered = []
      for (let i = 0; i < len; i++) {
        _buffered.push({start: this.video.buffered().start(i), end: this.video.buffered().end(i)})
      }
      this.buffered = _buffered
    },
    getSecondFromDuration (duration) {
      let timeArr = duration.split(':').reverse()
      let seconds = 0
      timeArr.forEach((item, idx) => {
        if (idx === 0) {
          seconds += parseInt(item)
        } else if (idx === 1) {
          seconds += parseInt(item) * 60
        } else if (idx === 2) {
          seconds += parseInt(item) * 3600
        }
      })
      return seconds
    },
    goComment () {
      if (this.$route.query.from.toString() === '2') {
        this.$router.go(-1)
      } else if (this.$route.query.from.toString() === '1') {
        this.$router.push({name: 'DynamicDetail', query: {id: this.$route.query.dynamic_id}})
      }
    },
    changeLike () {
      if (!utils.checkLogin()) {
        return false
      }
      const isLike = this.pageData.has_like
      const likeNum = parseInt(this.pageData.like_num)
      let rData = {
        id: this.$route.query.dynamic_id,
        like: !isLike,
        type: 0
      }
      this.pageData.has_like = !isLike
      this.pageData.like_num = likeNum + (isLike ? -1 : 1)
      this.submitting = true
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (!res || (res && Boolean(res.error))) { // 出错时重置点赞
          this.pageData.has_like = isLike
          this.pageData.like_num = likeNum
          this.submitting = false
        } else {
          this.submitting = false
        }
      }).catch(err => {
        this.pageData.has_like = isLike
        this.pageData.like_num = likeNum
        this.submitting = false
      })
    },
    refreshVideoAddress () {
      this.$ajax('/jv/anonymous/qz/linkanalysis/refresh', {data: {linkid: this.$route.query.video_id}}).then(res => {
        this.refresh = true
        if (res && !res.error && res.data && res.data.videoAddress) {
          this.pageData.title = res.data.title
          localStorage.video_title = res.data.title
          // document.getElementById('fantuan_video').style.display = 'none'
          // this.video.dispose()
          this.initVideo(res.data.videoAddress, res.data.originalCover, res.data.duration)
        } else {
          this.pageData.show_error = true
        }
      }).catch(err => {
        this.pageData.show_error = true
      })
    },
    initVideo (url, poster, duration) {
      videojs.options.flash.swf = 'https://vjs.zencdn.net/swf/5.4.2/video-js.swf'
      this.pageData.video_url = url
      this.pageData.poster_url = poster
      localStorage.video_url = url
      localStorage.poster_url = poster
      // 动态往页面上添加video
      let _video = document.createElement('video')
      _video.setAttribute('playsinline', 'playsinline')
      _video.setAttribute('webkit-playsinline', true)
      _video.setAttribute('x5-playsinline', true)
      _video.setAttribute('x5-video-player-type', 'h5')
      _video.setAttribute('x5-video-player-fullscreen', true)
      _video.setAttribute('id', 'fantuan_video')
      _video.setAttribute('width', '401px')
      _video.setAttribute('height', '301px')
      _video.setAttribute('src', url)
      _video.className = 'my-video video-js'
      const len = Object.keys(this.$refs['videoPage'].dataset).length
      let attr = ''
      for (let i = 0; i < len; i++) {
        // console.log('key', Object.keys(this.$refs['videoPage'].dataset)[i])
        if (Object.keys(this.$refs['videoPage'].dataset)[i].indexOf('v-') > -1) {
          attr = Object.keys(this.$refs['videoPage'].dataset)[i]
        }
      }
      // 添加对应的dataset
      _video.setAttribute('data-' + attr, '')
      this.$refs['videoPage'].appendChild(_video)
      this.video = videojs('fantuan_video', {
        preload: true,
        autoplay: false,
        muted: false,
        controls: false,
        loop: false,
        fluid: false,
        techOrder: ['flash', 'html5'],
        inactivityTimeout: 5000,
        nativeControlsForTouch: false,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
          {
            src: url,
            type: 'video/mp4'
          },
          {
            src: url,
            type: 'video/webm'
          },
          {
            src: url,
            type: 'video/ogg'
          },
          {
            src: url,
            type: 'rtmp/flv'
          }
        ]
      })
      // this.video.poster(poster)
      this.video.on('durationchange', e => { // 播放长度更新
        // console.log('durationchange', isNaN(this.video.duration()))
        if (!isNaN(this.video.duration())) {
          this.pageData.max = this.video.duration()
        }
        this.showVideoBuffered()
      })
      this.video.on('timeupdate', e => { // 播放进度更新
        if (this.pageData.waiting) {
          this.pageData.waiting = false
        }
        this.pageData.percent = this.video.currentTime()
      })
      this.video.on('progress', e => { // 缓冲加载数据成功
        this.showVideoBuffered()
      })
      this.video.on('play', e => { // 播放
        this.pageData.paused = false
        this.pageData.ended = false
      })
      this.video.on('pause', e => { // 暂停
        this.pageData.paused = true
      })
      this.video.on('ended', e => { // 播放完毕
        this.pageData.ended = true
      })
      this.video.on('waiting', () => { // 正在缓冲
        this.pageData.waiting = true
      })
      this.video.on('loadeddata', () => { // 加载数据成功
        // console.log('loadeddata')
        if (this.pageData.first) {
          this.pageData.first = false
          this.video.currentTime(parseInt(this.$route.query.current_time || 0))
        }
      })
      // this.video.on('canplay', () => { // 可播放
      //   console.log('canplay')
      //   this.pageData.waiting = false
      // })
      this.video.on('error', e => { // 播放出错
        // console.log('error')
        if (this.refresh) {
          this.pageData.show_error = true
          return false
        }
        this.pageData.waiting = true
        this.video.dispose()
        this.refreshVideoAddress()
      })
      // 隐藏默认缓冲中的样式
      this.video.getChild('LoadingSpinner').hide()
      this.video.ready(() => {
        // console.log('ready')
        this.pageData.waiting = false
        this.pageData.percent = parseInt(this.$route.query.current_time || 0)
        this.video.poster(poster)
      })
    },
    orientationChange () {
      let orientation = window.orientation
      switch (orientation) {
      case 90:
      case -90:
        orientation = 'landscape'
        // 这里是横屏
        break
      default:
        orientation = 'portrait'
        // 这里是竖屏
        break
      }
    }
  },
  mounted () {
    // this.getVideoAddress()
    let {video_duration} = this.$route.query
    let {video_url, poster_url} = this.pageData
    // 设置最小、最大时间
    this.pageData.min = 0
    this.pageData.max = this.getSecondFromDuration(video_duration)
    // 初始化视频
    this.initVideo(video_url || localStorage.video_url, poster_url || localStorage.poster_url, video_duration)
  },
  beforeDestroy () {
    if (this.video && this.video.dispose) {
      this.video.dispose()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.video) {
      from.params.videoPoint = this.pageData.ended ? 0 : this.video.currentTime()
    }
    next()
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
#canvas{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background: red;
  display: block;
  width: 375PX;
  height: 200PX;
}
.video-page {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.video-mask-wrapper{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 500ms;
}
.video-mask-wrapper.ended{
  background-color: rgba(0,0,0,0.5);
}
.my-video {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
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
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
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
.video-mask-wrapper.error{
  background-color: rgba(0,0,0,1);
}
.error-content{
  position: absolute;
  width: 100%;
  top: 17%;
}
.error-text{
  font-size: 14PX;
  line-height: 18PX;
  padding: 0 4%;
  color: #fff;
  text-align: center;
}
.error-back-btn{
  width: 90PX;
  height: 40PX;
  font-size: 15PX;
  line-height: 40PX;
  color: #fff;
  background: #1EB0FD;
  text-align: center;
  border-radius: 3PX;
  margin: 23PX auto 0;
}
.fade-enter-active, .fade-leave-active {
  transition: all 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5)
}
</style>
