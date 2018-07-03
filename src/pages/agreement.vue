<template>
  <iframe v-if="src" ref="wrapper" :style="{height: winHeight + 'px'}" class="agreement-wrapper" :src="src"></iframe>
</template>

<style scoped>
  .agreement-wrapper{
    background: red;
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
        winHeight: window.innerHeight,
        src: '',
        srcObject: {
          user: '/cwebassets/userAgreement.html',
          author: '/cwebassets/authorAgreement.html',
          activity: '/cwebassets/activityAgreement.html'
        }
      }
    },
    created () {
      console.log('route', this.$route)
      let _type = this.$route.query && this.$route.query.type
      if (_type) {
        this.src = this.srcObject[_type]
      }
    }
  }
</script>
