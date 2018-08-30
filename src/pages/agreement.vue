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
      }
    }
  },
  created () {
    let _type = this.$route.query && this.$route.query.type
    if (_type) {
      this.src = this.srcObject[_type]
    }
  }
}
</script>
