<template>
  <div class="container">
    <div class="fix-box">
      <div class="left" @click="back">
          <i class="iconfont icon-goback" />
      </div>
      <div class="mid">评论</div>
      <div :class="['right',content&&!isSended?'active':null]" @click="sendComment">发布</div>
    </div>
    <div class="fix-box-bg" @click="focus">
    </div>
    <textarea :style="{height: winHeight/2 + 'px'}" ref="input" class="input" :placeholder="replyName?'回复 '+replyName+':':'来说点什么吧~'" v-model="content" :maxlength="1000"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '',
      isSended: false,
      dy_id: this.$route.query.dy_id,
      commentId: this.$route.query.commentId,
      pid: this.$route.query.pid,
      isReply: this.$route.query.isReply,
      replyName: this.$route.query.replyName,
      winHeight: window.innerHeight
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
    },
    sendComment () {
      if (this.content && !this.isSended) {
        let url = ''
        if (this.isReply) {
          url = '/jv/qz/publish/reply'
        } else {
          url = '/jv/qz/publish/comment'
        }
        this.isSended = true
        this.$ajax(url, { data: this.sendCommentData })
          .then(res => {
            this.$toast(res.msg ? res.msg : '发送成功', 1500, () => {
              this.$router.back()
              let params = this.$route.params
              setTimeout(() => {
                if (this.isReply) {
                  params.comment.replys.list.splice(0, 0, res.data.reply)
                } else {
                  params.dynamic.comment_list && params.dynamic.comment_list.splice(0, 0, res.data.comment)
                  params.dynamic.comment_num++
                }
              }, 500)
            })
          })
          .catch(e => {
            this.isSended = false
            console.log(e)
          })
      }
    }
  }
}
</script>

<style src='../../common.css' />
<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.input {
  flex: 1;
  margin-top: 100px;
  width: 100%;

  box-sizing: border-box;
  border: none;
  resize: none;
  border: 0;
  border-image-width: 0;

  color: #333333;
  font-size: 34px;
}
.fix-box-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.fix-box {
  position: fixed;
  height: 88px;
  left: 0;
  right: 0;
  top: 0;
  background-color: #fafafa;

  border-bottom-width: 0.5px;
  border-color: #e5e5e5;
  border-bottom-style: solid;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
}
.icon-goback {
  font-size: 41px;
  padding-left: 21px;
}
.mid {
  color: #333333;
  font-size: 34px;
}
.right {
  color: #c5c5c5;
  font-size: 32px;
  padding-right: 30px;
  font-weight: bold;
}
.right.active {
  color: #1eb0fd;
}
</style>
