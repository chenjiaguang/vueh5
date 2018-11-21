<template>
<div>
</div>
</template>

<script>
import utils from '../lib/utils'
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {
    let code = this.$route.query.code
    this.$ajax('/jv/anonymous/login/wexin', {
      data: {
        code: code,
        origin: 'H5'
      }
    })
      .then(res => {
        if (res.data.phone) {
          this.$store.commit('login/login', {
            token: res.data.token
          })
          utils.loginBack()
        } else {
          // 后面绑定了手机后 才写入token
          this.$router.replace({
            name: 'SMSCode',
            query: { type: 'bindPhone' },
            params: { token: res.data.token }
          })
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {}
}
</script>

<style scoped>
</style>
