<template>
  <div class="video-page" @touchmove.prevent>
    <video id="fantuan_video" class="my-video video-js vjs-default-skin" controls preload="none" poster="http://vjs.zencdn.net/v/oceans.png">
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
      nativeControlsForTouch: false,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [
        {
          src: 'https://ugcydzd.qq.com/uwMRJfz-r5jAYaQXGdGnC2_ppdhgmrDlPaRvaV7F2Ic/r0775xqpk59.mp4?sdtfrom=v1010&guid=01fa4f3693bf8f82fe888db36df00b82&vkey=4E0CF8001BE0C1361A71B730EC06E99620125B5D597EBC4865867D5BC443675A44302B623E92CE39DEC6C8C1F28D198CE3F411BA1AADD1DD2534A0814BF42D7A0BB0CD6B68A691592CF1C957363ADBE3205D2AD101DD796E54A6416B85042F8C65CFA7FA3D9ECFF36320005C566CDB22B3CE3C5338B9C243',
          type: 'video/mp4'
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
  .video-page{
    width: 100%;
  }
</style>
