<template>
  <div class="video-page" @touchmove.prevent>
    <video id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
      <source src="https://ugcydzd.qq.com/uwMRJfz-r5jAYaQXGdGnC2_ppdhgmrDlPaRvaV7F2Ic/q0784gucsx3.mp4?sdtfrom=v3010&guid=c014f13a7b7bd9b15a8637c72e27b4fb&vkey=1A8C053C8376538F1A1FAA25756FBD992E6541E80579A11B74967F05C4CDC655B243985736064FF9AE0FAA3B18296D99873304B1E713BBE9BE3B7414555ACEEA0E1B52587B1E0C805EC28CA989FC236EEB000C5FD8DEB68FD7719BC23A771F1146634F6386B07B36990C2451FDB2528A1DBAFA1DEC8FC3A1&platform=2" type="video/mp4">
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
      fluid: true,
      inactivityTimeout: 5000,
      nativeControlsForTouch: false
    })
  }
}
</script>

<style lang="scss" scoped>
  .video-page{
    width: 100%;
  }
</style>
