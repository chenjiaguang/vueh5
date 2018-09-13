<template>
  <div class="container column">
    <div class="title">申请加入圈子</div>
    <div class="circleInfo row center">
      <img class="avatar" :src="circle.cover.compress"/>
      <div class="circlename">{{circle.name}}</div>
    </div>
    <textarea  ref="input" class="input" placeholder="写下你的申请理由（50字以内），用心写更容易通过哦~" v-model="content" :maxlength="50"/>
    <div class="btnGroup row space-between">
      <div :class="['btnCancel',isSended?'disable':null]" @click="back">取消</div>
      <div :class="['btnSubmit',isSended?'disable':null]" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      circle: null,
      content: '',
      isSended: false
    }
  },
  computed: {
    sendData: function () {
      return {
        cid: this.circle.id,
        reason: this.content
      }
    }
  },
  components: {},
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      let rData = {
        cid: this.$route.query.circle_id
      }
      this.$ajax('/jv/anonymous/qz/v21/circleinfo', {data: rData}).then(res => {
        this.circle = res.data
      }).catch(err => {
      })
    },
    back () {
      this.$router.back()
    },
    submit () {
      if (!this.isSended) {
        if (!this.content) {
          this.content = '申请加入' + this.circle.name
        }
        this.isSended = true
        this.$ajax('/jv/qz/joincircle/apply', { data: this.sendData })
          .then(res => {
            this.$toast(res.msg ? res.msg : '提交成功', 1500, () => {
            })
            this.$router.back()
          })
          .catch(e => {
            this.isSended = false
          })
      }
    }
  }
}
</script>

<style scoped>
.container{
  margin-top: 41px;
  margin-left: 30px;
  margin-right: 30px;
}
.title{
  color: #333333;
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: bold
}
.circleInfo{
  margin-bottom: 30px;
}
.avatar{
  height: 56px;
  width: 56px;
  margin-right: 20px;
  border-radius:8px;
}
.circlename{
  color: #333333;
  font-size:28px;
}
.input{
  height: 280px;
  margin-bottom: 80px;
  font-size: 28px;
  padding: 24px 20px 24px 20px;
  border: none;
  resize: none;
  outline: 0;
  border-width: 1px;
  border-color: #E5E5E5;
  border-style: solid;
  border-radius: 4px;
}
.btnCancel{
  border-width: 1px;
  border-color: #c0c0c0;
  border-style: solid;
  border-radius: 6px;
  height: 90px;
  width: 325px;
  color:#666666;
  font-size: 34px;
  text-align: center;
  line-height: 90px;
}
.btnSubmit{
  height: 90px;
  width: 325px;
  background-color: #1eb0fd;
  border-radius: 6px;
  color:#ffffff;
  font-size: 34px;
  text-align: center;
  line-height: 90px;
}
.disable{
  opacity: 0.5;
}
</style>
