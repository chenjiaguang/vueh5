//动态固底交互
<template>
  <div class="fix-box">
    <div class="comment-input" @click="clickComment(dynamic.id)">
      来说点什么吧~
    </div>
    <div class="comment-box">
      <i class="iconfont icon-comment_icon"></i>
      <div class="badge-container">
        <div class="badge">{{dynamic.comment_num}}</div>
      </div>

    </div>

    <div class="like-box" @click="clickLike(dynamic.id)">
      <transition
        enter-active-class="animated wobble"
        leave-active-class="hide"
      >
        <div v-if="dynamic.has_like" style="height:100%;width:100%;">
          <i class='iconfont icon-like'></i>
        </div>
      </transition>

      <div v-if="!dynamic.has_like" style="height:100%;width:100%;">
        <i class='iconfont icon-dislike'></i>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '../lib/utils'
export default {
  props: ['dynamic'],
  data () {
    return {}
  },
  computed: {
    likeData: function () {
      return {
        type: '0',
        id: this.dynamic.id,
        like: this.dynamic.has_like
      }
    }
  },
  components: {},
  methods: {
    clickLike (id) {
      this.$ajax('/jv/qz/like', { data: this.likeData })
        .then(res => {
          let nowHasLike = (this.dynamic.has_like = !this.dynamic.has_like)
          if (nowHasLike) {
            // 增加
            this.dynamic.like_list.splice(0, 0, res.data)
            this.dynamic.like_num++
          } else {
            // 减少
            let i = this.dynamic.like_list.findIndex((value, index, arr) => {
              return value.uid === res.data.uid
            })
            this.dynamic.like_list.splice(i, 1)
            this.dynamic.like_num--
          }
        })
    },
    clickComment (id) {
      if (utils.checkLogin()) {
        this.$router.push({
          name: 'DynamicSendComment',
          query: { dy_id: this.dynamic.id },
          params: {
            dynamic: this.dynamic
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.fix-box {
  position: fixed;
  height: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;

  border-top-width: 0.5px;
  border-color: #cbcbcb;
  border-top-style: solid;

  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-input {
  background-color: #f1f1f1;
  border-radius: 16px;
  width: 496px;
  height: 60px;
  font-size: 30px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  color: #c5c5c5;
}
.comment-box {
  height: 55px;
  width: 55px;
  padding: 10px;
  margin-left: 47px;
  position: relative;
}
.icon-comment_icon {
  font-size: 35px;
}
.like-box {
  height: 55px;
  width: 55px;
  padding: 10px;
  margin-left: 37px;
}
.icon-like {
  font-size: 35px;
  color: #fe5273;
}
.icon-dislike {
  font-size: 35px;
}
.badge-container {
  position: absolute;
  top: -10px;
  width: 70px;
  text-align: center;
}
.badge {
  background-color: #fe5273;
  border-radius: 12px;
  font-size: 24px;
  padding: 4px;
  color: #fff;
  display: inline-block;
  min-width: 30px;
}
</style>
