import ajax from '@/lib/ajax'
export default {
  namespaced: true,
  state: {
    type: ''
  },
  mutations: {
    set (state, payload = {}) {
      state.type = payload.type || ''
      ajax('/jv/anonymous/ticket/get', {
        data: 'url=' + encodeURIComponent(window.location.href),
        contentType: 'application/x-www-form-urlencoded'
      })
        .then(res => {
          global.wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appid, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
          })

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
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
