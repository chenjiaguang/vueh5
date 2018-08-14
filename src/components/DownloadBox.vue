<template>
  <div class="box">
    <div class="row space-between center">
      <div class="left row">
        <img class="logo" :src="$assetsPublicPath + '/cwebassets/image/van_logo.png'" />
        <div class="text-box title">有范又有趣的海南生活圈</div>
      </div>
      <div class="go" @click="openFantTuanC">
        立即打开
      </div>
    </div>
  </div>
</template>

<style src='../common.css' />
<style lang="scss" type="text/scss" scoped>
.box {
  height: 128px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #FAFAFA;

  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
  border-bottom-style: solid;
}
.logo {
  height: 88px;
  width: 88px;
}
.go {
  height: 46px;
  width: 139px;
  background-color: #1fb0fd;
  color: #ffffff;
  font-size: 24px;
  line-height: 46px;
  text-align: center;
  border-radius: 6px;
}
.text-box {
  margin-left: 20px;
}
.title {
  color: #666666;
  font-size: 32px;
  line-height: 88px;
}
</style>

<script>
import download from '@/lib/download.js'
import Weixin from '@/components/Weixin.vue'
export default {
  data () {
    return {
      showWeixinTip: false,
      timestap: new Date().getTime()
    }
  },
  components: { Weixin },
  methods: {
    openFantTuanC () { // 打开范团app或下载
      console.log('打开范团app或下载')
      let browserInfo = download.browserInfo()
      if (browserInfo.isWeixin) { // 微信内置浏览器
        this.showWeixinTip = true
      } else {
        download.click()
      }
    },
    showHideTip () {
      this.showWeixinTip = !this.showWeixinTip
    }
  }
}
</script>
