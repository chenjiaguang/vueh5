<template>
  <div class="container column">
    <div class="title">申请加入圈子</div>
    <div class="userInfo row center">
      <img class="avatar" :src="user.avatar" @click="clickUser(user.uid)"/>
      <div class="username" @click="clickUser(user.uid)">{{user.username}}</div>
    </div>
    <textarea  ref="input" class="input" placeholder="写下你的申请理由（50字以内），用心写更容易通过哦~" v-model="content" :maxlength="50"/>
    <div class="btnGroup row space-between">
      <div class="btnCancel">取消</div>
      <div class="btnSubmit">提交</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        uid: '111',
        avatar: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2075076846,2339167561&fm=58',
        username: '小清新美图壁纸控'
      },
      content: ''
    }
  },
  computed: {
    sendCommentData: function () {
      return {
        content: this.content,
        dy_id: this.dy_id,
        commentId: this.commentId,
        pid: this.pid
      }
    }
  },
  components: {},
  methods: {
    back () {
      this.$router.back()
    },
    focus () {
      this.$refs.input.focus()
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
.userInfo{
  margin-bottom: 30px;
}
.avatar{
  height: 56px;
  width: 56px;
  margin-right: 20px;
  border-radius:8px;
}
.username{
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
  border-width: 1px;
  border-color: #E5E5E5;
  border-style: solid;
  border-radius: 4px;
}
.btnCancel{
  border-width: 2px;
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
</style>
