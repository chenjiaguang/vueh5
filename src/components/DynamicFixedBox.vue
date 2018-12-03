//动态固底交互
<template>
  <div class="fix-box">
    <div class="comment-and-like-item" @click="clickLike(dynamic.id)">
      <!-- <transition
        enter-active-class="animated wobble"
        leave-active-class="hide"
      >
        <div v-if="dynamic.has_like" class="like-icon-box">
          <i class='iconfont icon-like'></i>
          <span class="like-comment-box-text">{{likeNumber || ''}}</span>
        </div>
      </transition>

      <div v-if="!dynamic.has_like" class="like-icon-box">
        <i class='iconfont icon-dislike'></i>
        <span class="like-comment-box-text">{{likeNumber || ''}}</span>
      </div> -->
      <div class="comment-and-like-icon-box">
        <transition name="fade">
          <i v-if="dynamic.has_like" class='iconfont icon-like_v_2_5 comment-and-like-icon'></i>
        </transition>
        <transition name="fade">
          <i v-if="!dynamic.has_like" class='iconfont icon-dislike_v_2_5 comment-and-like-icon'></i>
        </transition>
        <span>{{likeNumber || '赞'}}</span>
      </div>
      <div class="right-line"></div>
    </div>
    <div class="comment-and-like-item" @click="clickComment(dynamic.id)">
      <!-- <i class="iconfont icon-comment_icon2"></i>
      <span class="like-comment-box-text">{{commentNumber || ''}}</span> -->
      <div class="comment-and-like-icon-box">
        <i class="iconfont icon-comment_icon comment-and-like-icon"></i>
        <span>{{commentNumber || '评论'}}</span>
      </div>
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
          console.log('加入群组出错', err)
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
      this.$prompt.showPrompt({titleText: '加入群组才能进行更多操作哦~', leftText: '我再想想', rightText: _rightText}, () => {
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
      if (!utils.checkLogin(true)) { // 未登陆或已加入均返回
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
  max-width: 800PX;
  height: 80px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FAFAFA;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-and-like-item{
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 4%;
  color: #333;
  position: relative;
}
.comment-and-like-icon-box{
  height: 100%;
  overflow: hidden;
  text-align: center;
  position: absolute;
  padding-left: 72px;
  padding-right: 18px;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-size: 26px;
  line-height: 80px;
}
.right-line{
  width: 2px;
  height: 72px;
  background: #bbb;
  position: absolute;
  top: 50%;
  right: 0;
  transform: scale(0.5, 0.5) translateY(-50%);
  transform-origin: 100% 0;
}
.comment-and-like-icon{
  display: block;
  position: absolute;
  left: 18px;
  // top: 50%;
  // transform: translateY(-50%);
  font-size: 36px;
  color: inherit;
  overflow: visible;
}
.icon-like_v_2_5{
  color: #FE5273;
}
.icon-dislike_v_2_5{
  color: #333;
}
.fade-enter-active, .fade-leave-active {
  transition: all 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5)
}
</style>
