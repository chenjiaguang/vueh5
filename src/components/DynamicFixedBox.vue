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
      <transition name="fade" mode="out-in">
        <i v-if="dynamic.has_like" class='iconfont icon-like' key="1"></i>
        <i v-else class='iconfont icon-dislike' key="2"></i>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: ['dynamic'],
  data () {
    return {};
  },
  computed: {
    likeData: function () {
      return {
        type: '0',
        id: this.dynamic.id,
        like: !this.dynamic.has_like
      };
    }
  },
  components: {},
  methods: {
    clickLike (id) {
      this.dynamic.has_like = !this.dynamic.has_like;
      this.$ajax('/jv/qz/like', { data: this.likeData })
        .then(res => {
          if (this.dynamic.has_like) {
            // 增加
            this.dynamic.like_list.splice(0, 0, res.data);
            this.dynamic.like_num++;
          } else {
            // 减少
            let i = this.dynamic.like_list.findIndex((value, index, arr) => {
              return value.uid === res.data.uid;
            });
            this.dynamic.like_list.splice(i, 1);
            this.dynamic.like_num--;
          }
        })
        .catch();
    },
    clickComment (id) {
      this.$router.push({
        name: 'DynamicSendComment',
        query: { dy_id: this.dynamic.id }
      });
    }
  }
};
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

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
  padding: 2px;
  color: #fff;
  display: inline-block;
  min-width: 30px;
}
</style>
