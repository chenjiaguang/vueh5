<template>
  <div class="fix-box">
    <div class="comment-input" @click="clickComment(dynamic.id)">
      来说点什么吧~
    </div>
    <div class="comment-box">
      <i class="iconfont icon-comment_icon"></i>
      <div class="badge-container">
        <div class="badge">0</div>
      </div>

    </div>

    <div class="like-box" @click="clickLike(dynamic.id)">
      <i class="iconfont icon-dislike"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: ['dynamic'],
  data () {
    return {
    };
  },
  components: {  },
  methods: {
    clickLike (id) {

    },
    clickComment (id) {

    }
  }
};
</script>
<style scoped>
.fix-box{
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
  border-color: #CBCBCB;
  border-top-style: solid;

  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment-input{
  background-color: #F1F1F1;
  border-radius:16px;
  width:496px;
  height:60px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  color:#C5C5C5;
}
.comment-box{
  height: 55px;
  width: 55px;
  padding: 10px;
  margin-left: 47px;
  position: relative;
}
.icon-comment_icon{
  font-size: 35px;
}
.like-box{
  height: 55px;
  width: 55px;
  padding: 10px;
  margin-left: 37px;
}
.icon-dislike{
  font-size: 35px;
}
.badge-container{
  position: absolute;
  top: -10px;
  width: 70px;
  text-align: center;
}
.badge{
  background-color: #FE5273;
  border-radius: 12px;
  font-size: 20px;
  padding: 5px;
  color: #fff;
  display: inline-block;
  min-width: 30px;
}
</style>
