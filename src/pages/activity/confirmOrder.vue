<template>
  <div class="activity-confirmOrder">
    <div class="scroller-wrapper">
      <div class="scroller">
        <div v-if="hasStatusBar" class="statusbar" :class="{exceed: exceed}">
          <span>{{exceed ? '订单已超时失效，请返回上一级页面重新购票' : '剩余支付时间'}}</span>
          <span v-if="!exceed" class="left-time">{{leftTimeText}}</span>
        </div>
        <div class="ticket-box" :class="{'has-status-bar': hasStatusBar}">
          <div class="header">购票信息</div>
          <div class="activity-name">{{ticketInfo.activity_name}}</div>
          <div class="ticket-name"><span>票种：</span><span class="flex-1">{{ticketInfo.ticket_name}}</span></div>
          <div class="ticket-amount"><span>数量：</span><span class="flex-1">{{ticketInfo.amount + '张'}}</span></div>
        </div>
        <div class="color-block"></div>
        <div class="owner-box">
          <div class="header">购票信息</div>
          <div class="owner-name"><span>姓名：</span><span class="flex-1">{{ownerInfo.name}}</span></div>
          <div v-if="ownerInfo.sex && ownerInfo.sex.toString() !== '0'" class="owner-name"><span>性别：</span><span class="flex-1">{{sexText[ownerInfo.sex.toString()]}}</span></div>
          <div class="owner-name"><span>手机：</span><span class="flex-1">{{ownerInfo.phone}}</span></div>
          <div class="owner-name"><span>微信号：</span><span class="flex-1">{{ownerInfo.weChat}}</span></div>
          <div class="owner-name"><span>身份证号：</span><span class="flex-1">{{ownerInfo.idCard}}</span></div>
        </div>
        <div class="form-wrapper">
          <div class="pay-way-box" v-if="shouldPay && shouldPay.toString() !== '0'">
            <div class="header pay-header">选择支付方式</div>
            <div class="pay-way">
              <div class="pay-way-item clearfix" @click="changePayWay(1)" v-if="payWay.toString() === '1'"><i class="iconfont icon-weixinzhifu fl" style="color: #09bb07;"></i>微信支付<i class="iconfont fr" :class="{'icon-gou': payWay.toString() === '1', 'icon-quan': payWay.toString() === '2'}"></i></div>
              <div class="pay-way-item clearfix" @click="changePayWay(2)" v-if="payWay.toString() === '2'"><i class="iconfont icon-zhifubaozhifu fl" style="color: #00a0e8;"></i>支付宝支付<i class="iconfont fr" :class="{'icon-gou': payWay.toString() === '2', 'icon-quan': payWay.toString() === '1'}"></i></div>
            </div>
          </div>
          <div class="agreement-box clearfix" @click.stop="changeAgreement">
            <i class="iconfont fl" style="width: 4.95%" :class="{'icon-gou': agreement, 'icon-quan': !agreement}"></i>
            <div class="fl" style="width: 95.05%">我同意<span @click.stop="goAgreement" style="color: #1EB0FD">《范团活动参与协议》</span>并已确认活动真实性，同意支付 报名费用。</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-button">
      <span style="vertical-align: middle">合计</span>
      <span class="should-pay-amount">&yen;{{shouldPay}}</span>
      <div @click="orderSubmit" class="btn-submit" :style="{backgroundColor: (!agreement || submitting) ? '#bbbbbb' : '#ff3f53'}">继续支付</div>
    </div>
  </div>
</template>

<style scoped>
  .activity-confirmOrder{
    width:100%;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 100px;
    overflow: hidden;
    background-color: #fff;
    position: relative;
  }
  .scroller-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .scroller{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 60px;
    -webkit-overflow-scrolling: touch;
  }
  .color-block{
    height: 16px;
    background-color: #f3f3f3;
  }
  .header{
    font-size: 32px;
    line-height: 44px;
    font-weight: 600;
    padding: 32px 0 17px;
  }
  .ticket-box.has-status-bar{
    padding-top: 56px;
  }
  .ticket-box{
    padding: 0 4% 33px;
  }
  .activity-name{
    font-size: 32px;
    line-height: 48px;
    padding: 15px 0;
  }
  .ticket-name,.ticket-amount{
    font-size: 28px;
    line-height: 38px;
    padding: 10px 0;
    color: #666;
    display: flex;
  }
  .flex-1{
    flex: 1;
  }
  .form-wrapper{
    padding: 0 4%;
  }
  .info-header{
    padding-bottom: 14px;
  }
  .pay-header{
    padding: 54px 0 20px;
  }
  .ticket-item{
    background-color: #F3F3F3;
    min-height: 74px;
    box-sizing: border-box;
    font-size: 32px;
    line-height: 42px;
    padding: 16px 20px;
    margin: 10px 20px 10px 0;
    color: #333;
  }
  .disabled-ticket{
    color:#BBBBBB;
  }
  .selected-ticket{
    background-color: #1EB0FD;
    color: #fff;
  }
  .ticket-addition{
    box-sizing: border-box;
    padding: 30px 0 26px;
    font-size: 28px;
    line-height: 56px;
    color: #666;
  }
  .ticket-changer{
    height: 56px;
    width: 184px;
    position: relative;
    margin-left: 20px;
    text-align: center;
    color: #333;
  }
  .ticket-changer:after{
    content: "";
    display: block;
    width: 200%;
    height: 200%;
    position:absolute;
    left: 0;
    top: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    border: 2px solid #BBBBBB;
    border-radius: 12px;
    box-sizing: border-box;
    z-index: 0;
  }
  .minus-icon{
    position: absolute;
    display: block;
    width: 48px;
    height: 56px;
    font-size: 28px;
    left: 0;
    top: 0;
    text-align: center;
    z-index: 1;
  }
  .add-icon{
    position: absolute;
    display: block;
    width: 48px;
    height: 56px;
    font-size: 28px;
    right: 0;
    top: 0;
    text-align: center;
    z-index: 1;
  }
  .minus-icon-line{
    width: 2px;
    height: 200%;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #bbb;
    transform: scale(0.5);
    transform-origin: 100% 0;
  }
  .add-icon-line{
    width: 2px;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #bbb;
    transform: scale(0.5);
    transform-origin: 0 0;
  }
  .user-info-item{
    height: 112px;
    line-height: 112px;
    font-size: 32px;
    position: relative;
  }
  .user-info-item:before{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    background-color: #bbb;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.5);
    transform-origin: 0 100%;
  }
  .user-left{
    width: 23%;
    height: 100%;
    line-height: 112px;
    box-sizing: border-box;
    padding-left: 32px;
    position: relative;
    color: #666;
  }
  .require-icon{
    font-size: 34px;
    color: #ff3f53;
    display: block;
    height: 200%;
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    line-height: 200px;
  }
  .user-full-input{
    width: 77%;
    height: 100%;
    font-size: 32px;
    line-height: 52px;
  }
  .user-full-input::-webkit-input-placeholder{
    color: #999
  }
  .get-code-btn{
    width: 32%;
    color: #1EB0FD;
    text-align: center;
    position: relative;
  }
  .get-code-btn-disabled{
    color: #999;
  }
  .phone-input{
    width: 41.2%;
    height: 100%;
    font-size: 32px;
    line-height: 52px;
  }
  .get-code-btn:before{
    content: "";
    display: block;
    width: 2px;
    height: 52px;
    background-color: #bbb;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -26px;
    transform: scale(0.5);
  }
  .sexual-option{
    width: 130px;
    margin-right: 22px;
  }
  .user-info-item .icon-quan{
    font-size: 40px;
    margin-right: 20px;
    color: #bbb;
  }
  .user-info-item .icon-quanzi{
    font-size: 40px;
    margin-right: 20px;
    color: #1EB0FD;
  }
  .pay-way-item{
    height: 110px;
    line-height: 110px;
    position: relative;
    font-size: 32px;
  }
  .pay-way-item:before{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    background-color: #bbb;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.5);
    transform-origin: 0 100%;
  }
  .pay-way-item .icon-quan{
    font-size: 40px;
    color: #E1E1E1;
    vertical-align: middle;
  }
  .pay-way-item .icon-gou{
    font-size: 40px;
    color: #1EB0FD;
    vertical-align: middle;
  }
  .icon-weixinzhifu, .icon-zhifubaozhifu{
    font-size: 50px;
    vertical-align: middle;
    margin-right: 26px;
  }
  .agreement-box{
    font-size: 24px;
    line-height: 38px;
    margin-top: 17px;
  }
  .agreement-box .icon-quan{
    font-size: 24px;
    line-height: 36px;
    color: #BBBBBB;
  }
  .agreement-box .icon-gou{
    font-size: 24px;
    line-height: 36px;
    color: #1EB0FD;
  }
  .fixed-button{
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    line-height: 100px;
    padding-left: 30px;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .fixed-button:before{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    background-color: #bbb;
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
  }
  .should-pay-amount{
    margin-left: 20px;
    font-size: 40px;
    color: #ff3f53;
    vertical-align: middle;
  }
  .btn-submit{
    width: 255px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  .statusbar{
    position: fixed;
    width: 100%;
    height: 56px;
    top: 0;
    left: 0;
    background-color: #73CFFF;
    color: #fff;
    font-size: 24px;
    line-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .statusbar.exceed{
    background-color: #C5C5C5;
  }
  .left-time{
    margin-left: 10px;
  }
</style>

<script>
import '@/iconfont/iconfont.css'
import utils from '@/lib/utils'
export default {
  name: 'ActivityDetail',
  data () {
    return {
      sexText: {
        0: '',
        1: '男',
        2: '女'
      },
      hasStatusBar: false,
      ticketInfo: {},
      ownerInfo: {
        needName: false,
        needIdCard: false,
        needSex: false,
        needWeChat: false,
        name: '',
        phone: '',
        code: '',
        idCard: '',
        weChat: '',
        sex: 0 // 0表示未选，1表示男，2表示女
      },
      payWay: 1, // 1表示微信支付，2表示支付宝支付     如果微信内则微信支付，否则支付宝支付:this.$browserUA.isWeixin() ? 1 : 2
      agreement: true,
      shouldPay: 3016,
      timer: null,
      submitting: false,
      exceed: false,
      leftTimeText: '',
      seconds: 10
    }
  },
  methods: {
    fetchTicket () {
      this.ticketInfo.activity_name = '海南建省30周年海口巨星演唱会门票，周杰伦x罗志祥'
      this.ticketInfo.ticket_name = 'A类单人票'
      this.ticketInfo.amount = 3
      this.ownerInfo.name = '杉田智和'
      this.ownerInfo.sex = 1
      this.ownerInfo.phone = '18976568906'
      this.ownerInfo.weChat = 'ashijiushiwty'
      this.ownerInfo.idCard = '400100198801021223'
      this.payWay = 1
    },
    startCounting (callback) {
      if (this.timer) {
        return false
      }
      this.seconds -= 1
      let _m = Math.floor(this.seconds / 60)
      let _s = this.seconds % 60
      let _mText = _m
      let _sText = _s
      if (_m.toString().length <= 1) {
        _mText = '0' + _m
      }
      if (_s.toString().length <= 1) {
        _sText = '0' + _s
      }
      this.leftTimeText = _mText + ':' + _sText
      this.hasStatusBar = true
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.seconds -= 1
        let _m = Math.floor(this.seconds / 60)
        let _s = this.seconds % 60
        let _mText = _m
        let _sText = _s
        if (_m.toString().length <= 1) {
          _mText = '0' + _m
        }
        if (_s.toString().length <= 1) {
          _sText = '0' + _s
        }
        this.leftTimeText = _mText + ':' + _sText
        if (this.seconds <= 0) {
          clearInterval(this.timer)
          this.timer = null
          this.leftTimeText = ''
          this.exceed = true
          callback && callback()
        }
      }, 1000)
    },
    changePayWay (way) {
      if (this.payWay.toString() === way.toString()) {
        return false
      }
      this.payWay = way
    },
    changeAgreement () {
      this.agreement = !this.agreement
    },
    goAgreement () {
      this.$router.push({name: 'Agreement', query: {type: 'activity'}})
    },
    orderSubmit () { // 验证并提交订单
      if (!utils.checkLogin()) { // 未登录终止
        return false
      }
      let {selectedTicket} = this
      let {agreement} = this.form
      let {id, buyNum, maxTicket} = this.activity
      let {name, needName, phone, idCard, needIdCard, weChat, needWeChat, sex, needSex} = this.form.userInfo
      let toastObject = {
        selectedTicket: !selectedTicket && '请选择购买的票',
        name: !name && needName && '请输入正确的姓名',
        phone: !phone && '请输入正确的手机号码',
        weChat: !weChat && needWeChat && '请输入正确的微信号',
        idCard: !idCard && needIdCard && '请输入正确的身份证号',
        sex: (!sex || sex.toString() === '0') && needSex && '请选择你的性别',
        buynum: maxTicket && parseInt(maxTicket) && selectedTicket && ((selectedTicket.putAmount + parseInt(buyNum)) > parseInt(maxTicket)) && '您已超过限购数量'
      }
      if (!(id.toString() && agreement)) { // 活动id必须存在,需同意范团活动参与协议
        return false
      }
      for (let item in toastObject) {
        if (toastObject[item]) { // 有一项出错，停止提交并提示
          this.$toast(toastObject[item])
          return false
        }
      }
      if (this.submitting) {
        return false
      }
      let rData = {
        aid: this.$route.query.id,
        feeId: selectedTicket.id,
        num: selectedTicket.putAmount,
        name: name,
        sex: sex,
        idCard: idCard,
        wechat: weChat,
        phone: phone
      }
      this.submitting = true
      this.$ajax('/jv/qz/v21/apply', {data: rData}).then(res => { // 请求后端下单接口,接受返回参数,如果有error,则提示，无error，则判断是否应调起支付
        this.submitting = false
        if (res && res.msg) {
          if (res.error) { // 出错时仅提示
            this.$toast(res.msg)
          } else {
            if (res.data && res.data.needToPlay) { // 无错且需支付时仅提示
              this.$toast(res.msg)
            } else if (res.data && !res.data.needToPlay) { // 无错且不需支付时提示后跳转
              this.$toast(res.msg, 2000, () => this.goSuccess(res))
            }
          }
        }
        if (res && !res.msg && !res.error) {
          if (res.data && res.data.needToPlay) { // 需要支付
            if (typeof WeixinJSBridge == 'undefined') { // 不允许调用微信公众号支付,其他浏览器
              let _rData = {
                checkcode: res.data.checkcode,
                payType: '1',
                tradeType: 'MWEB'
              }
              this.$ajax('/jv/qz/v21/activity/pay', {data: _rData}).then(res => {
                if (res && Boolean(res.error) && res.msg) {
                  this.$toast(res.msg)
                } else if (res && !res.error) {
                  let _href = res.data.mweb_url
                  window.location.href = _href
                }
              }).catch(() => {
                console.log('微信外h5 err')
              })
            } else { // 允许调用微信公众号支付,微信浏览器
              let _href = this.$apiDomain + '/jv/qz/v21/activity/weixin/JSAPI/pay/' + res.data.checkcode
              window.location.href = _href
            }
          } else if (res.data && !res.data.needToPlay) {
            if (!res.msg) { // 如果无msg则直接跳转
              this.goSuccess(res)
            } else if (res.msg) {
              this.$toast(res.msg, 2000, () => this.goSuccess(res))
            }
          }
        } else if (res && !res.msg && res.error) {
          console.log('报名出错')
        }
      }).catch(() => {
        this.submitting = false
      })
    },
    goSuccess (res) {
      this.$router.replace({name: 'ActivityTicket', query: {checkcode: res.data.checkcode}})
    }
  },
  created () {
    this.fetchTicket()
    this.startCounting()
  }
}
</script>
