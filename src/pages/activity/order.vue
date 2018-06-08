<template>
  <div class="activity-detail">
    <div class="activity-container">
      <div class="info-container">
        <div class="info-title">{{activity.title}}</div>
        <div class="info-item clearfix">
          <div class="fl left">地点：</div>
          <div class="fl right">{{activity.address}}</div>
        </div>
        <div class="info-item clearfix">
          <div class="fl left">时间：</div>
          <div class="fl right">{{activity.date}}</div>
        </div>
      </div>
      <div class="tag-container clearfix">
        <div class="fl tag-item" v-for="(item, idx) in activity.tags" :key="idx">{{item}}<div class="tag-border"></div></div>
      </div>
      <div class="color-block"></div>
    </div>
    <div class="form-wrapper">
      <div class="header">选择票种</div>
      <div class="ticket-wrapper clearfix">
        <div class="ticket-item fl" @click="selectTicket(item)" :class="{'disabled-ticket' : !item.amount || item.amount.toString() === '0', 'selected-ticket': item.selected}" v-if="form.ticket && form.ticket[0]" v-for="item in form.ticket" :key="item.id">{{item.name}}</div>
      </div>
      <div class="ticket-addition clearfix" v-if="selectedTicket">
        <div class="addition-left fl">选择数量</div>
        <div class="addition-right fr clearfix">
          剩余{{selectedTicket.amount}}张
          <div class="ticket-changer fr">
            <i class="minus-icon iconfont icon-jian" @click="minus" :style="{color: selectedTicket.putAmount <= 1 ? '#999' : '#333'}"><div class="minus-icon-line"></div></i>
            {{selectedTicket.putAmount}}
            <i class="add-icon iconfont icon-jia" @click="add" :style="{color: selectedTicket.putAmount >= parseInt(selectedTicket.amount) ? '#999' : '#333'}"><div class="add-icon-line"></div></i>
          </div>
        </div>
      </div>
      <div class="header">报名人信息</div>
      <div class="user-info">
        <div class="user-info-item clearfix">
          <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>姓名</div>
          <input class="user-full-input fl" />
        </div>
        <div class="user-info-item clearfix">
          <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>手机</div>
          <input class="phone-input fl" type="number" />
          <div class="get-code-btn fl">获取验证码</div>
        </div>
        <div class="user-info-item clearfix">
          <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>验证码</div>
          <input class="user-full-input fl" type="number" />
        </div>
        <div class="user-info-item clearfix">
          <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>身份证号</div>
          <input class="user-full-input fl" type="number" />
        </div>
        <div class="user-info-item clearfix">
          <div class="user-left fl"><i class="require-icon iconfont icon-xinghao"></i>性别</div>
          <div @click="form.userInfo.sex = 1" class="sexual-option fl clearfix"><i class="iconfont fl" :class="{'icon-quanzi': form.userInfo.sex.toString() === '1', 'icon-quan': form.userInfo.sex.toString() === '2'}"></i>男</div>
          <div @click="form.userInfo.sex = 2" class="sexual-option fl clearfix"><i class="iconfont fl" :class="{'icon-quan': form.userInfo.sex.toString() === '1', 'icon-quanzi': form.userInfo.sex.toString() === '2'}"></i>女</div>
        </div>
      </div>
      <div class="header pay-header">选择支付方式</div>
      <div class="pay-way">
        <div class="pay-way-item clearfix" @click="changePayWay(1)"><i class="iconfont icon-weixinzhifu fl" style="color: #09bb07;"></i>微信支付<i class="iconfont fr" :class="{'icon-gou': form.payWay.toString() === '1', 'icon-quan': form.payWay.toString() === '2'}"></i></div>
        <div class="pay-way-item clearfix" @click="changePayWay(2)"><i class="iconfont icon-zhifubaozhifu fl" style="color: #00a0e8;"></i>支付宝支付<i class="iconfont fr" :class="{'icon-gou': form.payWay.toString() === '2', 'icon-quan': form.payWay.toString() === '1'}"></i></div>
      </div>
      <div class="agreement-box clearfix" @click.stop="changeAgreement">
        <i class="iconfont fl" style="width: 4.95%" :class="{'icon-gou': form.agreement, 'icon-quan': !form.agreement}"></i>
        <div class="fl" style="width: 95.05%">我同意<span @click.stop="goAgreement" style="color: #1EB0FD">《范团活动参与协议》</span>并已确认活动真实性，同意支付 报名费用。</div>
      </div>
    </div>
    <div class="fixed-button">
      <span style="vertical-align: middle">合计</span>
      <span class="should-pay-amount">&yen;{{shouldPay}}</span>
      <div @click="goSuccess" class="btn-submit" :style="{backgroundColor: shouldPay.toString() === '0' ? '#bbbbbb' : '#ff3f53'}">确认报名</div>
    </div>
  </div>
</template>

<style scoped>
  .activity-detail{
    width:100%;
    padding-bottom: 160px;
  }
  .info-container{
    padding: 0 4%;
  }
  .info-title{
    padding: 26px 0 6px;
    font-size: 32px;
    line-height: 46px;
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
    line-height: 40px;
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
    width: 26.8%;
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
    width: 73.2%;
    height: 100%;
    font-size: 32px;
    line-height: 52px;
  }
  .get-code-btn{
    width: 29%;
    color: #1EB0FD;
    text-align: center;
    position: relative;
  }
  .phone-input{
    width: 44.2%;
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
    position: fixed;
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
  export default {
    name: 'ActivityDetail',
    data () {
      return {
        activity: {
          title: '三月不减肥，四月徒伤悲 | 节后甩肉计划第一期 正式启动！羽毛球篇',
          address: '海口市龙华区滨海大道百方大厦15楼b',
          date: '01-03 18:30 至 05-06 18:30',
          tags: ['不可退票', '费用中包含保险', '更多tag', '更多tag', '更多tag', '更多tag']
        },
        form: {
          ticket: [
            {
              id: 1,
              name: 'A类票(单人票)',
              price: 2,
              amount: 10,
              selected: false,
              putAmount: 1
            },
            {
              id: 2,
              name: 'B类票(单人票)',
              price: 2.11,
              amount: 99,
              selected: false,
              putAmount: 1
            },
            {
              id: 3,
              name: 'B类票(单人票+午饭)不含晚餐宵夜',
              price: 13.27,
              amount: 0,
              selected: false,
              putAmount: 1
            },
            {
              id: 4,
              name: 'B类票(单人票+午饭)不含晚餐宵夜',
              price: 55,
              amount: 77,
              selected: false,
              putAmount: 1
            }
          ],
          userInfo: {
            sex: 1 // 1代表男，2代表女
          },
          payWay: 1, // 1表示微信支付，2表示支付宝支付
          agreement: true
        },
        toastNum: 5
      }
    },
    methods: {
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
        if (selected.putAmount >= selected.amount) {
          return false
        }
        selected.putAmount += 1
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
        this.$router.push({path: '/agreement', query: {type: 'activity'}})
      },
      goSuccess () {
        this.$router.replace('/activity/success')
      }
    },
    computed: {
      selectedTicket () {
        return this.form.ticket.filter(item => item.selected)[0]
      },
      shouldPay () {
        let selected = this.form.ticket.filter(item => item.selected)[0]
        return selected && parseFloat((parseFloat(selected.putAmount) * parseFloat(selected.price)).toFixed(2)) || 0
      }
    }
  }
</script>
