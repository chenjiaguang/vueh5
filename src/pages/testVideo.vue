<template>
  <div class="video-page">
    <div class="">播放视频</div>
    <video id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
      <source src="https://mat1.gtimg.com/v/dee/Detective.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
export default {
  data () {
    return {
      video: null
    }
  },
  mounted () {
    this.video = videojs('fantuan_video', {
      muted: true,
      controls: true,
      loop: false,
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
}
</script>

<style lang="scss" scoped>
  .video-page{
    width: 80%;
  }
  .my-video{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>
