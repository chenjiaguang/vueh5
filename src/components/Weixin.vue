<template>
  <div class="weixin-container" v-if="show" @click="hideTip">
    <div class="box">
      <div class="clearfix">
        <img class="image fr" src='@/../cwebassets/image/throw_arrow.png' />
      </div>
      <div class="text-box">
        <div class="clearfix">
          <div class="text fl">1.点击右上角</div>
          <div id="menu-dot" class="fl"><div></div><div></div><div></div></div>
        </div>
        <div class="clearfix">
          <span class="text fl">2.选择在</span><span class="text fl" style="color:#ff3f53;padding-left:5px;padding-right:5px">浏览器</span><span class="text fl">中打开</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show'],
  data () {
    return {}
  },
  methods: {
    hideTip () {
      this.$emit('changeShow')
    }
  }
}
</script>
<style scoped>
#menu-dot{
  display:inline-block;
  width:40px;
  height:30px;
  background:#323233;
  border-radius:6px;
  box-sizing:border-box;
  padding-top:12px;
  font-size:0;
  line-height:0;
  text-align:center;
  transform:scale(0.5, 0.5);
  transform-origin:50% 50%;
  margin-top:9px;
}

#menu-dot div{
  width:5px;
  height:5px;
  border-radius:50%;
  background:#fff;
  display:inline-block;
  margin:0 2px;
}
.clearfix:after{
  content: "";
  display: block;
  width: 100%;
  height: 0;
  visibility: hidden;
  clear: both;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
.box{
  z-index: 99999;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.6);
}
.text-box{
  margin-top:20px;
  margin-left:30px;
  margin-right:30px;
  border-radius: 3px;
  background-color: #ffffff;
  padding: 30px;
}
.text{
  font-size: 32px;
  line-height: 48px;
}
.image{
  width: 80px;
  height: 127px;
  margin-right: 30px;
}
.weixin-container{
  z-index: 99999;
  position: fixed;
  left: 0;
  top: 0;
}

</style>
