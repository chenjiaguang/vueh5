<template>
  <div class="box">
    <div class="row space-between center">
      <div class="left row">
        <img class="logo" :src="$assetsPublicPath + '/cwebassets/image/van_logo.png'" />
        <div class="text-box title">有范又有趣的海南生活圈</div>
      </div>
      <div class="go" @click="openFantTuanC">立即打开</div>
      <weixin :show="showWeixinTip" @changeShow="showHideTip" />
    </div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.box {
  height: 110px;
  padding-top: 15px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #FAFAFA;

  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
  border-bottom-style: solid;
}
.logo {
  height: 80px;
  width: 80px;
  border-radius: 20px;
}
.go {
  height: 46px;
  width: 140px;
  background-color: #1fb0fd;
  color: #ffffff;
  font-size: 24px;
  line-height: 46px;
  text-align: center;
  border-radius: 12px;
}
.text-box {
  margin-left: 20px;
}
.title {
  color: #666666;
  font-size: 32px;
  line-height: 80px;
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
