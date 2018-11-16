<template>
  <iframe class="iframe" height="1000" frameborder="0" src="about:blank" scrolling="no" id="content"></iframe>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      let url = this.$route.query && this.$route.query.url
      this.$ajax('/jv/anonymous/call/get?url=' + url, {
        method: 'GET'
      }).then(res => {
        let text = res.data.result
        this.setContent(text)
      })
    },
    setContent (data) {
      let iframe = document.getElementById('content')
      iframe.srcdoc = data
    }
  }
}
</script>

<style scoped>
.iframe {
}
</style>
