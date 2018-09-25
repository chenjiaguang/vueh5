<template>
  <div class="article-page">
    <div v-if="article">
      <download-box v-if="$route.query.isShareOpen && !$isApp" />
      <div class="container">
        <div v-if="article" id="title-container" class="column">
          <div v-if="article.name" class="title">{{article.name}}</div>
          <div class="row space-between center">
            <!-- 左 -->
            <div class="row">
              <img class="avatar" :src="article.avatar" @click="!$isApp&&clickUser(article.uid)"/>
              <div class="flex column space-between">
                <!-- 上 -->
                <div class="row">
                  <div class="username" @click="!$isApp&&clickUser(article.uid)">{{article.username}}</div>
                </div>
                <!-- 下 -->
                <div class="row">
                  <div class="time">{{article.time}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="align-items: flex-start;" class="article-content toutiaohao" id="article-frame"></div>
        <iframe class="iframe" height="1000" frameborder="0" src="about:blank" scrolling="no" id="article-frame-weixin"></iframe>
        <div class="comment" @click="openFantTuanC" v-if="!$isApp">打开范团APP，查看全部精彩评论</div>
      </div>
    </div>
    <NotFoundPage v-if="isLoad&&!article"/>
    <weixin :show="showWeixinTip" @changeShow="showHideTip" />
  </div>
</template>

<script>
import Vue from 'vue'
import utils from '../../lib/utils'
import { ActionSheet } from 'cube-ui'
import NotFoundPage from '../notFoundPage'
import DownloadBox from '../../components/DownloadBox'
import download from '@/lib/download.js'
import Weixin from '@/components/Weixin.vue'
import WeixinShareInKeepAlive from '../../mixin/WeixinShareInKeepAlive'
Vue.use(ActionSheet)
export default {
  mixins: [WeixinShareInKeepAlive],
  data () {
    return {
      article: null,
      isLoad: false,
      showWeixinTip: false
    }
  },
  components: {
    NotFoundPage,
    DownloadBox,
    Weixin
  },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(
        this,
        val,
        oldVal,
        'NewsDetail',
        ['id'],
        () => {
          this.article = null
          this.isLoad = false
          this.fetch()
        },
        () => {
          this.runShareBindfunction()
        }
      )
    }
  },
  computed: {
    isShowAll: function () {
      return (
        this.$route.query.showAll && this.$route.query.showAll !== 'false'
      )
    },
    fetchData: function () {
      return {
        id: this.$route.query.id,
        showAll: this.isShowAll
      }
    }
  },
  methods: {
    openFantTuanC () { // 打开范团app或下载
      console.log('打开范团app或下载')
      let browserInfo = download.browserInfo()
      if (browserInfo.isWeixin) { // 微信内置浏览器
        this.showWeixinTip = true
      } else {
        download.click()
      }
    },
    showHideTip () {
      this.showWeixinTip = !this.showWeixinTip
    },
    clickUser (uid) {
      this.$router.push({ name: 'UserCenter', query: { user_id: uid }, params: {resetData: true} })
    },
    fetch () {
      let url = '/jv/anonymous/newsarticle/articledetail'
      this.$ajax(url, { data: this.fetchData, dontToast: true })
        .then(res => {
          this.article = res.data
          this.paging = res.data.paging
          document.title = this.article.name
          if (res && res.data && !res.error) {
            if (this.$isApp) { // 在范团app内打开，跳转原生文章详情页面
              this.$appCall('h5GoArticleDetail', this.$route.query.id, res.data.article_url)
            }
          }
          if (this.article.content_type === '0') {
            // 如果是微信则读url
            let isWeixin = this.article.news_type === '2'
            if (isWeixin) {
              if (this.article.article_url.indexOf('mp.weixin.qq.com') > -1) {
                console.log(this.article.article_url)
                // 如果是微信链接
                let weixinUrl = encodeURIComponent(this.article.article_url)

                this.$ajax('/jv/anonymous/call/get?url=' + weixinUrl, { method: 'GET' }).then(res => {
                  let text = res.data.result
                  text = text.replace(/data-src/g, 'src')
                  text = text.replace(/\\n/, '')
                  this.setContentFromWeixin(text)
                })
              } else {
                // 如果是范团微信内容链接
                // https://fanttest.fantuanlife.com/index.html#/article/detail?article_id=65
                this.$nextTick(() => {
                  this.setContentFromFantuanWeixin(this.article.content)
                })
              }
            } else {
              this.$nextTick(() => {
                this.setContent(this.article.content)
              })
            }
          }
          this.setShareData({
            type: '0',
            title: res.data.shareInfo.shareTitle,
            desc: res.data.shareInfo.shareContent,
            url: res.data.shareInfo.shareUrl,
            imgUrl: res.data.shareInfo.shareImage
          })
          this.isLoad = true
        })
        .catch(e => {
          this.isLoad = true
        })
    },
    setContentFromWeixin (data) {
      document.getElementById('article-frame').remove()
      let iframe = document.getElementById('article-frame-weixin')
      iframe.contentDocument.body.innerHTML = data
      // iframe.contentDocument.body.style.zoom = '180%'
      // 删除多余元素，修改样式
      iframe.contentWindow.document.getElementById('activity-name').remove()
      iframe.contentWindow.document.getElementById('meta_content').remove()
      if (iframe.contentWindow.document.getElementById('js_view_source')) {
        iframe.contentWindow.document.getElementById('js_view_source').remove()
      }
      let els1 = iframe.contentWindow.document.getElementsByClassName('rich_media_area_extra')
      if (els1.length > 0) {
        for (const el of els1) {
          el.remove()
        }
      }

      iframe.contentWindow.document.getElementById('page-content').style.backgroundColor = '#ffffff'
      iframe.contentWindow.document.body.style.fontSize = '12px'

      // 视频兼容
      let els = iframe.contentWindow.document.getElementsByClassName('video_iframe')
      if (els.length > 0) {
        for (const el of els) {
          el.style.width = '100%'
          let src = el.src
          let rexW = /width=(\d+)/
          let w = rexW.exec(src)[1]
          let rexH = /height=(\d+)/
          let h = rexH.exec(src)[1]
          let newW = Math.round(els[0].clientWidth)
          let newH = Math.round(h / w * newW)

          src = src.replace('width=' + w, 'width=' + newW)
          src = src.replace('height=' + h, 'height=' + newH)
          els[0].src = src
          el.style.height = newH + 'px'
        }
      }

      this.setIframeHeight(iframe)
      setInterval(() => {
        this.setIframeHeight(iframe)
      }, 1000)
    },
    setContentFromFantuanWeixin (data) {
      document.getElementById('article-frame-weixin').remove()
      let div = document.getElementById('article-frame')
      div.innerHTML = data

      let _editor = document.getElementsByTagName('xmteditor"')[0]
      if (_editor) {
        _editor.style.display = 'block'
      }
    },
    setContent (data) {
      // 匹配一个不带?参数的图片url (?!\?)为负向零宽断言
      data = data.replace(/(staticcdntest.fantuanlife.com\/uimage[^"]*?\.jpg)(?!\?)/g, '$1?x-oss-process=image/interlace,1/format,jpg')

      document.getElementById('article-frame-weixin').remove()
      let div = document.getElementById('article-frame')
      div.innerHTML = data

      // div.style.fontSize = '32px'
    },
    // frame高度适应
    setIframeHeight (iframe) {
      if (iframe) {
        var iframeWin = iframe.contentWindow || (iframe.contentDocument && iframe.contentDocument.parentWindow)
        if (iframeWin && iframeWin.document.body) {
          iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight
        }
      }
    }
  }
}
</script>

<style scoped>
.article-page{
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
/******************************基本样式*******************************/
.container {
  width: 100%;
  overflow: hidden;
}
#title-container {
  padding-top: 34px;
  margin-bottom: 36px;
}
#title-container, #article-content-container, #content-container, #foot-container, #like-container, #comment-container{
  margin-left: 4%;
  margin-right: 4%;
}
.title {
  margin-bottom: 29px;
  color: #444444;
  font-size: 46px;
  line-height: 60px;
  font-weight: bold;
}
.avatar {
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin-right: 8px;
}
.username {
  color: #444444;
  font-size: 28px;
  font-weight: bold;
}
.time {
  color: #999999;
  font-size: 22px;
  margin-right: 20px;
}
.comment {
  flex: 1;
  text-align: center;
  color:#1EB0FD;
  font-size: 34px;
  background-color: #eff9ff;
  border-radius: 4px ;
  padding-top:28px;
  padding-bottom:28px;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 68px;
  margin-bottom: 68px;
}
</style>
<style>
xmteditor{
  max-width: 100%;
}
.video_iframe{
  width:100%
}

#preview {
  box-sizing: border-box;
  overflow-y: auto;
  margin: 0 auto;
  padding: 10px;
  width: 100%;
  max-width: 750px;
  min-height: 667px;
  max-height: 100vh;
  background-color: #ffffff;
}
#article-frame{
  padding-left:30px;
  padding-right:30px;
}
#article-frame *{
  font-size: 32px;
  line-height: 1.68;
}
#article-frame a:active{
  background-color: #e5e5e5;
}
#article-frame img{
  max-width:100% !important;
  display:block;
  margin:30px 0;
}
#article-frame strong{
  font-weight: bold;
}

#article-frame img.default{
  background:#f0f0f0;
}
#article-frame p{
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  margin:20px 0;
}
#article-frame h1,
#article-frame h2,
#article-frame h3,
#article-frame h4,
#article-frame h5,
#article-frame h6{
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  font-size:34px;
}
/*今日头条图片说明样式*/
#article-frame .pgc-img-caption{
  text-align: center;
  color: #777;
  font-size: 24px;
  line-height: 24px;
  margin-top: -20px;
  margin-bottom: 20px;
}
#article-frame blockquote {
  font-size: 32px;
  line-height: 44px;
  padding: 30px;
  color: #999;
  border: 2px solid #E8E8E8;
  background: #F4F5F6;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  -webkit-margin-start: 0;
  -webkit-margin-end: 0;
}
#article-frame blockquote p{
  font-size: 32px;
  line-height: 44px;
  margin: 20px !important;
  color: #505050;
}
#article-frame-weixin{
  width:750px;
}
</style>
