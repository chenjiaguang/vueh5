<template>
  <div class="fix-box">
    <div class="left">
        <i class="iconfont icon-goback" />
    </div>
    <div class="mid">评论</div>
    <div class="right">发布</div>
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
  height: 88px;
  left: 0;
  right: 0;
  top: 0;
  background-color: #fafafa;

  border-bottom-width: 0.5px;
  border-color: #E5E5E5;
  border-bottom-style: solid;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.icon-goback{
  font-size: 41px;
  padding-left: 21px;
}
.mid{
  color:#333333;
  font-size:34px;
}
.right{
  color:#C5C5C5;
  font-size:32px;
  padding-right: 30px;
}
</style>
