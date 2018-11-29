<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import utils from './lib/utils'
import browserUA from './lib/browserUA'
//
export default {
  name: 'App',
  data () {
    return {
      shareType: {
        '/h5/circle/detail': 1,
        '/h5/topic/detail': 2,
        ShortDynamicl: 3,
        LongDynamic: 4,
        '/h5/activity/detail': 5
      },
      transitionName: 'none'
    }
  },
  mounted () {
    if (window.location.pathname !== '/h5/weixinLoginJump' &&
    window.location.pathname !== '/h5/smsCode' &&
    browserUA.isWeixin()
    ) {
      if (!window.localStorage.token) {
        setTimeout(() => {
          utils.checkLogin()
        }, 10000)
      }
    }

    // 获取地址中的参数
    let searchStr = window.location.search.replace('?', '')
    let searchArr = searchStr.split('&')
    let searchObj = {}
    searchArr.forEach(item => {
      let temArr = item.split('=')
      searchObj[temArr[0]] = temArr[1]
    })
    /**
     * 分享打开计数功能 不带next 返回bool表示是否有路由更新
     * type: 1：群组 2：话题 3：短动态 4：长文 5：活动
     */
    if (
      searchObj.isShareOpen &&
      searchObj.isShareOpen !== 'false'
    ) {
      let _type = ''
      if (window.location.pathname === '/h5/dynamic/detail') {
        // 动态详情页分为短动态和长文、其他的按路由来确定type
        if (
          searchObj.isArticle &&
          searchObj.isArticle !== 'false'
        ) {
          _type = 4
        } else {
          _type = 3
        }
      } else {
        _type = this.shareType[window.location.pathname]
      }
      if (_type) {
        this.$ajax('/jv/share/anonymous/open', { data: { type: _type } })
      }
    }
  }
}
</script>

<style src='./assets/css/common.css' />
<style>
html {
  height: 100%;
}
#app {
  height: 100%;
  max-width: 800PX;
  margin: 0 auto;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
}
body {
  margin: 0;
  color: #333;
  background-color: #fff;
  height: 100%;
}
*,
::before,
::after {
  margin: 0;
  padding: 0;
  /*清除移动端默认的点击高亮效果*/
  -webkit-tap-highlight-color: transparent;
  /*设置以边框开始计算宽度*/
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
a {
  color: #333;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

input {
  border: none;
  outline: none;
  /*清除移动端默认的表单样式*/
  -webkit-appearance: none;
}

.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */
</style>
