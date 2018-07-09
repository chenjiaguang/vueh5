<template>
  <div class="webpay-wrapper" v-if="query.from === 'MWEB' || (query.from === 'JSAPI' && payResult !== 'SUCCESS')">
    <i class="webpay-icon iconfont icon-pay_icon"></i>
    <div class="webpay-header">请确认是否完成支付</div>
    <div @click="complete" class="complete-btn">已完成支付</div>
    <div @click="rePay" class="repay-btn">未完成，重新支付</div>
    <div class="contact">客服电话：<a class="tel-btn" href="tel:4006806307">400-680-6307</a></div>
    <!-- <div v-for="(value, key) in query" :key="key">
      {{ key }}: {{ value }}
    </div> -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        query: this.$route.query
      }
    },
    methods: {
      rePay () { // 重新支付
        if (typeof WeixinJSBridge == "undefined") { // 不允许调用微信公众号支付,其他浏览器
          let _rData = {
            checkcode: this.$route.query.checkcode,
            payType: '1',
            tradeType: 'MWEB'
          }
          this.$ajax('/jv/qz/v21/activity/pay', {data: _rData}).then(res => {
            console.log('微信外h5 res', res)
            if (res && Boolean(res.error) && res.msg) {
              this.$toast(res.msg)
            } else if (res && !Boolean(res.error)) {
              let _href = res.data.mweb_url
              window.location.href = _href
            }
          }).catch(err => {
            console.log('微信外h5 err', err)
          })
        } else { // 允许调用微信公众号支付,微信浏览器
          let _href = API_DOMAIN + '/jv/qz/v21/activity/weixin/JSAPI/pay/' + this.$route.query.checkcode
          window.location.href = _href
        }
      },
      complete () { // 完成订单，跳转票据二维码页面
        this.$router.replace({name: 'ActivityTicket', query: {checkcode: this.$route.query.checkcode}})
      }
    },
    created () {
      let {from, payResult, checkcode} = this.$route.query // from: JSAPI(微信公众号支付)、MWEB(微信h5支付)、APP（微信app支付）
      if (from === 'JSAPI') { // 微信公众号支付
        if (payResult === 'FAIL' || payResult === 'CANCEL') { // 未完成支付的逻辑,支付失败时提示，用户取消则不做任何提示
          payResult === 'FAIL' && this.$toast('支付失败')
        } else if (payResult === 'SUCCESS') { // 完成支付立即跳转成功页面
          this.$toast('报名成功', 2000, this.complete) 
        }
      } else if (from === 'MWEB') { // 微信h5支付，不做任何操作，让用户自己选择
        
      } else if (from === 'APP') { // 微信app支付，不做任何操作

      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .webpay-wrapper{
    padding-top: 80px;
    text-align: center;
    .webpay-icon{
      font-size: 120px;
      color: #999;
    }
    .webpay-header{
      font-size: 36px;
      line-height: 44px;
      padding: 50px 0;
      text-align: center;
    }
    .webpay-tip{
      font-size: 26px;
      line-height: 34px;
      padding: 16px 0;
      color: #999;
      text-align: center;
    }
  }
  .complete-btn{
    width: 80%;
    height: 80px;
    line-height: 80px;
    font-size: 32px;
    color: #fff;
    background-color: #1EB0FD;
    border-radius: 6px;
    text-align: center;
    margin: 100px auto 0;
  }
  .repay-btn{
    width: 80%;
    height: 80px;
    line-height: 80px;
    font-size: 32px;
    color: #1EB0FD;
    background-color: #fff;
    border-radius: 6px;
    text-align: center;
    margin: 60px auto 0;
    position: relative;
    overflow: visible;
  }
  .repay-btn:after{
    content: "";
    display: block;
    width: 200%;
    height: 200%;
    position: absolute;
    border-radius: 12px;
    box-sizing: border-box;
    border: 2px solid  #1EB0FD;
    top: 0;
    left: 0;
    transform: scale(0.5, 0.5);
    transform-origin: 0 0;
  }
  .contact{
    font-size: 28px;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 100px;
    text-align: center;
  }
  .tel-btn{
    color: #1EB0FD;
  }
</style>
