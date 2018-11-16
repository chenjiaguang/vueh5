<template>
  <iframe v-if="src" ref="wrapper" :style="{height: $winHeight + 'px'}" class="agreement-wrapper" :src="src"></iframe>
</template>

<style scoped>
  .agreement-wrapper{
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 0 4%;
    border: none;
    margin: 0;
  }
  .agreement-wrapper /deep/ body{
    margin: 0;
  }
  .agreement-wrapper /deep/ p{
    line-height: 1.375 !important;
  }
</style>

<script>
export default {
  name: 'Agreement',
  data () {
    return {
      src: '',
      srcObject: {
        user: this.$assetsPublicPath + '/cwebassets/userAgreement.html',
        author: this.$assetsPublicPath + '/cwebassets/authorAgreement.html',
        activity: this.$assetsPublicPath + '/cwebassets/activityAgreement.html'
      },
      titleObject: {
        user: '范团用户协议',
        author: '范团作者协议',
        activity: '范团活动协议'
      }
    }
  },
  created () {
    let _type = this.$route.query && this.$route.query.type
    if (this.$route.query.url) {
      this.src = this.$route.query.url
      return false
    }
    if (_type) {
      this.src = this.srcObject[_type]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.query && vm.$route.query.type) {
        let _title = vm.titleObject[vm.$route.query.type]
        if (_title) {
          document.title = _title
        }
      }
    })
  }
}
</script>
