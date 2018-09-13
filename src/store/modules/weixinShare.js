import ajax from '@/lib/ajax'
export default {
  namespaced: true,
  state: {
    type: ''
  },
  mutations: {
    set (state, payload = {}) {
      console.log('payload', payload)
      state.type = payload.type || ''
      global.wx.ready(function () {
        // 需在用户可能点击分享按钮前就先调用
        global.wx.updateAppMessageShareData(
          {
            title: payload.title, // 分享标题
            desc: payload.desc, // 分享描述
            link: payload.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: payload.imgUrl // 分享图标
          },
          function (res) {
            console.log('type', state.type)
            if (state.type) {
              ajax('/jv/share/article/addPoint', { data: { type: state.type } })
            }
          }
        )
        global.wx.onMenuShareAppMessage({
          title: payload.title, // 分享标题
          desc: payload.desc, // 分享描述
          link: payload.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: payload.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            console.log('type', state.type)
            if (state.type) {
              ajax('/jv/share/article/addPoint', { data: { type: state.type } })
            }
          }
        })
        global.wx.onMenuShareQQ({
          title: payload.title, // 分享标题
          desc: payload.desc, // 分享描述
          link: payload.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: payload.imgUrl, // 分享图标
          success: function () {
            console.log('type', state.type)
            if (state.type) {
              ajax('/jv/share/article/addPoint', { data: { type: state.type } })
            }
          },
          cancel: function () {
          // 用户取消分享后执行的回调函数
          }
        })
      })
    }
  }
}
