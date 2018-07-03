<template>
  <keep-alive>
    <div class="success-wrapper">
      <i class="success-icon iconfont icon-success"></i>
      <div class="success-header">测试支付页面</div>
      <div v-for="(value, key) in query" :key="key">
        {{ key }}: {{ value }}
      </div>
    </div>
  </keep-alive>
</template>

<script>
  export default {
    data () {
      return {
        query: this.$route.query
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
