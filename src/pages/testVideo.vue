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
          src: 'http://112.67.251.144/vlive.qqvideo.tc.qq.com/Al-mliryp26QIXa5n_cfFfHJYrQMtkXzz28U7TGEw-GA/v0200dgqnj9.p201.1.mp4?sdtfrom=&vkey=53E2B62CE8824FB447645589D0CC2E6162C549F0F7AD1A30C58EB7DBEBB9ED056F86065F21337FBC37943A52166BF957D74970C52C1A2E4FC693C2569F27DF18016F5CC4C541A3B245A6A50F5C03CA6C4B51FBBB6D7222721D13E31C8074213F443B712F69B43182F93134C0D9069B25BC6F59AA067180E1&platform=10901&level=0&fmt=shd',
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
