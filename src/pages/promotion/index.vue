<template>
  <div class="promotion-page" :style="{width: $winWidth + 'px', height: $winHeight + 'px'}">
    <div class="download-btn" :style="{backgroundColor: btnColor}" @click.stop="downloadFantTuanC">立即下载</div>
    <weixin :show="showWeixinTip" @changeShow="showHideTip" />
  </div>
</template>

<style lang="scss" scoped>
.promotion-page{
  position: relative;
  background-image: url('/h5/cwebassets/image/promotion_page1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 55.065%;
}
.download-btn{
  width: 636px;
  height: 94px;
  font-size: 38px;
  line-height: 94px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 55.065%;
  border-radius: 47px;
  transform: translate(-50%, -50%);
}
</style>

<script>
import download from '@/lib/download.js'
import Weixin from '@/components/Weixin.vue'
import Fingerprint2 from 'fingerprintjs2'

export default {
  data () {
    console.log('mounted')
    return {
      btnColor: '#6273F7',
      showWeixinTip: false,
      fingerprint: null
    }
  },
  components: { Weixin },
  methods: {
    getFingerPrint (callback) {
      new Fingerprint2().get(function (result, components) {
        if (result) {
          callback && callback(result)
        }
      })
    },
    addVisits () { // 增加访问量
      const _fun = (fingerprint) => {
        let url = '/jv/anonymous/promotion/browser'
        let rData = {
          id: this.$route.query.activity_id,
          fingerprint: fingerprint
        }
        this.$ajax(url, {data: rData})
      }
      this.getFingerPrint(_fun)
    },
    addDownload () { // 增加下载量
      const _fun = (fingerprint) => {
        let browserInfo = download.browserInfo()
        let url = ''
        if (browserInfo.isIphone) {
          url = '/jv/anonymous/promotion/ios'
        } else if (browserInfo.isAndroid) {
          url = '/jv/anonymous/promotion/android'
        }
        if (!url) { // pc
          return false
        }
        let rData = {
          id: this.$route.query.activity_id,
          fingerprint: fingerprint
        }
        this.$ajax(url, {data: rData})
      }
      this.getFingerPrint(_fun)
    },
    openFantuanC () {
      let browserInfo = download.browserInfo()
      if (browserInfo.isWeixin || browserInfo.isQqInstalled || browserInfo.isWeibo) { // 微信内置、qq内置、微博内置浏览器会警告用户，在此引导用户在其他浏览器中打开，此种情况不计算下载量
        this.showHideTip()
      } else if (browserInfo.isAndroid) { // android
        window.location.href = 'launchapp://myhost/open'
      } else if (browserInfo.isIphone) { // iphone
        window.location.href = 'fantuanc://'
      }
    },
    downloadFantTuanC () { // 下载
      let browserInfo = download.browserInfo()
      if (browserInfo.isWeixin || browserInfo.isQqInstalled || browserInfo.isWeibo) { // 微信内置、qq内置、微博内置浏览器会警告用户，在此引导用户在其他浏览器中打开，此种情况不计算下载量
        // tip引导在其他浏览器中打开
        this.showHideTip()
      } else if (browserInfo.isAndroid) { // android
        // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wetime.fanc'
        this.$ajax('/jv/version/getversion').then(res => { // 获取资源链接
          if (res && !res.error && res.data) { // 成功获取数据
            this.addDownload()
            window.location.href = res.data.version.apklink
          } else {
            this.$toast('获取资源失败')
          }
        }).catch(err => {
          this.$toast('获取资源失败')
        })
      } else if (browserInfo.isIphone) { // iphone
        this.addDownload()
        window.location.href = 'https://itunes.apple.com/cn/app/%E8%8C%83%E5%9B%A2/id1278226297?mt=8'
      }
    },
    showHideTip () {
      this.showWeixinTip = !this.showWeixinTip
    }
  },
  mounted () {
    this.addVisits()
    // download.click()
    this.openFantuanC()
  }
}
</script>
