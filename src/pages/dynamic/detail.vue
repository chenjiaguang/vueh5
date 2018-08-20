<template>
  <div :style="{height: winHeight + 'px'}">

    <div v-if="dynamic" :style="{height: winHeight-(100/750*winWidth) + 'px'}">
      <cube-scroll
        ref="contentScroll"
        :data="dynamic.comment_list"
        :options="options"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-up="fetchMoreComments()">
        <template slot="pullup" slot-scope="props">
          <div class="cube-pullup-wrapper pullup-wrapper" :style="props.pullUpStyle">
            <div class="pullup-content" v-if="!dynamic.paging.is_end">正在加载...</div>
            <div class="pullup-content" v-if="dynamic.paging.is_end">再刷也没有了</div>
          </div>
        </template>
        <DownloadBox />
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
                  <div class="follow-button" v-if="!dynamic.is_following"  @click="clickFollow(dynamic.uid)">+ 关注</div>
                </transition>
              </div>
            </div>
          </div>

          <div v-if="dynamic&&isArticle" id="article-content-container" class="column">
            <div v-for="(content,index) in dynamic.contents" :key="index">
              <div class="article-image-container">
                <img class="article-image" v-if="content.type==2" :src="content.imageUrl" @click="previewImagesInArticle(content.imageIndex)"/>
              </div>

              <div class="article-desc" v-if="content.type==2&&content.des">{{content.des}}</div>
              <div class="article-content" v-if="content.type==1">{{content.content}}</div>
            </div>
            <div class="row foot-info-box" v-if="dynamic.location">
              <i class="iconfont icon-location"></i>
              <div class="location">{{dynamic.location}}</div>
            </div>
          </div>

          <div v-if="dynamic&&!isArticle" id="content-container" class="column">
            <div class="dynamic-content">{{dynamic.content}}</div>
            <TopicTagBox :topicInfo="dynamic.topicInfo" />
            <DetailImageContainer class="detail-image-container"  :images="dynamic.covers"/>
            <a class="content-article-box row center" v-if="dynamic.aid" :href="dynamic.newsArticle.article_url">
              <div class="content-article-img" :style="`background-image:url(${dynamic.newsArticle.covers[0].compress})`"/>
              <div class="content-article-content">{{dynamic.newsArticle.name}}</div>
            </a>
            <a class="content-activity-box row center" v-if="dynamic.actid" href="javascript:void(0)" @click="clickActivity(dynamic.actid)">
              <div class="content-activity-img" :style="`background-image:url(${dynamic.activity.covers[0].compress})`"/>
              <div class="content-activity-right">
                <div class="content-activity-title">{{dynamic.activity.title}}</div>
                <div class="content-activity-address">{{dynamic.activity.address}}</div>
                <div class="content-activity-time_text">{{dynamic.activity.time_text}}</div>
              </div>
            </a>
            <div class="row foot-info-box" v-if="dynamic.location">
              <i class="iconfont icon-location" ></i>
              <div class="location">{{dynamic.location}}</div>
            </div>
            <div class="row">
              <span class="circle-name" v-if="dynamic.circle_name">{{dynamic.circle_name}}</span>
            </div>
          </div>

          <div v-if="dynamic&&dynamic.like_num>0" class="like-box" id="like-container">
            <div class="like-text">{{dynamic.like_num}}个人点了赞</div>
            <div class="row space-between">
              <div class="row center">
                <div class="image-avatar-box row flex-wrap-wrap">
                  <img class="image-avatar" v-for="(image,index) in dynamic.like_list" :src="image.avatar" :key="index" @click="clickUser(image.uid)"/>
                  <i class="iconfont icon-more" v-if="dynamic.like_num>20"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-if="dynamic&&dynamic.comment_num>0" id="comment-container" class="column" >
            <div class="comment-text" >{{dynamic.comment_num}}条评论</div>
            <transition-group name="fade-slow" tag="div">
              <div v-for="(comment) in dynamic.comment_list" :key="'comments'+comment.id">
                <div class="comment-box row space-between">
                  <div class="column">
                    <img class="user-avatar" :src="comment.avatar" @click="clickUser(comment.uid)" />
                  </div>
                  <div class="comment-right-box column" >
                    <div class="row">
                      <div class="comment-username" @click="clickUser(comment.uid)">{{comment.username}}</div>
                    </div>
                    <div class="comment-content" @click="()=>showReplyActionSheet(comment,comment.username)">{{comment.content}}</div>
                    <div class="comment-time">{{comment.time}}</div>

                    <transition name="fade-slow">
                      <div v-if="comment.replys.list.length>0" class="comment-replies-box">
                        <transition-group name="fade-slow" tag="div">
                          <div class="reply-box" v-for="(reply) in comment.replys.list" :key="'replys'+reply.id" @click.stop="()=>showReplyActionSheet(comment,reply.username,reply.id)">
                            <span class="reply-from" v-if="reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}</span><span class="reply-from" v-if="!reply.pusername" @click.stop="clickUser(reply.uid)">{{reply.username}}:</span><span class="reply-reply" v-if="reply.pusername">回复</span><span class="reply-to" v-if="reply.pusername" @click.stop="clickUser(reply.puid)">{{reply.pusername}}:</span><span class="reply-content">{{reply.content}}</span>
                          </div>
                        </transition-group>
                        <div class="reply-box" v-if="!comment.replys.paging.is_end">
                          <span class="reply-more" v-if="!comment.replys.paging.is_end" @click.stop="()=>fetchMoreReplies(comment)">查看更多回复></span>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </cube-scroll>
    </div>
    <ScrollToTop v-if="dynamic" :visible="scrollToTopVisible" :scroll="$refs.contentScroll"/>
    <DynamicFixedBox v-if="dynamic" :dynamic="dynamic"/>
    <NotFoundPage v-if="isLoad&&!dynamic"/>
  </div>
</template>

<script>
import Vue from 'vue';
import DownloadBox from '../../components/DownloadBox';
import DynamicFixedBox from '../../components/DynamicFixedBox';
import ScrollToTop from '../../components/ScrollToTop';
import TopicTagBox from '../../components/TopicTagBox';
import DetailImageContainer from '../../components/DetailImageContainer';
import NotFoundPage from '../notFoundPage';
import { Scroll, ActionSheet } from 'cube-ui';
Vue.use(Scroll);
Vue.use(ActionSheet);
export default {
  data () {
    return {
      dynamic: null,
      isLoad: false,
      imageList: [],
      options: {
        pullDownRefresh: false,
        pullUpLoad: true
      },
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
      pn: 1,
      scrollToTopVisible: false,
      isArticle:
        this.$route.query.isArticle && this.$route.query.isArticle !== 'false'
    };
  },
  components: {
    DownloadBox,
    DynamicFixedBox,
    ScrollToTop,
    TopicTagBox,
    DetailImageContainer,
    NotFoundPage
  },
  mounted () {
    this.fetch();
  },
  activated () {
    if (!this._refreshId) {
      this._refreshId = this.$route.query.id
    }
    if (this._refreshId !== this.$route.query.id) {
      this._refreshId = this.$route.query.id
      this.dynamic = null;
      this.isLoad = false;
      this.fetch();
    }
    if (this.isArticle) {
      document.title = '长文详情';
    } else {
      document.title = '动态详情';
    }
  },
  computed: {
    followData: function () {
      return {
        follow: '1',
        following_id: this.dynamic.uid
      };
    },
    dynamicData: function () {
      return {
        id: this.$route.query.id,
        showAll: false,
        origin: 'H5'
      };
    },
    replyData: function () {
      return {
        commentId: '',
        limit: '10'
      };
    }
  },
  methods: {
    fetch () {
      let url = '';
      if (this.isArticle) {
        url = '/jv/anonymous/qz/dynamicarticle';
      } else {
        url = '/jv/anonymous/qz/dynamic';
      }
      this.$ajax(url, { data: this.dynamicData, dontToast: true })
        .then(res => {
          this.dynamic = res.data;
          let i = 0;
          if (this.isArticle) {
            this.imageList = this.dynamic.contents
              .filter(content => {
                return content.type === '2';
              })
              .map(content => {
                content.imageIndex = i++;
                return content.imageUrl;
              });
          }
          this.isLoad = true;
        })
        .catch(e => {
          this.isLoad = true;
        });
    },
    fetchMoreReplies (comment) {
      this.replyData.commentId = comment.id;
      comment.pn = comment.pn ? comment.pn + 1 : 2;
      this.replyData.pn = comment.pn;
      this.$ajax('/jv/anonymous/qz/replays', { data: this.replyData })
        .then(res => {
          res.data.list.forEach(element => {
            comment.replys.list.push(element);
          });
          comment.replys.paging.is_end = res.data.paging.is_end;
          if (res.data.paging.is_end) {
            this.options.pullUpLoad = false;
          }
        })
        .catch();
    },
    fetchMoreComments () {
      this.pn++;
      this.dynamicData.pn = this.pn;
      let url = '';
      if (this.isArticle) {
        url = '/jv/anonymous/qz/dynamicarticle';
      } else {
        url = '/jv/anonymous/qz/dynamic';
      }
      this.$ajax(url, { data: this.dynamicData })
        .then(res => {
          res.data.comment_list.forEach(element => {
            this.dynamic.comment_list.push(element);
          });
          this.dynamic.paging.is_end = res.data.paging.is_end;
          if (res.data.paging.is_end) {
            this.$refs.contentScroll.forceUpdate();
          }
        })
        .catch();
    },
    clickUser (uid) {
      this.$router.push({ name: 'UserCenter', query: { user_id: uid } });
    },
    clickFollow (uid) {
      this.$ajax('/jv/user/follow', { data: this.followData })
        .then(res => {
          this.dynamic.is_following = true;
          this.$toast(res.msg ? res.msg : '关注成功', 2000, () => {});
        })
        .catch();
    },
    clickActivity (id) {
      this.$router.push({ name: 'ActivityDetail', query: { id: id } });
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
            });
          }
        }
      }).show();
    },
    onScrollHandle (pos) {
      let y = -pos.y;
      if (y > window.innerHeight) {
        this.scrollToTopVisible = true;
      } else {
        this.scrollToTopVisible = false;
      }
    },
    previewImagesInArticle (index) {
      this.$previewImage.show({
        images: this.imageList,
        idx: index
      });
    }
  }
};
</script>

<style src='../../common.css' />
<style scoped>
.container {
  margin-left: 30px;
  margin-right: 30px;
  /* margin-bottom: 100px; */
}
#title-container {
  padding-top: 30px;
  margin-bottom: 43px;
}
.title {
  margin-bottom: 40px;
  color: #333333;
  font-size: 56px;
  line-height: 60px;
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
}
.article-image {
  width: 100%;
  flex: 1;
  margin-bottom: 13px;
}
.foot-info-box {
  margin-top: 30px;
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
.circle-name {
  margin-top: 24px;
  border-radius: 6px;
  border-width: 1px;
  border-color: #1eb0fd;
  border-style: solid;
  color: #1eb0fd;
  font-size: 24px;
  padding: 12px 20px 12px 20px;
}
/*************************************************************************/
#content-container {
  margin-bottom: 60px;
}
.dynamic-content {
  color: #333333;
  font-size: 32px;
  line-height: 46px;
  margin-bottom: 17px;
}
.detail-image-container {
  margin-left: -30px;
  margin-right: -30px;
}
.content-article-box {
  background-color: #f5f5f5;
  height: 128px;
}
.content-article-img {
  height: 100px;
  width: 100px;
  margin-left: 14px;
  background-size: cover;
  background-position: center;
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
}
.content-activity-box {
  background-color: #f5f5f5;
  height: 128px;
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
}
.reply-box {
  background-color: transparent;
  margin-bottom: 8px;
  transition: all 0.1s;
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
/*************************************************************/
.cube-pullup-wrapper {
  height: 50px;
  align-items: start;
}
</style>
