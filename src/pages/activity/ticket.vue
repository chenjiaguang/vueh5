<template>
  <div class="ticket-wrapper">
    <div class="ticket-body">
      <img class="ticket-code-image" :src="codeImage" @load="enAbleDownload" />
      <div class="ticket-tip">请在活动现场出示电子票</div>
      <div class="ticket-status">{{statusText[ticket.status]}}</div>
      <div class="activity-content">
        <div class="activity-title">我是活动的标题，最多三十字，两行可以换 行的啦啦啦啦</div>
        <div class="activity-content-item clearfix">
          <div class="left fl">地点：</div>
          <div class="right fl">{{activity.address}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">时间：</div>
          <div class="right fl">{{activity.time}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">票种：</div>
          <div class="right fl">{{ticket.name}}&nbsp;&nbsp;x{{ticket.amount && ticket.amount.toString() !== '0' ? ticket.amount : '免费'}}</div>
        </div>
        <div class="activity-content-item clearfix">
          <div class="left fl">票价：</div>
          <div class="right fl">&yen;{{ticket.price}}</div>
        </div>
        <div class="left-sign"></div>
        <div class="right-sign"></div>
      </div>
    </div>
    <div class="ticket-attention">
      <div class="save-ticket" :class="{canDownload: canDownload}" @click="downloadIamge('测试下载图片')">保存电子票到相册</div>
      <div class="ticketing-time">出票时间：{{ticket.time}}</div>
      <div class="attention-header">注意事项</div>
      <div class="attention-item">1.请保存电子票，在活动现场向主办方出示</div>
      <div class="attention-item">2.下载范团APP，在我的-活动中查看电子票，云端保存 不丢失</div>
      <div class="attention-item">3.暂不支持退票，有需要请联系主办方</div>
    </div>
    <div class="fixed-button">
      <div class="van-logo-box">
        <i class="iconfont icon-van_logo"></i>
      </div>
      有范又有趣的海南生活圈
      <div class="open-btn" @click="openFantTuanC">立即打开</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        canDownload: false,
        codeImage: '/static/测试保存.png',
        ticket: {
          name: '五月二十八号晚八点A类团体套票',
          price: 65,
          time: '2018-01-05 18:56',
          amount: 3,
          status: 1, // 1表示待验票
          downloadImage: '/static/测试保存.png'
        },
        activity: {
          address: '观澜湖新城',
          time: '01-03 18:30 至 05-06 18:30'
        },
        statusText: {
          1: '待验'
        }
      }
    },
    methods: {
      enAbleDownload () {
        this.canDownload = true
      },
      openFantTuanC () { // 打开范团app或下载
        console.log('打开范团app或下载')
      },
      downloadIamge (name) {
        console.log('触发了保存')
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
          a.download = name || '下载图片名称'
          // 将生成的URL设置为a.href属性
          a.href = url
          // 触发a的单击事件
          a.dispatchEvent(event)
        }

        image.src = this.ticket.downloadImage
      }
    },
    created () {
      let ticketId = ''
      if (this.$route.params && this.$route.params.id) { // params中存在id时，把它存到缓存中, 并且拉取信息
        ticketId = this.$route.params.id
        this.$store.commit('activityTicket/saveId', {
          ticketId: this.$route.params.id
        })
      } else { // params无活动id时，尝试从缓存中获取，缓存中也没有时显示获取不到电子票
        ticketId = this.$store.state.activityTicket.ticketId
      }
      // 使用ticketId
      console.log(ticketId)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .ticket-wrapper{
    background-color: #F3F3F3;
    padding-top: 30px;
    overflow: hidden;
  }
  .ticket-body{
    margin: 0 4%;
    background-color: #fff;
    border-radius:10px;
    overflow: hidden;
    text-align: center;
    margin-bottom: 30px;
  }
  .ticket-code-image{
    display:block;
    width: 300px;
    height: 300px;
    background-position: center;
    background-size: contain;
    background-repeat:no-repeat;
    margin: 60px auto 0;
    position: relative;
    -webkit-touch-callout:default;
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
    border: 2px solid #E5E5E5;
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
    border-top: 2px dashed #E5E5E5;
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
  .ticket-attention{
    padding: 40px 4% 176px;
    background-color: #fff;
  }
  .save-ticket{
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
    border: 2px solid #BBBBBB;
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
    border: 2px solid #1EB0FD;
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
    .van-logo-box{
      width: 88px;
      height: 88px;
      border-radius: 12px;
      position: absolute;
      left: 30px;
      top: 20px;
      background-color: #FF3F53;
      .icon-van_logo{
        display:block;
        width: 110px;
        height: 110px;
        font-size: 110px;
        line-height: 110px;
        text-align: center;
        color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -55px;
        top: 50%;
        margin-top: -55px;
      }
    }
    .open-btn{
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-color: #ff3f53;
      position: absolute;
      top: 34px;
      right: 30px;
    }
  }
</style>
