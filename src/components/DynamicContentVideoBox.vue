//动态固底交互
<template>
  <div class="content-video-box column" >
    <div class="video-content" :style="`background-image:url(${dynamic.linkInfo.originalCover})`" @click.stop="jumpVideo">
      <div class="video-content-button column center">
          <i class='iconfont icon-play'></i>
      </div>
      <!-- <div class="video-content-duration">
        02:38
      </div> -->
    </div>
    <a class="video-info column" :href="dynamic.linkInfo.url">
      <div class="title">{{dynamic.linkInfo.title}}</div>
      <div class="from">{{dynamic.linkInfo.from}}</div>
    </a>
  </div>
</template>
<script>
export default {
  props: ['dynamic', 'currentTime'],
  data () {
    return {}
  },
  computed: {},
  components: {},
  methods: {
    jumpVideo () {
      this.$router.push({
        name: 'VideoMedia',
        query: { dynamic_id: this.dynamic.id, video_id: this.dynamic.linkInfo.id, like_num: this.dynamic.like_num, comment_num: this.dynamic.comment_num, has_like: this.dynamic.has_like, current_time: this.currentTime, from: '2' }
      })
    }
  },
  mounted () {
    console.log('dynamic', this.dynamic)
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.video-content {
  position: relative;
  width: 690px;
  height: 388px;
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
  justify-content:center;
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
  padding: 17px 0 16px 17px;
  color: #666666;
  font-size: 24px;
}
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 12px;
}
</style>
