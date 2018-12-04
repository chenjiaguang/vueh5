<template>
  <!-- 加载完成并且有订单订单 -->
  <div class="activity-confirmOrder" v-if="loaded && feeId && applyId">
    <div class="scroller-wrapper">
      <div v-if="showStatusBar" class="statusbar" :class="{exceed: exceed}">
        <span>{{exceed ? '订单已超时失效，请返回上一级页面重新购票' : '剩余支付时间'}}</span>
        <span v-if="!exceed" class="left-time">{{leftTimeText}}</span>
      </div>
      <div class="scroller">
        <div class="ticket-box" :class="{'has-status-bar': showStatusBar}">
          <div class="header">购票信息</div>
          <div class="activity-name">{{title}}</div>
          <div class="ticket-name"><span>票种：</span><span class="flex-1">{{feeTitle}}</span></div>
          <div class="ticket-amount"><span>数量：</span><span class="flex-1">{{num && num.toString() !== '0' ? (num + '张') : ''}}</span></div>
        </div>
        <div class="color-block"></div>
        <div class="owner-box">
          <div class="header">取票人信息</div>
          <div v-if="name" class="owner-item"><span>姓<span style="visibility:hidden">名</span>名：</span><span class="flex-1">{{name}}</span></div>
          <div v-if="sex && sex.toString() !== '0'" class="owner-item"><span>性<span style="visibility:hidden">别</span>别：</span><span class="flex-1">{{sexText[sex.toString()]}}</span></div>
          <div v-if="phone" class="owner-item"><span>手<span style="visibility:hidden">机</span>机：</span><span class="flex-1">{{phone}}</span></div>
          <div v-if="wechat" class="owner-item"><span>微信号：</span><span class="flex-1">{{wechat}}</span></div>
          <div v-if="idCard" class="owner-item"><span>身份证：</span><span class="flex-1">{{idCard}}</span></div>
        </div>
        <div class="color-block"></div>
        <div class="form-wrapper">
          <div class="pay-way-box" v-if="totalPrices && totalPrices.toString() !== '0'">
            <div class="header pay-header">选择支付方式</div>
            <div class="pay-way">
              <div class="pay-way-item clearfix" @click="changePayWay(1)" v-if="payWay.toString() === '1'"><i class="iconfont icon-weixinzhifu fl" style="color: #09bb07;"></i>微信支付<i class="iconfont fr" :class="{'icon-gou': payWay.toString() === '1', 'icon-quan': payWay.toString() === '2'}"></i></div>
              <div class="pay-way-item clearfix" @click="changePayWay(2)" v-if="payWay.toString() === '2'"><i class="iconfont icon-zhifubaozhifu fl" style="color: #00a0e8;"></i>支付宝支付<i class="iconfont fr" :class="{'icon-gou': payWay.toString() === '2', 'icon-quan': payWay.toString() === '1'}"></i></div>
            </div>
          </div>
          <!-- <div class="agreement-box clearfix" @click.stop="changeAgreement">
            <i class="iconfont fl" style="width: 4.95%" :class="{'icon-gou': agreement, 'icon-quan': !agreement}"></i>
            <div class="fl" style="width: 95.05%">我同意<span @click.stop="goAgreement" style="color: #1EB0FD">《范团活动参与协议》</span>并已确认活动真实性，同意支付 报名费用。</div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="fixed-button">
      <span style="vertical-align: middle">合计</span>
      <span class="should-pay-amount">&yen;{{totalPrices || 0}}</span>
      <div @click.stop="orderSubmit" class="btn-submit" :style="{backgroundColor: (!agreement || submitting || !checkcode) ? '#bbbbbb' : '#ff3f53'}">继续支付</div>
    </div>
  </div>
  <!-- 加载完成并且无订单 -->
  <div class="activity-confirmOrder-empty" v-else-if="loaded && !feeId">
    <div class="empty-icon" :style="{backgroundImage: 'url(' + $assetsFullPath + 'image/empty_order.png'}"></div>
    <div class="empty-text">订单已失效！</div>
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
  }
  .activity-confirmOrder-empty{
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
  .empty-icon{
    width: 240px;
    height: 240px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin: 240px auto 0;
  }
  .empty-text{
    text-align: center;
    font-size: 28px;
    color: #999;
    line-height: 34px;
    padding: 17px 4%;
  }
  .scroller-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
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
  .owner-box{
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
  .owner-item{
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
  .pay-header{
    padding-bottom: 0;
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
    max-width: 800PX;
    box-sizing: border-box;
    background-color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    line-height: 100px;
    padding-left: 30px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    position: absolute;
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
    z-index: 2;
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

const initialData = {
  sexText: {
    0: '',
    1: '男',
    2: '女'
  },
  showStatusBar: false,
  payWay: 1, // 1表示微信支付，2表示支付宝支付     如果微信内则微信支付，否则支付宝支付:this.$browserUA.isWeixin() ? 1 : 2
  agreement: true,
  timer: null,
  submitting: false,
  exceed: false,
  leftTimeText: '',
  aid: '',
  checkcode: '',
  feeId: '',
  applyId: '',
  num: '',
  feeTitle: '',
  idCard: '',
  leftTime: '',
  name: '',
  phone: '',
  sex: '',
  title: '',
  totalPrices: '',
  wechat: '',
  showPrompt: false,
  pass: false,
  loaded: false
}
export default {
  data () {
    if (this.$isApp && this.$route.query.aid) { // 再app内打开，跳转活动购票页面
      this.$appCall('h5GoConfirmOrder', this.$route.query.aid)
    }
    let _initObj = JSON.parse(JSON.stringify(initialData))
    if (this.$route.params.data) { // 如果上个页面传数据进来,取传进来的数据
      let {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat} = this.$route.params.data
      _initObj = Object.assign({}, {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat})
    } else {
      _initObj.aid = this.$route.query.aid
    }
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, _initObj)
    return _obj
  },
  methods: {
    startCounting (callback) {
      if (this.timer) {
        return false
      }
      // if (this.$route.params.data) {
      //   console.log('this.$route.params.data', this.$route.params.data)
      //   this.$route.params.data.leftTime = this.leftTime
      // }
      this.leftTime = parseInt(this.leftTime) - 1
      let _m = Math.floor(this.leftTime / 60)
      let _s = this.leftTime % 60
      let _mText = _m
      let _sText = _s
      if (_m.toString().length <= 1) {
        _mText = '0' + _m
      }
      if (_s.toString().length <= 1) {
        _sText = '0' + _s
      }
      this.leftTimeText = _mText + ':' + _sText
      this.showStatusBar = true
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.leftTime -= 1
        // if (this.$route.params.data) {
        //   console.log('this.$route.params.data', this.$route.params.data)
        //   this.$route.params.data.leftTime = this.leftTime
        // }
        let _m = Math.floor(this.leftTime / 60)
        let _s = this.leftTime % 60
        let _mText = _m
        let _sText = _s
        if (_m.toString().length <= 1) {
          _mText = '0' + _m
        }
        if (_s.toString().length <= 1) {
          _sText = '0' + _s
        }
        this.leftTimeText = _mText + ':' + _sText
        if (this.leftTime <= 0) {
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
    showEmptyPage () {
      clearInterval(this.timer)
      this.timer = null
      this.leftTimeText = ''
      this.exceed = true
      this.loaded = true
    },
    refreshData (vm) {
      let _this = vm || this
      clearInterval(_this.timer)
      if (_this.$route.params.data) { // 有传入的数据，使用传入的数据
        let {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat} = _this.$route.params.data
        let _initialData = JSON.parse(JSON.stringify(initialData))
        let _obj = Object.assign({}, _initialData, {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat})
        _obj.loaded = true
        for (let item in _obj) {
          _this[item] = _obj[item]
        }
        _this.startCounting()
      } else { // 没有则调用接口获取
        let rData = {
          aid: _this.$route.query.aid
        }
        _this.submitting = true
        _this.$ajax('/jv/qz/v25/order/unpaid', {data: rData, dontToast: true}).then(res => {
          console.log('获取未支付订单成功', res)
          _this.submitting = false
          if (res && res.data && res.data.checkcode && !res.error) { // 有未支付订单
            if (res.data.leftTime && parseInt(res.data.leftTime) > 0) { // 剩余时间大于0
              let {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat} = res.data
              let _initialData = JSON.parse(JSON.stringify(initialData))
              let _obj = Object.assign({}, _initialData, {aid, checkcode, feeId, applyId, feeTitle, idCard, leftTime, name, num, phone, sex, title, totalPrices, wechat})
              _obj.loaded = true
              for (let item in _obj) {
                _this[item] = _obj[item]
              }
              _this.startCounting()
            } else { // 剩余时间不足
              _this.showEmptyPage()
            }
          } else { // 无未支付订单
            _this.showEmptyPage()
          }
        }).catch(err => {
          _this.submitting = false
          console.log('获取未支付订单失败', err)
          _this.showEmptyPage()
        })
      }
    },
    orderSubmit () { // 验证并提交订单
      if (!utils.checkLogin(true) || !this.agreement || this.submitting || !this.checkcode) { // 未登录终止
        return false
      }
      if (this.exceed && this.applyId && this.checkcode) { // 有数据并且过期
        this.$modal.showAlert('订单已超时失效，请返回上一级页面重新购票', () => {
          this.pass = true
          this.$router.go(-1)
        }, '知道了')
        return false
      }
      this.submitting = true
      if (typeof WeixinJSBridge == 'undefined') { // 不允许调用微信公众号支付,其他浏览器
        let rData = {
          checkcode: this.checkcode,
          payType: '1',
          tradeType: 'MWEB'
        }
        this.$ajax('/jv/qz/v21/activity/pay', {data: rData}).then(res => {
          this.submitting = false
          if (res && Boolean(res.error) && res.msg) {
            this.$toast(res.msg)
          } else if (res && !res.error) {
            let _href = res.data.mweb_url
            window.location.href = _href
          }
        }).catch(() => {
          this.submitting = false
          console.log('微信外h5 err')
        })
      } else { // 允许调用微信公众号支付,微信浏览器
        this.submitting = false
        let _href = this.$apiDomain + '/jv/qz/v21/activity/weixin/JSAPI/pay/' + this.checkcode
        window.location.href = _href
      }
    },
    cancelOrder (callback) {
      if (!utils.checkLogin(true) || this.exceed || this.canceling) { // 未登录或过期或正在提交时终止
        return false
      }
      let rData = {
        applyId: this.applyId
      }
      this.canceling = true
      this.$ajax('/jv/anonymous/qz/v21/applycancel', {data: rData}).then(res => {
        this.canceling = false
        if (res && !res.error) {
          callback && callback()
        }
      }).catch(() => {
        this.canceling = false
        console.log('微信外h5 err')
      })
    }
  },
  // created () {
  //   if (this.$route.params.refreshData) { // 刷新数据
  //     this.refreshData()
  //   }
  // },
  // activated () {
  //   if (this.$route.query.refreshData || this.$route.params.refreshData || (this.$route.query.aid && (this.$route.query.aid !== this.aid || !this.loaded))) { // 刷新数据（手动刷新或活动id不一致或未加载过）
  //     this.refreshData()
  //   }
  // },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Agreement' || to.name === 'SMSCode' || this.pass || this.exceed || !this.feeId) {
      this.pass = false
      if (window._alert_id) { // 如果有alert弹窗，则关闭弹窗
        this.$modal.hideAlert(window._alert_id)
      }
      next()
    } else {
      if (!this.showPrompt) {
        this.showPrompt = true
        this.$prompt.showPrompt({titleText: '离开后，您的订单将不再保留，确定要放弃订单？', leftText: '放弃订单', rightText: '继续支付'}, () => {
          this.showPrompt = false
        }, () => {
          this.cancelOrder(() => {
            this.showPrompt = false
            this.pass = true
            this.$router.go(-1)
          })
        })
        next(false)
      } else {
        next(false)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'Agreement' && from.name !== 'SMSCode' && (vm.$route.query.refreshData || vm.$route.params.refreshData || (vm.$route.query.aid && (vm.$route.query.aid !== vm.aid || !vm.loaded)))) {
        vm.refreshData(vm)
      }
    })
  }
}
</script>
