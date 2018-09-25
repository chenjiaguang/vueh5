<template>
  <div class="ticket-wrapper">
    <download-box />
    <div class="ticket-body">
      <div class="ticket-code-image-box">
        <img class="ticket-code-image1" :src="codeImage" />
        <img class="ticket-code-image2" :src="ticket.downloadImage" @load="enAbleDownload" />
      </div>
      <div class="ticket-tip">请在活动现场出示电子票</div>
      <div class="ticket-status">{{ticket.statusText}}</div>
      <div class="activity-content">
        <div class="activity-title">{{activity.title}}</div>
        <div class="activity-content-item clearfix">
          <div class="left fl">地点：</div>
          <div class="right fl activity-address">{{activity.address}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">时间：</div>
          <div class="right fl">{{activity.time}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">票种：</div>
          <div class="right fl">{{ticket.feeName || '免费'}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">票价：</div>
          <div class="right fl" style="color:#ff3f53;">{{ticket.price.toString() === '0' ? '免费' : '&yen;' + ticket.price}}</div>
        </div>
        <div class="left-sign"></div>
        <div class="right-sign"></div>
      </div>
    </div>
    <div class="ticket-attention">
      <a class="save-ticket" :href="ticket.downloadImage" :class="{canDownload: canDownload}">保存电子票到相册</a>
      <div class="ticketing-time">出票时间：{{ticket.time}}</div>
      <div class="attention-header">注意事项</div>
      <div class="attention-item">1.请保存电子票，在活动现场向主办方出示</div>
      <div class="attention-item">2.下载范团APP，在我的-活动中查看电子票，云端保存 不丢失</div>
      <div class="attention-item">3.暂不支持退票，有需要请联系主办方</div>
    </div>
    <weixin :show="showWeixinTip" @changeShow="showHideTip" />
  </div>
</template>

<script>
import DownloadBox from '../../components/DownloadBox'
import download from '@/lib/download.js'
import Weixin from '@/components/Weixin.vue'
export default {
  data () {
    if (this.$isApp && this.$route.query.checkcode) {
      this.$appCall('h5GoTicket', this.$route.query.checkcode)
    }
    return {
      showWeixinTip: false,
      canDownload: false,
      codeImage: '',
      ticket: {
        price: 0,
        time: '',
        statusText: '',
        downloadImage: '',
        feeName: ''
      },
      activity: {
        title: '',
        address: '',
        time: ''
      }
    }
  },
  components: { Weixin, DownloadBox },
  methods: {
    enAbleDownload () {
      this.canDownload = true
    },
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
    },
    downloadIamge (name) {
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height

        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png')

        // 生成一个a元素
        let a = document.createElement('a')
        // 创建一个单击事件
        let event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || '范团活动电子票'
        // 将生成的URL设置为a.href属性
        a.href = url
        // 触发a的单击事件
        a.dispatchEvent(event)
      }

      image.src = this.ticket.downloadImage
    }
  },
  created () {
    let checkcode = this.$route.query.checkcode
    if (checkcode) { // 存在checkcode时，把它存到缓存中, 并且拉取信息
      let rData = {
        checkcode: checkcode
      }
      this.$ajax('/jv/anonymous/qz/v21/activityapplyinfo', {data: rData}).then(res => {
        if (res && Boolean(res.error) && res.msg) {
          this.$toast(res.msg)
        } else if (res && !res.error) {
          this.codeImage = res.data.QRCode
          this.ticket.downloadImage = res.data.ticket_image
          this.ticket.statusText = res.data.state_text
          this.ticket.feeName = res.data.fee_name
          this.ticket.price = res.data.total_prices
          this.ticket.time = res.data.time
          this.activity.title = res.data.activity.title
          this.activity.address = res.data.activity.address_text
          this.activity.time = res.data.activity.time_text
        }
      }).catch(err => {
        console.log('获取失败', err)
      })
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .ticket-wrapper{
    background-color: #F3F3F3;
    overflow: hidden;
  }
  .ticket-body{
    margin: 30px 4% 0;
    background-color: #fff;
    border-radius:10px;
    overflow: hidden;
    text-align: center;
    margin-bottom: 30px;
  }
  .ticket-code-image-box{
    width: 300px;
    height: 300px;
    position: relative;
    margin: 60px auto 0;
  }
  .ticket-code-image1{
    display:block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .ticket-code-image2{
    display:block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-touch-callout:default;
    z-index: 2;
    opacity: 0;
  }
  .ticket-code-image:before{
    content: "";
    display: block;
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    border: 3px solid #E5E5E5;
    border-radius: 10px;
  }
  .ticket-tip{
    font-size: 28px;
    line-height: 58px;
    padding-top: 15px;
  }
  .ticket-status{
    font-size: 32px;
    line-height: 62px;
    color: #11B31D;
    padding-bottom: 25px;
    position: relative;
  }
  .ticket-status:before{
    content: "";
    display: block;
    position: absolute;
    width: 200%;
    height: 0;
    border-top: 3px dashed #E5E5E5;
    left: 0;
    bottom: 0;
    transform: scale(0.5);
    transform-origin: 0 100%;
  }
  .activity-content{
    box-sizing: border-box;
    padding: 33px 30px 28px;
    text-align: left;
    position: relative;
    overflow: visible;
    .left-sign, .right-sign{
      width: 26px;
      height: 26px;
      background-color: #F3F3F3;
      position: absolute;
      top: 0;
      margin-top: -13px;
      transform: rotate(45deg);
    }
    .left-sign{
      left: 0;
      margin-left: -13px;
    }
    .right-sign{
      right: 0;
      margin-right: -13px;
    }
  }
  .activity-title{
    font-size: 32px;
    line-height: 46px;
    padding-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .activity-content-item{
    font-size: 28px;
    line-height: 36px;
    padding: 8px 0;
    .left{
      width: 15%;
      color: #666;
    }
    .right{
      width: 85%;
    }
  }
  .activity-address{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .ticket-attention{
    padding: 40px 4% 48px;
    background-color: #fff;
  }
  .save-ticket{
    display: block;
    height: 90px;
    line-height: 90px;
    font-size: 34px;
    color: #BBBBBB;
    text-align: center;
    position: relative;
  }
  .save-ticket.canDownload{
    color: #1EB0FD;
  }
  .save-ticket:before{
    content: "";
    display: block;
    width: 200%;
    height: 200%;
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    border: 3px solid #BBBBBB;
    transform: scale(0.5);
    transform-origin: 0 0;
    border-radius: 12px;
  }
  .save-ticket.canDownload:before{
    content: "";
    display: block;
    width: 200%;
    height: 200%;
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    border: 3px solid #1EB0FD;
    transform: scale(0.5);
    transform-origin: 0 0;
    border-radius: 12px;
  }
  .ticketing-time{
    font-size:24px;
    line-height: 92px;
    padding-top: 26px;
  }
  .attention-header{
    font-size: 32px;
    line-height: 84px;
  }
  .attention-item{
    font-size: 28px;
    line-height: 52px;
  }
</style>
