import browserUA from './browserUA';

import router from '../router'

export default {
  isPoneAvailable: function (phone) {
    var myreg = /^[1][0-9]{10}$/;
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },
  checkLogin: function () {
    if (window.localStorage.token) {
      return true;
    }
    if (browserUA.isWeixin()) {
      let APPID = 'wx0aa5b5708df88bd9'
      let REDIRECT_URI = 'http://fant.fantuanlife.com/jump.php?addr=http://192.168.11.166:8080/h5/weixinLoginJump'
      // let REDIRECT_URI = 'http://192.168.11.166:8080/h5/weixinLoginJump'
      // 011Q8uGu0Phiab1jGDHu0fizGu0Q8uGt
      let SCOPE = 'snsapi_userinfo'
      window.location = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}#wechat_redirect`
    } else {
      router.push({
        name: 'SMSCode',
        query: { type: 'login' }
      })
    }
    return false;
  }
}
