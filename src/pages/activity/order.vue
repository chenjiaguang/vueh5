<template>
  <div class="activity-order">
    <div class="scroller-wrapper">
      <div class="scroller">
        <div class="activity-container" v-if="activity.id">
          <div class="info-container" :class="{'no-tags': activity.tags.length === 0}">
            <div class="info-title">{{activity.title}}</div>
            <div class="info-item clearfix">
              <div class="fl left">地点：</div>
              <div class="fl right" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{activity.address}}</div>
            </div>
            <div class="info-item clearfix">
              <div class="fl left">时间：</div>
              <div class="fl right">{{activity.date}}</div>
            </div>
          </div>
          <div class="tag-container clearfix" v-if="activity.tags && activity.tags.length > 0">
            <div class="fl tag-item" v-for="(item, idx) in activity.tags" :key="idx">{{item}}<div class="tag-border"></div></div>
          </div>
          <div class="color-block"></div>
        </div>
        <div class="form-wrapper" v-if="activity.id">
          <div class="header">选择票种</div>
          <div class="ticket-wrapper clearfix">
            <div class="ticket-item fl" @click="selectTicket(item)" :class="{'disabled-ticket' : !item.amount || item.amount.toString() === '0', 'selected-ticket': item.selected}" v-if="form.ticket && form.ticket[0]" v-for="item in form.ticket" :key="item.id">{{item.name}}</div>
          </div>
          <div class="ticket-addition clearfix" v-if="selectedTicket">
            <div class="addition-left fl">选择数量</div>
            <div class="addition-right fr clearfix">
              <div class="ticket-changer fr">
                <i class="minus-icon iconfont icon-jian" @click="minus" :style="{color: selectedTicket.putAmount <= 1 ? '#999' : '#333'}">
                  <span class="minus-icon-line"></span>
                </i>
                {{selectedTicket.putAmount}}
                <i class="add-icon iconfont icon-jia" @click="add" :style="{color: selectedTicket.putAmount >= Number(selectedTicket.amount) && (!selectedTicket.max || selectedTicket.max.toString() !== '0') ? '#999' : '#333'}">
                  <span class="add-icon-line"></span>
                </i>
              </div>
              <span class="fr" v-if="selectedTicket.max && selectedTicket.max.toString() !== '0'">剩余{{selectedTicket.amount}}张</span>
            </div>
          </div>
          <div class="header info-header">取票人信息</div>
          <div class="user-info">
            <div class="user-info-item clearfix" v-if="form.userInfo.needName">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>姓<span style="visibility:hidden">名</span>名</div>
              <input class="user-full-input fl" v-model="form.userInfo.name" placeholder="请输入姓名" />
            </div>
            <div class="user-info-item clearfix">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>手<span style="visibility:hidden">机</span>机</div>
              <input class="user-full-input fl" type="number" v-model="form.userInfo.phone" placeholder="请输入手机号" />
            </div>
            <!-- <div class="user-info-item clearfix">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>验证码</div>
              <input class="user-full-input fl" type="number" v-model="form.userInfo.code" />
            </div> -->
            <div class="user-info-item clearfix" v-if="form.userInfo.needWeChat">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>微信号</div>
              <input class="user-full-input fl" type="text" v-model="form.userInfo.weChat" placeholder="请输入微信号" />
            </div>
            <div class="user-info-item clearfix" v-if="form.userInfo.needIdCard">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>身份证</div>
              <input class="user-full-input fl" v-model="form.userInfo.idCard" placeholder="请输入身份证号" />
            </div>
            <div class="user-info-item clearfix" v-if="form.userInfo.needSex">
              <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>性<span style="visibility:hidden">别</span>别</div>
              <div @click="form.userInfo.sex = 1" class="sexual-option fl clearfix"><i class="iconfont fl" :class="{'icon-quanzi': form.userInfo.sex.toString() === '1', 'icon-quan': form.userInfo.sex.toString() !== '1'}"></i>男</div>
              <div @click="form.userInfo.sex = 2" class="sexual-option fl clearfix"><i class="iconfont fl" :class="{'icon-quanzi': form.userInfo.sex.toString() === '2', 'icon-quan': form.userInfo.sex.toString() !== '2'}"></i>女</div>
            </div>
          </div>
          <!-- <div class="pay-way-box" v-if="shouldPay && shouldPay.toString() !== '0'">
            <div class="header pay-header">选择支付方式</div>
            <div class="pay-way">
              <div class="pay-way-item clearfix" @click="changePayWay(1)" v-if="form.payWay.toString() === '1'"><i class="iconfont icon-weixinzhifu fl" style="color: #09bb07;"></i>微信支付<i class="iconfont fr" :class="{'icon-gou': form.payWay.toString() === '1', 'icon-quan': form.payWay.toString() === '2'}"></i></div>
              <div class="pay-way-item clearfix" @click="changePayWay(2)" v-if="form.payWay.toString() === '2'"><i class="iconfont icon-zhifubaozhifu fl" style="color: #00a0e8;"></i>支付宝支付<i class="iconfont fr" :class="{'icon-gou': form.payWay.toString() === '2', 'icon-quan': form.payWay.toString() === '1'}"></i></div>
            </div>
          </div> -->
          <div class="agreement-box clearfix" @click.stop="changeAgreement">
            <i class="iconfont fl" style="width: 4.95%" :class="{'icon-gou': form.agreement, 'icon-quan': !form.agreement}"></i>
            <div class="fl" style="width: 95.05%">我同意<span @click.stop="goAgreement" style="color: #1EB0FD">《范团活动参与协议》</span>并已确认活动真实性，同意支付 报名费用。</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-button">
      <span style="vertical-align: middle">合计</span>
      <span class="should-pay-amount">&yen;{{shouldPay}}</span>
      <div @click="clickSubmit" class="btn-submit" :style="{backgroundColor: (!selectedTicket || !form.agreement || submitting) ? '#bbbbbb' : '#ff3f53'}">{{submitting ? '正在提交' : '确认报名'}}</div>
    </div>
  </div>
</template>

<style scoped>
  .activity-order{
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
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 60px;
    -webkit-overflow-scrolling: touch;
  }
  .info-container{
    padding: 0 4% 0;
  }
  .info-container.no-tags{
    padding-bottom: 18px;
  }
  .info-title{
    padding: 26px 0 6px;
    font-size: 32px;
    line-height: 46px;
    min-height: 92px;
    box-sizing: content-box;
  }
  .info-item{
    position: relative;
    min-height: 52px;
    line-height: 40px;
    padding: 6px 0;
    font-size: 28px;
    box-sizing: border-box;
  }
  .left{
    max-width: 13%;
    color: #666;
    white-space: nowrap;
  }
  .right{
    max-width: 87%;
  }
  .tag-container{
    margin: 0 24px 18px;
    padding: 6px 0;
  }
  .tag-item{
    margin: 6px;
    height: 40px;
    line-height: 42px;
    font-size: 24px;
    color: #666;
    padding: 0 14px;
    position: relative;
    text-align: center;
  }
  .tag-border{
    position: absolute;
    width: 200%;
    height: 200%;
    left: 0;
    top: 0;
    border-radius: 12px;
    border: 2px solid #bbbbbb;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: 0 0;
    z-index: 0;
  }
  .content-context img{
    display: block;
    margin: 21px 0;
    max-width: 100%;
  }
  .color-block{
    height: 16px;
    background-color: #f3f3f3;
  }
  .form-wrapper{
    padding: 0 4%;
  }
  .header{
    font-size: 32px;
    line-height: 44px;
    font-weight: 600;
    padding: 34px 0 40px;
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
    margin-top: 33px;
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
</style>

<script>
import '@/iconfont/iconfont.css'
import utils from '@/lib/utils'
export default {
  name: 'ActivityDetail',
  data () {
    if (this.$isApp && this.$route.query.id) { // 再app内打开，跳转活动购票页面
      this.$appCall('h5GoOrder', this.$route.query.id)
    }
    let _orderOwnerInfo = window.localStorage.orderOwnerInfo ? JSON.parse(window.localStorage.orderOwnerInfo) : {}
    let {name, phone, idCard, weChat, sex} = _orderOwnerInfo
    return {
      activity: {
        id: '',
        title: '',
        address: '',
        date: '',
        tags: []
      },
      form: {
        ticket: [],
        userInfo: {
          needName: false,
          needIdCard: false,
          needSex: false,
          needWeChat: false,
          name: name || '',
          phone: phone || '',
          code: '',
          idCard: idCard || '',
          weChat: weChat || '',
          sex: sex || 0 // 0表示未选，1表示男，2表示女
        },
        payWay: 1, // 1表示微信支付，2表示支付宝支付     如果微信内则微信支付，否则支付宝支付:this.$browserUA.isWeixin() ? 1 : 2
        agreement: true
      },
      timer: null,
      countNum: -1,
      btnText: '获取验证码',
      counting: false,
      submitting: false,
      updateTimer: null
    }
  },
  methods: {
    fetchActivity () {
      let rData = {
        id: this.$route.query.id
      }
      this.$ajax('/jv/anonymous/qz/v21/activity', {data: rData}).then(res => { // 获取活动数据
        this.activity.id = res.data.id
        this.activity.title = res.data.title
        this.activity.address = res.data.address_text
        this.activity.date = res.data.time_text
        this.activity.deadline = res.data.deadline_text
        this.form.ticket = res.data.activity_fees.map((item, idx) => {
          return {
            id: item.id,
            name: item.name,
            price: item.prices.replace(',', ''),
            amount: item.last_num,
            selected: false,
            max: item.max,
            putAmount: 1
          }
        })
        let tagsArr = []
        if (res.data.insurance) {
          tagsArr.push('费用中包含保险')
        }
        if (!res.data.refund) {
          tagsArr.push('不可退票')
        }
        if (res.data.max_ticket && parseInt(res.data.max_ticket)) {
          tagsArr.push('限购' + res.data.max_ticket + '张')
        }
        this.activity.tags = tagsArr
        this.activity.buyNum = res.data.buynum
        this.activity.maxTicket = res.data.max_ticket
        this.form.userInfo.needName = res.data.nead_name
        this.form.userInfo.needIdCard = res.data.nead_idcard
        this.form.userInfo.needSex = res.data.nead_sex
        this.form.userInfo.needWeChat = res.data.need_wechat
      }).catch(() => {
        console.log('获取数据失败')
      })
    },
    selectTicket (item) {
      let currentId = this.selectedTicket ? this.selectedTicket.id : null
      if (item.id === currentId ||  item.amount <= 0) {
        return false
      }
      this.form.ticket.forEach(it => {
        it.selected = Boolean(it.id === item.id)
      })
    },
    minus () {
      let selected = this.form.ticket.filter(item => item.selected)[0]
      if (selected.putAmount <= 1) {
        return false
      }
      selected.putAmount -= 1
    },
    add () {
      let selected = this.form.ticket.filter(item => item.selected)[0]
      if (selected.putAmount >= selected.amount && selected.max && selected.max.toString() !== '0') {
        return false
      }
      selected.putAmount += 1
    },
    startCounting (callback) {
      if (this.countNum >= 0) { // 还在显示倒计时
        return false
      }
      this.countNum = 59
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        let text = '重新获取(' + (this.countNum > 9 ? this.countNum : '0' + this.countNum) + ')'
        this.btnText = text
        this.countNum -= 1
        if (this.countNum < 0) {
          clearInterval(this.timer)
          this.btnText = '获取验证码'
          callback && callback()
        }
      }, 1000)
    },
    sendCode () {
      let {phone} = this.form.userInfo
      if (!/^1\d{10}$/.test(phone)) { // 输入的不是手机号
        this.$toast('请输入正确手机号')
        return false
      }
      let rData = {
        phone: phone
      }
      this.counting = true
      let _this = this
      this.$ajax('/jv/sms/send', {data: rData}).then(res => {
        // 请求成功
        console.log('发送成功了')
        if (res && Boolean(res.error) && res.msg) {
          this.$toast(res.msg)
          this.counting = false
        } else if (res && !res.error) {
          this.$toast('验证码已发送，请注意查收')
          this.startCounting(() => {
            _this.counting = false
          })
        }
      }).catch(() => {
        // 获取失败
        console.log('发送失败了')
        _this.counting = false
      })
    },
    changePayWay (way) {
      if (this.form.payWay.toString() === way.toString()) {
        return false
      }
      this.form.payWay = way
    },
    changeAgreement () {
      this.form.agreement = !this.form.agreement
    },
    goAgreement () {
      this.$router.push({name: 'Agreement', query: {type: 'activity'}})
    },
    // orderPay (res, successCallback) {
    //   if (this.$browserUA.isWeixin()) { // 微信内置浏览器内
    //     this.publicAccountPay(res, successCallback)
    //   } else {
    //     this.otherWebPay(res, successCallback)
    //   }
    // },
    // otherWebPay (res, successCallback) { // 微信外支付
    //   successCallback && successCallback()
    // },
    // publicAccountPay (res, successCallback) { // 微信内支付
    //   successCallback && successCallback()
    // },
    // completeOrder () { // 完成订单
    //   console.log('完成订单')
    // },
    checkOrder () {
      let rData = {
        aid: this.activity.id
      }
      this.submitting = true
      this.$ajax('/jv/qz/v25/order/unpaid', {data: rData, dontToast: true}).then(res => {
        console.log('获取未支付订单成功', res)
        if (res && res.data && res.data.checkcode && !res.error) { // 有未支付订单
          if (res.data.leftTime && parseInt(res.data.leftTime) > 0) { // 剩余时间大于0
            console.log(45)
            this.submitting = false
            this.$router.push({name: 'ConfirmOrder', query: {aid: this.activity.id}, params: {data: res.data, refreshData: true}})
          } else { // 剩余时间不足
            this.orderSubmit()
          }
        } else { // 无未支付订单
          this.orderSubmit()
        }
      }).catch(err => {
        console.log('获取未支付订单失败', err)
        if (err.status.toString() === '200') {
          this.orderSubmit()
        } else {
          this.submitting = false
        }
      })
    },
    clickSubmit () {
      if (!utils.checkLogin() || this.submitting) { // 未登录终止
        return false
      }
      // let {selectedTicket} = this
      // let {agreement} = this.form
      // let {id, buyNum, maxTicket} = this.activity
      // let {name, needName, phone, idCard, needIdCard, weChat, needWeChat, sex, needSex} = this.form.userInfo
      // let toastObject = {
      //   selectedTicket: !selectedTicket && '请选择购买的票',
      //   name: !name && needName && '请输入正确的姓名',
      //   phone: !phone && '请输入正确的手机号码',
      //   weChat: !weChat && needWeChat && '请输入正确的微信号',
      //   idCard: !idCard && needIdCard && '请输入正确的身份证号',
      //   sex: (!sex || sex.toString() === '0') && needSex && '请选择你的性别',
      //   buynum: maxTicket && parseInt(maxTicket) && selectedTicket && ((selectedTicket.putAmount + parseInt(buyNum)) > parseInt(maxTicket)) && '您已超过限购数量'
      // }
      // if (!(id.toString() && agreement)) { // 活动id必须存在,需同意范团活动参与协议
      //   return false
      // }
      // for (let item in toastObject) {
      //   if (toastObject[item]) { // 有一项出错，停止提交并提示
      //     this.$toast(toastObject[item])
      //     return false
      //   }
      // }
      this.checkOrder()
    },
    orderSubmit () { // 验证并提交订单
      let {selectedTicket} = this
      let {name, needName, phone, idCard, needIdCard, weChat, needWeChat, sex, needSex} = this.form.userInfo
      // let toastObject = {
      //   selectedTicket: !selectedTicket && '请选择购买的票',
      //   name: !name && needName && '请输入正确的姓名',
      //   phone: !phone && '请输入正确的手机号码',
      //   weChat: !weChat && needWeChat && '请输入正确的微信号',
      //   idCard: !idCard && needIdCard && '请输入正确的身份证号',
      //   sex: (!sex || sex.toString() === '0') && needSex && '请选择你的性别',
      //   buynum: maxTicket && parseInt(maxTicket) && selectedTicket && ((selectedTicket.putAmount + parseInt(buyNum)) > parseInt(maxTicket)) && '您已超过限购数量'
      // }
      // if (!(id.toString() && agreement)) { // 活动id必须存在,需同意范团活动参与协议
      //   this.submitting = false
      //   return false
      // }
      // for (let item in toastObject) {
      //   if (toastObject[item]) { // 有一项出错，停止提交并提示
      //     this.$toast(toastObject[item])
      //     this.submitting = false
      //     return false
      //   }
      // }
      let rData = {
        aid: this.$route.query.id,
        feeId: selectedTicket.id,
        num: selectedTicket.putAmount,
        name: needName ? name : '',
        sex: needSex ? sex : '',
        idCard: needIdCard ? idCard : '',
        wechat: needWeChat ? weChat : '',
        phone: phone
      }
      this.$ajax('/jv/qz/v21/apply', {data: rData}).then(res => { // 请求后端下单接口,接受返回参数,如果有error,则提示，无error，则判断是否应调起支付
        this.submitting = false
        // if (res && res.msg) {
        //   if (res.error) { // 出错时仅提示
        //     this.$toast(res.msg)
        //   } else {
        //     if (res.data && res.data.needToPlay) { // 无错且需支付时仅提示
        //       this.$toast(res.msg)
        //     } else if (res.data && !res.data.needToPlay) { // 无错且不需支付时提示后跳转
        //       this.$toast(res.msg, 2000, () => this.goSuccess(res))
        //     }
        //   }
        // }
        if (res && res.data && res.data.needToPlay) { // 需要支付
          this.$router.push({name: 'ConfirmOrder', query: {aid: this.$route.query.id}, params: {data: res.data, refreshData: true}})
        } else if (res && res.data && !res.data.needToPlay) { // 不需要支付
          if (res.error) { // 出错时
            res.msg && this.$toast(res.msg)
          } else { // 无错误时
            if (res.msg) { // 有提示
              this.$toast(res.msg, 2000, () => this.goSuccess(res))
            } else { // 无提示
              this.goSuccess(res)
            }
          }
        }
        console.log('apply_res', res)
        // if (res && !res.msg && !res.error) {
        //   if (res.data && res.data.needToPlay) { // 需要支付
        //     if (typeof WeixinJSBridge == 'undefined') { // 不允许调用微信公众号支付,其他浏览器
        //       let _rData = {
        //         checkcode: res.data.checkcode,
        //         payType: '1',
        //         tradeType: 'MWEB'
        //       }
        //       this.$ajax('/jv/qz/v21/activity/pay', {data: _rData}).then(res => {
        //         if (res && Boolean(res.error) && res.msg) {
        //           this.$toast(res.msg)
        //         } else if (res && !res.error) {
        //           let _href = res.data.mweb_url
        //           window.location.href = _href
        //         }
        //       }).catch(() => {
        //         console.log('微信外h5 err')
        //       })
        //     } else { // 允许调用微信公众号支付,微信浏览器
        //       let _href = this.$apiDomain + '/jv/qz/v21/activity/weixin/JSAPI/pay/' + res.data.checkcode
        //       window.location.href = _href
        //     }
        //   } else if (res.data && !res.data.needToPlay) {
        //     if (!res.msg) { // 如果无msg则直接跳转
        //       this.goSuccess(res)
        //     } else if (res.msg) {
        //       this.$toast(res.msg, 2000, () => this.goSuccess(res))
        //     }
        //   }
        // } else if (res && !res.msg && res.error) {
        //   console.log('报名出错')
        // }
      }).catch(() => {
        this.submitting = false
      })
    },
    goSuccess (res) {
      this.$router.replace({name: 'ActivityTicket', query: {checkcode: res.data.checkcode}})
    }
  },
  computed: {
    selectedTicket () {
      return this.form.ticket.filter(item => item.selected)[0]
    },
    shouldPay () {
      let selected = this.form.ticket.filter(item => item.selected)[0]
      return (selected && Number((Number(selected.putAmount) * Number(selected.price)).toFixed(2))) || 0
    },
    disabledSend () {
      return !/^1\d{10}$/.test(this.form.userInfo.phone) || this.counting
    }
  },
  created () {
    console.log('created')
    this.fetchActivity()
  },
  mounted () {
    console.log('mounted')
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    let {name, phone, idCard, weChat, sex} = this.form.userInfo
    let _info = {name, phone, idCard, weChat, sex}
    let _infoJson = JSON.stringify(_info)
    window.localStorage.orderOwnerInfo = _infoJson
    next()
  }
}
</script>
