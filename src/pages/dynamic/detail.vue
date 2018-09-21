<template>
  <div :style="{height: $winHeight + 'px'}">

    <div v-if="dynamic" :style="{height: $winHeight-(80/750*$winWidth) + 'px'}">
      <div id="mescroll" class="mescroll" >
        <div>
          <download-box v-if="$route.query.isShareOpen && !$isApp" />
          <div class="container">
            <div v-if="dynamic" id="title-container" class="column">
              <div v-if="dynamic.title" class="title">{{dynamic.title}}</div>
              <div class="row space-between center">
                <!-- 左 -->
                <div class="row">
                  <img class="avatar" :src="dynamic.avatar" @click="clickUser(dynamic.uid)"/>
                  <div class="flex column space-between">
                    <!-- 上 -->
                    <div class="row">
                      <div class="username" @click="clickUser(dynamic.uid)">{{dynamic.username}}</div>
                    </div>
                    <!-- 下 -->
                    <div class="row">
                      <div class="time">{{dynamic.time}}</div>
                      <!-- <div class="fromPrefix" v-if="dynamic.fromQz">发布于</div>
                      <div class="fromQz" v-if="dynamic.fromQz" @click="clickQz(dynamic.circle_id)">{{dynamic.fromQz}}</div> -->
                    </div>
                  </div>
                </div>
                <!-- 右 -->
                <div>
                  <transition name="fade-quick">
                    <div class="follow-button" v-if="!dynamic.is_following&&!dynamic.is_owner"  @click="clickFollow(dynamic.uid)">+ 关注</div>
                  </transition>
                </div>
              </div>
            </div>

            <div v-if="dynamic&&dynamic.isArticle" id="article-content-container" class="column">
              <div v-for="(content,index) in dynamic.contents" :key="index">
                <div class="article-image-container">
                  <img ref="articleImage" class="article-image" v-if="content.type == 2" :src="(content.cover.gif && content.cover.staticImage) ? content.cover.staticImage : (content.cover.url)" @click="previewImagesInArticle(content.imageIndex, $refs['articleImage'], (content.cover.gif && content.cover.staticImage) ? content.cover.staticImage : content.cover.url)" />
                  <div class="long-tag" v-if="content.type == 2 && content.cover.longCover && !content.cover.gif">长图</div>
                  <div class="gif-tag" v-if="content.type == 2 && content.cover.gif"></div>
                </div>

                <div class="article-desc" v-if="content.type==2&&content.des">{{content.des}}</div>
                <div class="article-content" v-if="content.type==1">{{content.content}}</div>
              </div>
            </div>

            <div v-if="dynamic&&!dynamic.isArticle" id="content-container" class="column">
              <div class="dynamic-content" v-html="handleContentUrl(dynamic.content)"></div>
              <TopicTagBox :topicInfo="dynamic.topicInfo" />
              <DetailImageContainer class="detail-image-container"  :images="dynamic.covers" :router="$router" />
              <a class="content-article-box row center" v-if="dynamic.aid" :href="dynamic.newsArticle.article_url">
                <div v-if="dynamic.newsArticle.covers && dynamic.newsArticle.covers[0]" class="content-article-img" :style="`background-image:url(${dynamic.newsArticle.covers[0].compress || dynamic.newsArticle.covers[0].url})`"/>
                <div v-else class="content-article-img">
                  <i class="iconfont link-image icon-link_icon"></i>
                </div>
                <div class="content-article-content">{{dynamic.newsArticle.name || dynamic.newsArticle.article_url}}</div>
              </a>
              <a class="content-article-box row center" v-if="dynamic.linkInfo && dynamic.linkInfo.id" :href="dynamic.linkInfo.url">
                <div v-if="dynamic.linkInfo.cover" class="content-article-img" :style="`background-image:url(${dynamic.linkInfo.cover})`"/>
                <div v-else class="content-article-img">
                  <i class="iconfont link-image icon-link_icon"></i>
                </div>
                <div class="content-article-content">{{dynamic.linkInfo.title || dynamic.linkInfo.url}}</div>
              </a>
            </div>

            <div v-if="dynamic && (dynamic.actid || dynamic.location || dynamic.circle_name)" id="foot-container" class="column">
              <a class="content-activity-box row center" v-if="dynamic.actid" href="javascript:void(0)" @click="clickActivity(dynamic.actid)">
                <div class="content-activity-img" :style="`background-image:url(${dynamic.activity.covers?dynamic.activity.covers[0].compress:''})`"/>
                <div class="content-activity-right column space-between">
                  <div class="content-activity-title">{{dynamic.activity.title}}</div>
                  <div class="content-activity-address">{{dynamic.activity.address}}</div>
                  <div class="content-activity-time_text">{{dynamic.activity.time_text}}</div>
                </div>
              </a>
              <div class="row foot-info-box" v-if="dynamic.location">
                <i class="iconfont icon-location" ></i>
                <div class="location">{{dynamic.location}}</div>
              </div>
              <div class="row circle-box" v-if="dynamic.circle_name">
                <span class="circle-name" style="border-width: 1px">{{dynamic.circle_name}}</span>
              </div>
            </div>
            <div class="comment-and-like">
              <div class="gray-block"></div>
              <div class="comment-and-like-header">
                <div class="comment-header">评论{{parseInt(dynamic.comment_num) ? (' ' + dynamic.comment_num) : ''}}</div>
                <div class="like-header" v-if="dynamic&&dynamic.like_num>0">
                  <span>{{dynamic.like_num}}人点了赞</span>
                  <transition-group class="like-avatar-list" name="avatar-animate" tag="div">
                    <div v-for="image in dynamic.like_list.filter((item, index) => index < 3)" :key="image.uid" class="like-avatar-item" :style="{backgroundImage: 'url(' + image.avatar + ')'}"></div>
                  </transition-group>
                </div>
              </div>
              <div class="comment-list" v-if="dynamic && dynamic.comment_list && dynamic.comment_list.length > 0">
                <transition-group name="fade-slow" tag="div">
                  <div v-for="(comment) in dynamic.comment_list" class="transition-quick" :key="'comments'+comment.id">
                    <div class="comment-box row space-between">
                      <div class="column">
                        <img class="user-avatar" :src="comment.avatar" @click="clickUser(comment.uid)" />
                      </div>
                      <div class="comment-right-box column" >
                        <div class="row">
                          <div class="comment-username" @click="clickUser(comment.uid)">{{comment.username}}</div>
                        </div>
                        <div class="comment-content" @click="()=>showReplyActionSheet(comment,comment.username)" v-html="handleContentUrl(comment.content)"></div>
                        <div class="comment-time">{{comment.time}}</div>

                        <transition name="fade-slow">
                          <div v-if="comment.replys.list.length>0" class="comment-replies-box">
                            <transition-group name="fade-slow" tag="div">
                              <div class="reply-box transition-quick" v-for="(reply) in comment.replys.list" :key="'replys'+reply.id" @click.stop="()=>showReplyActionSheet(comment,reply.username,reply.id)">
                                <span class="reply-from" v-if="reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}</span><span class="reply-from" v-if="!reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}:</span><span class="reply-reply" v-if="reply.pusername">回复</span><span class="reply-to" v-if="reply.pusername" @click.stop="clickUser(reply.puid)">{{reply.pusername}}:</span><span class="reply-content" v-html="handleContentUrl(reply.content)"></span>
                              </div>
                            </transition-group>
                            <div class="reply-box transition-quick" v-if="!comment.replys.paging.is_end">
                              <span class="reply-more" v-if="!comment.replys.paging.is_end" @click.stop="()=>fetchMoreReplies(comment)">查看更多回复></span>
                            </div>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
              <div class="comment-empty-list" v-else>暂无评论</div>
            </div>

            <!-- <div v-if="dynamic&&dynamic.like_num>0" class="like-box" id="like-container">
              <div class="like-text">{{dynamic.like_num}}个人点了赞</div>
              <div class="row space-between">
                <div class="row center">
                  <div class="image-avatar-box row flex-wrap-wrap">
                    <img class="image-avatar" v-for="(image) in dynamic.like_list" :src="image.avatar" :key="image.uid" @click="clickUser(image.uid)"/>
                    <i class="iconfont icon-more" v-if="dynamic.like_num>20"></i>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="dynamic&&dynamic.comment_num>0" id="comment-container" class="column" >
              <div class="comment-text" >{{dynamic.comment_num}}条评论</div>
              <transition-group name="fade-slow" tag="div">
                <div v-for="(comment) in dynamic.comment_list" class="transition-quick" :key="'comments'+comment.id">
                  <div class="comment-box row space-between">
                    <div class="column">
                      <img class="user-avatar" :src="comment.avatar" @click="clickUser(comment.uid)" />
                    </div>
                    <div class="comment-right-box column" >
                      <div class="row">
                        <div class="comment-username" @click="clickUser(comment.uid)">{{comment.username}}</div>
                      </div>
                      <div class="comment-content" @click="()=>showReplyActionSheet(comment,comment.username)" v-html="handleContentUrl(comment.content)"></div>
                      <div class="comment-time">{{comment.time}}</div>

                      <transition name="fade-slow">
                        <div v-if="comment.replys.list.length>0" class="comment-replies-box">
                          <transition-group name="fade-slow" tag="div">
                            <div class="reply-box transition-quick" v-for="(reply) in comment.replys.list" :key="'replys'+reply.id" @click.stop="()=>showReplyActionSheet(comment,reply.username,reply.id)">
                              <span class="reply-from" v-if="reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}</span><span class="reply-from" v-if="!reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}:</span><span class="reply-reply" v-if="reply.pusername">回复</span><span class="reply-to" v-if="reply.pusername" @click.stop="clickUser(reply.puid)">{{reply.pusername}}:</span><span class="reply-content" v-html="handleContentUrl(reply.content)"></span>
                            </div>
                          </transition-group>
                          <div class="reply-box transition-quick" v-if="!comment.replys.paging.is_end">
                            <span class="reply-more" v-if="!comment.replys.paging.is_end" @click.stop="()=>fetchMoreReplies(comment)">查看更多回复></span>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <ScrollToTop v-if="dynamic" :visible="scrollToTopVisible" :scroll="this.mescroll" :isMeScroll="true"/>
    <DynamicFixedBox v-if="dynamic" :dynamic="dynamic" @changeLike="changeLike"/>
    <NotFoundPage v-if="isLoad&&!dynamic"/>
  </div>
</template>

<script>
import Vue from 'vue'
import DownloadBox from '../../components/DownloadBox'
import MeScrollSupport from '../../mixin/MeScrollSupport'
import WeixinShareInKeepAlive from '../../mixin/WeixinShareInKeepAlive'
import DynamicFixedBox from '../../components/DynamicFixedBox'
import ScrollToTop from '../../components/ScrollToTop'
import TopicTagBox from '../../components/TopicTagBox'
import DetailImageContainer from '../../components/DetailImageContainer'
import utils from '../../lib/utils'
import NotFoundPage from '../notFoundPage'
import MeScroll from 'mescroll.js'
import { ActionSheet } from 'cube-ui'
Vue.use(ActionSheet)
export default {
  mixins: [MeScrollSupport, WeixinShareInKeepAlive],
  data () {
    if (this.$isApp && !this.$route.query.isArticle) { // 范团app内打开,跳转原生短动态页面
      // appCall('finishWebView')
      this.$appCall('h5GoShortDynamic', this.$route.query.id)
    } else if (this.$isApp && !this.$route.query.isArticle) { // 范团app内打开,跳转原生长文页面
      // appCall('finishWebView')
      this.$appCall('h5GoLongDynamic', this.$route.query.id)
    }
    return {
      mescroll: null, // mescroll实例对象
      dynamic: null,
      isLoad: false,
      covers: [],
      imageList: [],
      options: {
        pullDownRefresh: false,
        pullUpLoad: true,
        useTransition: false
      },
      paging: {},
      scrollToTopVisible: false,
      likeSubmitting: false,
      following: false
    }
  },
  components: {
    DownloadBox,
    DynamicFixedBox,
    ScrollToTop,
    TopicTagBox,
    DetailImageContainer,
    NotFoundPage
  },
  // beforeRouteEnter (to, from, next) {
  //   if (to.query.isArticle && to.query.isArticle !== 'false') {
  //     utils.beforeRouteEnterHandleShareOpen(to, from, next, 4)
  //   } else {
  //     utils.beforeRouteEnterHandleShareOpen(to, from, next, 3)
  //   }
  // },
  mounted () {
    this.fetch()
  },
  watch: {
    $route: function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(
        this,
        val,
        oldVal,
        'DynamicDetail',
        ['id'],
        () => {
          this.dynamic = null
          this.isLoad = false
          this.fetch()
        },
        () => {
          this.runShareBindfunction()
        }
      )
    }
  },
  activated () {
    console.log('window.history', window.history)
    if (this.isArticle) {
      document.title = '长文详情'
    } else {
      document.title = '动态详情'
    }
  },
  computed: {
    isArticle: function () {
      return (
        this.$route.query.isArticle && this.$route.query.isArticle !== 'false'
      )
    },
    followData: function () {
      return {
        follow: '1',
        following_id: this.dynamic.uid
      }
    },
    dynamicData: function () {
      return {
        id: this.$route.query.id,
        showAll: false,
        origin: 'H5'
      }
    },
    replyData: function () {
      return {
        commentId: '',
        limit: '10'
      }
    }
  },
  methods: {
    changeLike () {
      if (!utils.checkLogin()) {
        return false
      }
      const isLike = this.dynamic.has_like
      const likeNum = parseInt(this.dynamic.like_num)
      let rData = {
        id: this.dynamic.id,
        like: !isLike,
        type: 0
      }
      this.dynamic.has_like = !isLike
      this.dynamic.like_num = likeNum + (isLike ? -1 : 1)
      this.dynamic.submitting = true
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (!res || (res && Boolean(res.error))) { // 出错时重置点赞
          this.dynamic.has_like = isLike
          this.dynamic.like_num = likeNum
          this.dynamic.submitting = false
        } else {
          if (this.dynamic.has_like) { // 增加
            let i = this.dynamic.like_list.length + 1
            this.dynamic.like_list.splice(i, 0, res.data)
          } else { // 减少
            let i = null
            this.dynamic.like_list.forEach((ele, idx) => {
              if (ele.uid === res.data.uid) {
                i = idx
                return false
              }
            })
            if (i || i === 0) {
              this.dynamic.like_list.splice(i, 1)
            }
          }
          this.dynamic.submitting = false
        }
      }).catch(err => {
        this.dynamic.has_like = isLike
        this.dynamic.like_num = likeNum
        this.dynamic.submitting = false
      })
    },
    handleContentUrl (content) {
      return utils.handleContentUrl(content)
    },
    fetch () {
      let url = ''
      if (this.isArticle) {
        url = '/jv/anonymous/qz/dynamicarticle'
      } else {
        url = '/jv/anonymous/qz/dynamic'
      }
      this.$ajax(url, { data: this.dynamicData, dontToast: true })
        .then(res => {
          this.dynamic = res.data
          let i = 0
          this.dynamic.isArticle = this.isArticle
          this.paging = res.data.paging
          if (this.isArticle) { // 长文
            document.title = res.data.title
          } else {
            document.title = '范团-海南生活圈'
          }

          if (this.isArticle) {
            this.covers = res.data.covers
            this.imageList = this.dynamic.contents
              .filter(content => {
                return content.type === '2'
              })
              .map(content => {
                content.imageIndex = i++
                return {
                  width: content.width,
                  height: content.height,
                  url: content.imageUrl
                }
              })
          }
          console.log('dynamic.contents', this.dynamic.contents, this.covers)

          this.setShareData({
            type: this.isArticle ? '4' : '3',
            title: res.data.shareInfo.shareTitle,
            desc: res.data.shareInfo.shareContent,
            url: res.data.shareInfo.shareUrl,
            imgUrl: res.data.shareInfo.shareImage
          })

          this.isLoad = true
          this.$nextTick(() => {
            this.mescroll = new MeScroll('mescroll', {
              down: {
                use: false
              },
              up: {
                auto: false,
                callback: this.fetchMoreComments,
                htmlLoading: '<p class="">正在加载...</p>',
                htmlNodata: '<p class="">再刷也没有了</p>',
                onScroll: (mescroll, y, isUp) => {
                  this.onScrollHandle({y: y})
                }
              }
            })
          })
        })
        .catch(e => {
          this.isLoad = true
        })
    },
    fetchMoreReplies (comment) {
      this.replyData.commentId = comment.id
      comment.pn = comment.pn ? comment.pn + 1 : 2
      this.replyData.pn = comment.pn
      this.$ajax('/jv/anonymous/qz/replays', { data: this.replyData })
        .then(res => {
          res.data.list.forEach(element => {
            comment.replys.list.push(element)
          })
          comment.replys.paging.is_end = res.data.paging.is_end
          if (res.data.paging.is_end) {
            this.options.pullUpLoad = false
          }
        })
        .catch()
    },
    fetchMoreComments () {
      console.log('this.paging', this.paging)
      if (this.paging && this.paging.is_end) {
        this.mescroll.endSuccess(0, false)
        return false
      }
      this.dynamicData.pn = parseInt(this.paging.pn) ? parseInt(this.paging.pn) + 1 : 1
      let url = ''
      if (this.isArticle) {
        url = '/jv/anonymous/qz/dynamicarticle'
      } else {
        url = '/jv/anonymous/qz/dynamic'
      }
      this.$ajax(url, { data: this.dynamicData })
        .then(res => {
          res.data.comment_list.forEach(element => {
            this.dynamic.comment_list.push(element)
          })
          this.paging = res.data.paging

          this.mescroll.endSuccess(res.data.comment_list.length, !res.data.paging.is_end)
        })
        .catch()
    },
    clickUser (uid) {
      this.$router.push({ name: 'UserCenter', query: { user_id: uid }, params: {resetData: true} })
    },
    clickFollow (uid) {
      this.$ajax('/jv/user/follow', { data: this.followData })
        .then(res => {
          this.dynamic.is_following = true
          this.$toast(res.msg ? res.msg : '关注成功', 2000, () => {})
        })
        .catch()
    },
    clickActivity (id) {
      this.$router.push({ name: 'ActivityDetail', query: { id: id }, params: {resetData: true} })
    },
    applyJoinCircle () {
      let {need_audit, id} = this.dynamic.circleInfo
      if (need_audit) { // 跳转申请加入
        this.$router.push({name: 'CircleApply', query: {circle_id: id}})
      } else { // 直接申请
        if (this.following) { // 正在申请
          this.$toast('正在申请...')
          return false
        }
        let rData = {
          id: id,
          follow: 1
        }
        this.following = true
        this.$ajax('/jv/qz/following', {data: rData}).then(res => {
          if (res && !res.error) { // 申请成功
            this.dynamic.circleInfo.followed = true
            this.following = false
            this.$toast('加入成功')
          } else if (res.error && res.msg) {
            this.following = false
            this.$toast(res.msg)
          } else {
            this.following = false
          }
        }).catch(err => {
          console.log('加入圈子出错', err)
          this.following = false
        })
      }
    },
    joinCircle () {
      let {need_audit, followed} = this.dynamic.circleInfo
      let _rightText = need_audit ? '申请加入' : '立即加入'
      if (followed || !utils.checkLogin()) { // 已加入或未登录均返回
        return false
      }
      if (this.following) { // 正在申请
        this.$toast('正在申请...')
        return false
      }
      this.$prompt.showPrompt({contentText: '加入圈子才能进行更多操作哦~', leftText: '我再想想', rightText: _rightText}, () => {
        this.applyJoinCircle()
      }, () => {
        console.log('cancel')
      })
    },
    showReplyActionSheet (comment, replyName = '', pid = '') {
      this.$createActionSheet({
        data: [
          {
            content: '回复',
            class: 'action-sheet-item'
          }
        ],
        onSelect: (item, index) => {
          if (index === 0) {
            if (!utils.checkLogin()) { // 未登陆返回
              return false
            }
            if ((this.dynamic.show_allways.toString() !== '1') && this.dynamic.circleInfo && !this.dynamic.circleInfo.followed) { // 不可见且不加入
              this.joinCircle()
              return false
            }
            this.$router.push({
              name: 'DynamicSendComment',
              query: {
                commentId: comment.id,
                pid: pid,
                isReply: true,
                replyName: replyName
              },
              params: {
                comment: comment
              }
            })
          }
        }
      }).show()
    },
    onScrollHandle (pos) {
      let y = pos.y
      if (y > this.$winHeight) {
        this.scrollToTopVisible = true
      } else {
        this.scrollToTopVisible = false
      }
    },
    previewImagesInArticle (idx, el, placeholder) {
      this.$previewImage.show({
        images: this.imageList,
        idx,
        clickedEl: el,
        placeholder
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  /* margin-bottom: 100px; */
}
#title-container {
  padding-top: 26px;
  margin-bottom: 43px;
}
#title-container, #article-content-container, #content-container, #foot-container, #like-container, #comment-container{
  margin-left: 4%;
  margin-right: 4%;
}
.title {
  margin-bottom: 36px;
  color: #333333;
  font-size: 56px;
  line-height: 68px;
  font-weight: bold;
}
.avatar {
  height: 76px;
  width: 76px;
  border-radius: 38px;
  margin-right: 24px;
}
.username {
  color: #333333;
  font-size: 28px;
  font-weight: bold;
}
.time {
  color: #999999;
  font-size: 24px;
  margin-right: 20px;
}
.fromPrefix {
  color: #999999;
  font-size: 24px;
}
.fromQz {
  color: #1eb0fd;
  font-size: 24px;
}
.follow-button {
  width: 98px;
  height: 44px;
  text-align: center;
  font-size: 24px;
  line-height: 44px;
  color: #ffffff;
  background-color: #1eb0fd;
  border-radius: 6px;
}
.follow-cancel-button {
  width: 98px;
  height: 44px;
  text-align: center;
  font-size: 24px;
  line-height: 44px;
  color: #ffffff;
  background-color: #1eb0fd;
  border-radius: 6px;
}
/********************************************************************/
#article-content-container {
  margin-bottom: 60px;
}
.article-content {
  font-size: 32px;
  line-height: 50px;
  color: #333333;
  margin-bottom: 21px;
  white-space: pre-wrap;
  word-break: break-all;
}
.article-desc {
  font-size: 24px;
  line-height: 34px;
  color: #999999;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 36px;
}
.article-image-container {
  margin-left: -30px;
  margin-right: -30px;
  position: relative;
  overflow: hidden;
}
.article-image {
  display: block;
  width: 100%;
  flex: 1;
  margin-bottom: 15px;
}
.long-tag{
  width: 128px;
  height: 64px;
  font-size: 42px;
  line-height: 64px;
  color: #fff;
  border-top-left-radius: 16px;
  background-color: rgba(0,0,0,0.5);
  text-align: center;
  position: absolute;
  right: 0;
  bottom: 15px;
  transform: scale(0.5, 0.5);
  transform-origin: 100% 100%;
  z-index: 1;
}
.gif-tag{
  width: 54px;
  height: 26px;
  position: absolute;
  bottom: 25px;
  right: 10px;
  background-image: url('/h5/cwebassets/image/is_gif.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.foot-info-box {
  margin-bottom: 24px;
}
.location {
  font-size: 24px;
  line-height: 28px;
  color: #999999;
  margin-right: 30px;
}
.viewNum {
  font-size: 24px;
  line-height: 28px;
  color: #999999;
}
.top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-left: 42px;
  padding-right: 42px;
  padding-top: 56px;
  padding-bottom: 56px;
}
.top-text {
  color: #ffffff;
  font-size: 32px;
  text-align: center;
}
.top-close {
  position: absolute;
  left: 42px;
  top: 56px;
  height: 34px;
  width: 34px;
}
.icon-location {
  font-size: 24px;
  color: #1eb0fd;
  margin-right: 10px;
}
.circle-box {
  margin-bottom: 24px;
}
.circle-name {
  margin-top: 1px;
  border-radius: 6px;
  border-color: #1eb0fd;
  border-style: solid;
  color: #1eb0fd;
  font-size: 24px;
  padding: 12px 20px 12px 20px;
}
#foot-container{
  margin-bottom: 36px;
}
/*************************************************************************/
.dynamic-content {
  color: #333333;
  font-size: 32px;
  line-height: 46px;
  margin-bottom: 17px;
  word-break: break-all;
  white-space: pre-wrap;
}
.detail-image-container {
  margin-left: -30px;
  margin-right: -30px;
  margin-bottom: 24px;
}
.content-article-box {
  background-color: #f5f5f5;
  height: 128px;
  margin-bottom: 24px;
}
.content-article-img {
  height: 100px;
  width: 100px;
  margin-left: 14px;
  background-size: cover;
  background-position: center;
  background-color: #D8D8D8;
  display: flex;
  justify-content: center;
  align-items: center;
}
.link-image{
  font-size: 38px;
  color: #4B4B4B;
}
.content-article-content {
  flex: 1;
  width: 542px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 28px;
  line-height: 36px;
  margin-left: 20px;
  margin-right: 14px;
  word-break: break-all;
}
.content-activity-box {
  background-color: #f5f5f5;
  height: 128px;
  margin-bottom: 24px;
}
.content-activity-img {
  height: 100px;
  width: 100px;
  margin-left: 14px;
  background-size: cover;
  background-position: center;
}
.content-activity-right {
  flex: 1;
  margin-left: 20px;
  margin-right: 14px;
}
.content-activity-title {
  flex: 1;
  width: 542px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333333;
  font-size: 28px;
  line-height: 34px;
  margin-bottom: 14px;
}
.content-activity-address {
  flex: 1;
  width: 542px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #999999;
  font-size: 24px;
  margin-bottom: 14px;
}
.content-activity-time_text {
  flex: 1;
  color: #999999;
  font-size: 24px;
}

/*************************************************************************/
#title-container {
  margin-bottom: 20px;
}
.image-avatar-box {
  margin-right: -30px;
  margin-bottom: 30px;
}
.image-avatar {
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.icon-more {
  font-size: 60px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.like-text {
  color: #333333;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;
}
/**************************************************************************/
.comment-text {
  font-size: 28px;
  color: #333333;
  margin-bottom: 40px;
  font-weight: bold;
}
.user-avatar {
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin-right: 20px;
}
.comment-box {
  margin-bottom: 40px;
}
.comment-right-box {
  flex: 1;
}
.comment-username {
  color: #225894;
  font-size: 28px;
  line-height: 28px;
  margin-bottom: 14px;
}
.comment-content {
  color: #333333;
  font-size: 30px;
  line-height: 42px;
  margin-bottom: 14px;
  word-break: break-all;
  white-space: pre-wrap;
}
.comment-time {
  color: #999999;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 24px;
}
.comment-replies-box {
  padding-top: 18px;
  padding-bottom: 10px;
  padding-left: 24px;
  padding-right: 24px;
  background-color: #f6f6f6;
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
}
.reply-box {
  background-color: transparent;
  margin-bottom: 8px;
}
.reply-box:active {
  background-color: #cccccc;
}
.reply-from {
  color: #255a96;
  font-size: 26px;
  line-height: 38px;
}
.reply-reply {
  color: #666666;
  font-size: 26px;
  line-height: 38px;
}
.reply-to {
  color: #255a96;
  font-size: 26px;
  line-height: 38px;
}
.reply-content {
  color: #333333;
  font-size: 26px;
  line-height: 38px;
}
.reply-more {
  color: #255a96;
  font-size: 26px;
  line-height: 38px;
}
.comment-and-like{
  width: 100%;
}
.gray-block{
  width: 100%;
  height: 12px;
  background-color: #F0F0F0;
}
.comment-and-like-header{
  height: 96px;
  display: flex;
  align-items: center;
  position: relative;
}
.comment-and-like-header:before{
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: #E5E5E5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(1, 0.5);
  transform-origin: 0 100%;
}
.comment-header{
  margin-left: 4%;
  font-size: 28px;
  line-height: 40px;
  font-weight: 700;
}
.like-header{
  flex: 1;
  height: 100%;
  margin-right: 4%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24px;
  line-height: 40px;
  color: #666;
}
.like-avatar-list{
  display: flex;
  flex-direction: row-reverse;
  height: 100%;
  flex-wrap: nowrap;
  position: relative;
  align-items: center;
  margin-left: 8px;
  margin-right: 15px;
}
.like-avatar-item{
  width: 40px;
  height: 40px;
  box-sizing: content-box;
  border: 2px solid #fff;
  margin-right: -15px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  position: relative;
  /* box-shadow: 0 0 6px rgba(0,0,0,0.57); */
}
.comment-list{
  padding-top: 40px;
  margin: 0 4%;
}
.comment-empty-list{
  height: 380px;
  box-sizing: border-box;
  padding-top: 60px;
  font-size: 28px;
  line-height: 48px;
  color: #666;
  text-align: center;
}

  .avatar-animate-enter-active, .avatar-animate-leave-active {
    transition: all 300ms;
  }
  .avatar-animate-enter, .avatar-animate-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width: 0;
    height: 0;
    border-width: 0;
    opacity: 0;
    margin-right: 0;
  }
/*************************************************************/
.cube-pullup-wrapper {
  height: 50px;
  align-items: start;
}
</style>
