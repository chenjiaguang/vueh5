<template>
<div>
</div>
</template>

<script>
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
          this.$toast(res.data.phone + res.data.token, 2000, () => {})
          this.$store.commit('login/login', {
            token: res.data.token
          })
          this.$router.back()
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
