<template>
  <keep-alive>
    <div class="success-wrapper">
      <i class="success-icon iconfont icon-success"></i>
      <div class="success-header">报名成功</div>
      <div v-if="counter" class="success-tip">{{counter}}秒后自动跳转到电子票页面</div>
    </div>
  </keep-alive>
</template>

<script>
  export default {
    data () {
      return {
        timer: null,
        counter: null
      }
    },
    methods: {
      goTicket (id) {
        this.$router.replace({name: 'ActivityTicket', params: {id: id}})
      }
    },
    mounted () {
      this.counter = 3
      this.timer = setInterval(() => {
        this.counter -= 1
        if (this.counter <= 0) {
          clearInterval(this.timer)
          this.goTicket(1355544)
        }
      }, 1000)
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .success-wrapper{
    padding-top: 80px;
    text-align: center;
    .success-icon{
      font-size: 120px;
      color: #1EB0FD;
    }
    .success-header{
      font-size: 36px;
      line-height: 44px;
      padding: 36px 0;
      text-align: center;
    }
    .success-tip{
      font-size: 26px;
      line-height: 34px;
      padding: 16px 0;
      color: #999;
      text-align: center;
    }
  }
</style>
