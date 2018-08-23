<template>
  <div class="container cloumn stretch">
    <div class="phone-box row center">
      <div class="area-code">
        +86
      </div>

      <div class="phone-input-box row center relative">
        <input type="number" maxlength="11" class="phone-input"  v-model="phone" placeholder="请输入手机号"  @input="(event)=>{handleNumberInput(event,11,(newValue)=>phone=newValue)}" @blur="phoneInputing=false" @focus="phoneInputing=true"/>
        <i v-if="phone&&phoneInputing" class="iconfont icon-guanbi" @click="()=>phone=''"/>
      </div>
    </div>

    <div class="code-box row center">
      <div class="code-input-box row center relative">
        <input type="number" maxlength="6" class="code-input" v-model="code" placeholder="请输入验证码" @input="(event)=>{handleNumberInput(event,6,(newValue)=>code=newValue)}" @blur="codeInputing=false" @focus="codeInputing=true"/>
        <i v-if="code&&codeInputing" class="iconfont icon-guanbi" @click="()=>code=''" />
      </div>
      <div :class="['send-btn',(sendBtnTime > 0|| isSending)?'send-btn-disable':null]" @click="sendCode">
        {{sendBtnText}}
      </div>
    </div>

    <div :class="['submit-btn',canSubmit?null:'submit-btn-disable']" @click="canSubmit&&submit()" >
      {{texts.btnText}}
    </div>
  </div>
</template>

<script>
import utils from '../lib/utils'
export default {
  data () {
    return {
      type: this.$route.query.type,
      phone: '',
      code: '',
      codeInputing: false,
      phoneInputing: false,
      texts: {
        title: '',
        btnText: ''
      },
      isSending: false,
      sendBtnText: '获取验证码',
      sendBtnTime: 0,
      sendBtnTimer: null
    }
  },
  computed: {
    sendSMSCodeData: function () {
      return {
        phone: this.phone
      }
    },
    submitData: function () {
      return {
        phone: this.phone,
        code: this.code,
        token: this.$route.params.token,
        origin: 'H5'
      }
    },
    canSubmit: function () {
      return this.phone.length === 11 && this.code.length === 6
    }
  },
  components: {},
  mounted () {
    if (this.type === 'bindPhone') {
      this.texts.title = '绑定手机'
      this.texts.btnText = '立即绑定'
    } else {
      // login
      this.texts.title = '手机验证码登录'
      this.texts.btnText = '立即登录'
    }
    document.title = this.texts.title
  },
  destroyed () {
    if (this.sendBtnTimer) {
      clearInterval(this.sendBtnTimer)
    }
  },
  methods: {
    handleNumberInput (event, length, setter) {
      utils.handleNumberInput(event, length, setter)
    },
    sendCode () {
      if (this.sendBtnTime <= 0 && !this.isSending) {
        if (!utils.isPoneAvailable(this.phone)) {
          this.$toast('请输入正确的手机号', 2000)
          return
        }
        this.isSending = true
        this.$ajax('/jv/sms/send', { data: this.sendSMSCodeData })
          .then(res => {
            this.$toast('发送成功', 2000)
            if (this.sendBtnTimer) {
              clearInterval(this.sendBtnTimer)
            }
            this.sendBtnTime = 60
            this.sendBtnText = `重新获取(${this.sendBtnTime})`
            this.sendBtnTimer = setInterval(() => {
              console.log('setInterval')
              this.sendBtnTime--
              this.sendBtnText = `重新获取(${this.sendBtnTime})`
              if (this.sendBtnTime === 0) {
                clearInterval(this.sendBtnTimer)
                this.sendBtnText = `获取验证码`
              }
            }, 1000)
            this.isSending = false
          })
          .catch(e => {
            console.log(e)
            this.isSending = false
          })
      }
    },
    submit () {
      let url = ''
      let callback = null
      if (this.type === 'bindPhone') {
        url = '/jv/anonymous/user/phone/bind'
        callback = res => {
          console.log(res)
          this.$store.commit('login/login', {
            token: this.$route.params.token
          })
          // 需要授权的操作-中转页-当前页
          this.$router.back()
        }
      } else {
        // login
        url = '/jv/anonymous/login/vcode'
        callback = res => {
          this.$store.commit('login/login', {
            token: res.data.token
          })
          // 需要授权的操作-当前页
          this.$router.back()
        }
      }
      this.$ajax(url, { data: this.submitData })
        .then(res => {
          callback(res)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style src='../common.css' />
<style scoped>
.container {
  margin-left: 60px;
  margin-right: 60px;
  padding-top: 88px;
}
.icon-guanbi {
  position: absolute;
  color: #c8cacf;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  font-size: 26px;
}
.phone-box {
  height: 90px;
  margin-bottom: 38px;
  border-bottom-width: 1px;
  border-bottom-color: #bbbbbb;
  border-bottom-style: solid;
}
.area-code {
  margin-left: 20px;
  width: 101px;
  line-height: 30px;
  height: 30px;
  font-size: 30px;
  font-weight: bold;

  border-right-color: #cccccc;
  border-right-width: 1px;
  border-right-style: solid;
}
.phone-input-box {
  flex: 1;
}
.phone-input {
  flex: 1;
  font-size: 30px;
  border-radius: 0;
  padding-left: 21px;
  border: 0;
}

.code-box {
  flex: 1;
  height: 90px;
  margin-bottom: 80px;
  border-bottom-width: 1px;
  border-bottom-color: #bbbbbb;
  border-bottom-style: solid;
}
.code-input-box {
  flex: 1
}
.code-input {
  flex: 1;
  font-size: 30px;
  border-radius: 0;
  padding-left: 20px;
  border: 0;
}
.send-btn {
  border-left-color: #cccccc;
  border-left-width: 1px;
  border-left-style: solid;
  width: 210px;
  height: 30px;
  color: #1eb0fd;
  font-size: 30px;
  line-height: 30px;
  text-align: center;
}
.send-btn-disable {
  color: #999999;
}
.submit-btn {
  height: 90px;
  line-height: 90px;
  background-color: #1eb0fd;
  color: #ffffff;
  font-size: 34px;
  border-radius: 6px;
  text-align: center;
}
.submit-btn-disable {
  opacity: 0.5;
}
</style>
