<template>
  <div v-if="dynamic" class="content-video-box column">
    <div
      class="video-content"
      :style="`background-image:url(${showData.cover})`"
      @click.stop="jumpVideo"
    >
      <div class="video-content-button column center">
        <i class="iconfont icon-play"></i>
      </div>
      <!-- <div class="video-content-duration">
        02:38
      </div>-->
    </div>
    <a class="video-info column" :href="showData.url" v-if="showData.title&&showData.from">
      <div class="title">{{showData.title}}</div>
      <div class="from">{{showData.from}}</div>
    </a>
  </div>
</template>
<script>
export default {
  props: ['dynamic', 'currentTime', 'from'],
  data () {
    return {
      showData: {
      }
    }
  },
  components: {},
  mounted () {
    this.showData = this.getShowData()
  },
  methods: {
    jumpVideo () {
      this.$router.push({
        name: 'VideoMedia',
        query: this.getJumpQuery(),
        params: this.getJumpParams()
      })
      // window._video.video.src('http://180.97.241.182/69742340BE14381AEEE2013792/03000A01005BA74AEFAF57145E3147B235BE07-6BFE-4965-82D5-45C9D04B2030.mp4?ccode=0501&duration=96&expire=18000&psid=8526f9f3ef86abc67816fdaac80da61a&ups_client_netip=3ad03118&ups_ts=1539142975&ups_userid=&utid=PmNEFJKjaBECAXFMEmvcD8cT&vid=XMzgzNDg3MDE4NA&vkey=Ace7b2b900c9261991a9e9d1c82c123e1&sp=')
      // window._video.video.play()
      // this.$ajax('/jv/anonymous/qz/linkanalysis/getVideoAddress', {data: {linkid: this.dynamic.linkInfo.id}}).then(res => {
      //   if (res && !res.error && res.data && res.data.videoAddress) {
      //     console.log('data', res.data)
      //     // this.initVideo(res.data.videoAddress, res.data.originalCover, res.data.duration)
      //     // this.$video.show({video_url: res.data.videoAddress, poster: res.data.originalCover, video_time: 0})
      //     document.getElementsByClassName('pause-and-play')[0].click()
      //   } else {
      //     // this.pageData.show_error = true
      //   }
      // }).catch(err => {
      //   // this.pageData.show_error = true
      // })
    },
    getShowData () {
      if (this.dynamic && this.dynamic.linkInfo) {
        return {
          cover: this.dynamic.linkInfo.originalCover,
          url: this.dynamic.linkInfo.url,
          title: this.dynamic.linkInfo.title,
          from: this.dynamic.linkInfo.from
        }
      } else if (this.dynamic && this.dynamic.videoInfo) {
        return {
          cover: this.dynamic.videoInfo.covers[0].url,
          url: '',
          title: '',
          from: ''
        }
      } else {
        return {}
      }
    },
    getJumpQuery () {
      if (this.dynamic && this.dynamic.linkInfo) {
        return {
          dynamic_id: this.dynamic.id,
          video_id: this.dynamic.linkInfo.id,
          like_num: this.dynamic.like_num,
          comment_num: this.dynamic.comment_num,
          has_like: this.dynamic.has_like,
          current_time: this.dynamic.videoPoint || this.currentTime,
          from: this.from || 2,
          video_duration: this.dynamic.linkInfo.duration
        }
      } else if (this.dynamic && this.dynamic.videoInfo) {
        return {
          dynamic_id: this.dynamic.id,
          video_id: '',
          like_num: this.dynamic.like_num,
          comment_num: this.dynamic.comment_num,
          has_like: this.dynamic.has_like,
          current_time: this.dynamic.videoPoint || this.currentTime,
          from: this.from || 2,
          video_duration: this.dynamic.videoInfo.duration
        }
      } else {
        return {}
      }
    },
    getJumpParams () {
      if (this.dynamic && this.dynamic.linkInfo) {
        return {
          video_url: this.dynamic.linkInfo.videoAddress,
          poster_url: this.dynamic.linkInfo.originalCover,
          video_title: this.dynamic.content || this.dynamic.linkInfo.title
        }
      } else if (this.dynamic && this.dynamic.videoInfo) {
        return {
          video_url: this.dynamic.videoInfo.play_url,
          poster_url: this.dynamic.videoInfo.covers[0].url,
          video_title: this.dynamic.content || ''
        }
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.video-content {
  position: relative;
  width: 100%;
  padding-top: 56.23%;
  background-color: #eeeeee;
  background-size: cover;
  background-position: center;
}
.video-content-button {
  margin: auto;
  position: absolute;
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
}
.icon-play {
  color: #ffffff;
  font-size: 36px;
}
.video-content-duration {
  position: absolute;
  right: 16px;
  bottom: 16px;
  font-size: 22px;
  color: #ffffff;
  text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.5);
}
.video-info {
  background-color: #f5f5f5;
  padding: 15px 0 16px 15px;
  color: #666666;
  font-size: 24px;
}
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 28px;
  margin-bottom: 8px;
}
.from {
  line-height: 28px;
}
</style>
