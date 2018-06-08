<template>
  <div class="info-wrapper">
    <div class="info-text">{{text}}</div>
    <div class="position-btn clearfix" @click.stop="drive"><i class="position-sign iconfont icon-position fl"></i><span class="position-btn-text">去这里</span></div>
  </div>
</template>

<style scoped>
  .info-wrapper{
    padding: 14px 192px 14px 20px;
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    max-width: 600px;
  }
  .info-text{
    font-size: 30px;
    line-height: 38px;
    padding: 12px 0;
  }
  .position-btn{
    width: 152px;
    height: 62px;
    line-height: 62px;
    font-size: 30px;
    color: #fff;
    background-color: #1EB0FD;
    border-radius: 6px;
    padding: 0 12px;
    box-sizing: border-box;
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -31px;
  }
  .position-sign{
    font-size: 34px;
    margin-right: 2px;
    vertical-align: middle;
  }
  .position-btn-text{
    vertical-align: middle;
  }
</style>

<script>
  export default {
    name: 'mapInfoWindow',
    data () {
      return {
        text: ''
      }
    },
    methods: {
      drive () {
        console.log('log')
      }
    }
  }
</script>
