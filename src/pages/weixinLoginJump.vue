<template>
  <div></div>
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
        if (utils.needPhone() && !res.data.phone) {
          // 需要手机号而又没有手机号
          this.$router.push({
            name: 'SMSCode',
            query: { type: 'bindPhone' },
            params: { token: res.data.token }
          })
        } else {
          // 需要手机号而又有手机号
          // 不需要手机号
          this.$store.commit('login/login', {
            token: res.data.token,
            phone: res.data.phone
          })
          utils.loginBack()
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
