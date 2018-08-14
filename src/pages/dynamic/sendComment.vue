<template>
  <div class="container">
    <div class="fix-box">
      <div class="left">
          <i class="iconfont icon-goback" />
      </div>
      <div class="mid">评论</div>
      <div :class="['right',content?'active':null]">发布</div>
    </div>
    <textarea class="input" placeholder="来说点什么吧~" v-model="content"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: ''
    };
  },
  components: {},
  mounted () {
  },
  methods: {
  }
};
</script>

<style src='../../common.css' />
<style scoped>
.container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.input{
  flex: 1;
  margin-top: 90px;
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  border: none;
  resize: none;
  border:0;
  border-image-width:0;

  color: #333333;
  font-size: 34px;
}

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
  font-weight: bold;
}
.right.active{
  color:#1EB0FD;
}
</style>
