//动态固底交互
<template>
  <div class="fix-box">
    <div class="like-box" @click="clickLike(dynamic.id)" :style="{color: dynamic.has_like ? '#fe5273' : '#666'}">
      <transition
        enter-active-class="animated wobble"
        leave-active-class="hide"
      >
        <div v-if="dynamic.has_like" class="like-icon-box">
          <i class='iconfont icon-like'></i>
          <span class="like-comment-box-text">{{likeNumber || '赞'}}</span>
        </div>
      </transition>

      <div v-if="!dynamic.has_like" class="like-icon-box">
        <i class='iconfont icon-dislike'></i>
        <span class="like-comment-box-text">{{likeNumber || '赞'}}</span>
      </div>
    </div>
    <div class="comment-box" @click="clickComment(dynamic.id)">
      <i class="iconfont icon-comment_icon2"></i>
      <span class="like-comment-box-text">{{commentNumber || '评论'}}</span>
    </div>
  </div>
</template>
<script>
import utils from '../lib/utils'
export default {
  props: ['dynamic'],
  data () {
    return {
      following: false
    }
  },
  computed: {
    likeNumber () {
      let num = parseInt(this.dynamic.like_num)
      console.log('num', num)
      return num > 999 ? '999+' : num
    },
    commentNumber () {
      let num = parseInt(this.dynamic.comment_num)
      return num > 999 ? '999+' : num
    }
  },
  components: {},
  methods: {
    applyJoinCircle () {
      let {need_audit, id} = this.dynamic.circleInfo
      if (need_audit) { // 跳转申请加入
        this.$router.push({name: 'CircleApply', query: {circle_id: id}})
      } else { // 直接申请
        if (this.following) { // 正在申请
          this.$toast('正在申请...')
          return false
        }
        let rData = {
          id: id,
          follow: 1
        }
        this.following = true
        this.$ajax('/jv/qz/following', {data: rData}).then(res => {
          if (res && !res.error) { // 申请成功
            this.dynamic.circleInfo.followed = true
            this.following = false
            this.$toast('加入成功')
          } else if (res.error && res.msg) {
            this.following = false
            this.$toast(res.msg)
          } else {
            this.following = false
          }
        }).catch(err => {
          console.log('加入圈子出错', err)
          this.following = false
        })
      }
    },
    joinCircle () {
      let {need_audit, followed} = this.dynamic.circleInfo
      if (followed) {
        return false
      }
      let _rightText = need_audit ? '申请加入' : '立即加入'
      this.$prompt.showAlert({contentText: '加入圈子才能进行更多操作哦~', leftText: '我再想想', rightText: _rightText}, () => {
        this.applyJoinCircle()
      }, () => {
        console.log('cancel')
      })
    },
    clickLike () {
      if (this.dynamic.submitting) {
        return false
      }
      this.$emit('changeLike')
    },
    clickComment (id) {
      if (!utils.checkLogin()) { // 未登陆或已加入均返回
        return false
      }

      if (this.following) { // 正在申请
        this.$toast('正在申请...')
        return false
      }
      if ((this.dynamic.show_allways.toString() !== '1') && this.dynamic.circleInfo && !this.dynamic.circleInfo.followed) { // 不可见
        this.joinCircle()
        return false
      }

      this.$router.push({
        name: 'DynamicSendComment',
        query: { dy_id: this.dynamic.id },
        params: {
          dynamic: this.dynamic
        }
      })
    }
  },
  mounted () {
    console.log('dynamic', this.dynamic)
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.fix-box::before{
  @include borderTop;
}
.fix-box {
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  background-color: #FAFAFA;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-box {
  width: 50%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: #666;
}
.comment-box:before{
  content: "";
  display: block;
  width: 2px;
  height: 36px;
  background-color: #BBBBBB;
  position: absolute;
  left: 0;
  top: 50%;
  transform: scale(0.5, 1) translateY(-50%);
  transform-origin: 0 0;
}
.icon-comment_icon2 {
  font-size: 35px;
  color: #666;
}
.like-box {
  width: 50%;
  height: 100%;
  display: block;
  position: relative;
}
.like-icon-box{
  width: 34%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 33%;
  top: 0;
}
.like-comment-box-text{
  font-size: 24px;
  margin-left: 16px;
}
.icon-like {
  font-size: 35px;
  color: #fe5273;
}
.icon-dislike {
  font-size: 35px;
  color: #666;
}
</style>
