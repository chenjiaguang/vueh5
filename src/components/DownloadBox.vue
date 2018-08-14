<template>
  <div class="fixed-button-wrapper">
    <div class="fixed-button" :style="{zIndex: 1}">
      <img :src="$assetsPublicPath + '/cwebassets/image/van_logo.png'" class="van-logo" />
        有范又有趣的海南生活圈
      <div class="open-btn" @click="openFantTuanC">立即打开</div>
    </div>
    <weixin :show="showWeixinTip" @changeShow="showHideTip" />
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.fixed-button-wrapper{

}
.fixed-button{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 128px;
  box-sizing: border-box;
  padding-left: 138px;
  line-height: 128px;
  font-size: 32px;
  color: #fff;
  background-color: rgba(38,38,38,0.75);
  .van-logo{
    display: block;
    width: 88px;
    height: 88px;
    position:absolute;
    left: 30px;
    top: 50%;
    margin-top: -44px;
  }
  .open-btn{
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background-image: linear-gradient(-18deg, #FF9C00, #FF283C);
    position: absolute;
    top: 34px;
    right: 30px;
    font-size: 28px;
    border-radius: 8px;
  }
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
