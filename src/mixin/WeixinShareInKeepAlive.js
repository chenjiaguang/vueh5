import ajax from '@/lib/ajax'
import utils from '@/lib/utils'
let mixin = {
  data () {
    return {
      _shareData: null,
      _shareConfig: null
    }
  },
  methods: {
    loadConfig () {
      ajax('/jv/anonymous/ticket/get', {
        data: 'url=' + encodeURIComponent(window.location.href),
        contentType: 'application/x-www-form-urlencoded'
      })
        .then(res => {
          if (res.data) {
            this._shareConfig = res.data
            this.runShareBindfunction()
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    setShareData (data) {
      this._shareConfig = null
      this._shareData = data
      this.runShareBindfunction()
    },
    runShareBindfunction () {
      if (!this._shareConfig) {
        this.loadConfig()
      } else if (this._shareConfig && this._shareData) {
        utils.weixinShareHandle(this._shareData, this._shareConfig)
      }
    }
  }
}
export default mixin
