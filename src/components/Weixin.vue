<template>
  <div class="weixin-container" v-if="show" @click="hideTip">
    <div class="box">
      <div class="clearfix">
        <img class="image fr" :src="$assetsFullPath +'image/throw_arrow.png'" />
      </div>
      <div class="text-box">
        <div class="tip-line">
          <div class="text">1.点击右上角</div>
          <div id="menu-dot"><div></div><div></div><div></div></div>
        </div>
        <div class="tip-line">
          <span class="text">2.选择在</span><span class="text" style="color:#ff3f53;padding-left:5px;padding-right:5px">浏览器</span><span class="text">中打开</span>
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
  display:flex;
  justify-content: center;
  align-items: center;
  width:64px;
  height:44px;
  background:#323233;
  border-radius:10px;
  transform: scale(0.5, 0.5);
}

#menu-dot div{
  width:8px;
  height:8px;
  border-radius:50%;
  background:#fff;
  margin:0 4px;
}
.tip-line{
  display: flex;
  align-items: center;
  height: 48px;
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
  max-width: 800PX;
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
  line-height: 40px;
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
