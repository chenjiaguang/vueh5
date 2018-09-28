<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
//
export default {
  name: 'App',
  data () {
    return {
      shareType: {
        CircleDetail: 1,
        TopicDetail: 2,
        ShortDynamicl: 3,
        LongDynamic: 4,
        ActivutyDetail: 5
      },
      transitionName: 'none',
      mounted () {
        if (window.localStorage.token) {
          this.$store.commit('login/login', {
            token: window.localStorage.token
          })
        }
      }
    }
  },
  mounted () {
    /**
     * 分享打开计数功能 不带next 返回bool表示是否有路由更新
     * type: 1：圈子 2：话题 3：短动态 4：长文 5：活动
     */
    if (
      this.$route.query.isShareOpen &&
      this.$route.query.isShareOpen !== 'false'
    ) {
      let _type = ''
      if (this.$route.name === 'dynamicDetail') {
        // 动态详情页分为短动态和长文、其他的按路由来确定type
        if (
          this.$route.query.isArticle &&
          this.$route.query.isArticle !== 'false'
        ) {
          _type = 4
        } else {
          _type = 3
        }
      } else {
        _type = this.shareType[this.$route.name]
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
