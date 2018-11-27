<template>
  <div class="dynamic-item" @click.stop="goDynamic">
    <div class="user-overview">
      <div class="user-avatar-wrapper">
        <div class="user-avatar" @click.stop="goUser" :style="{backgroundImage: 'url(' + itemData.avatar + ')'}"></div>
        <img v-if="itemData.is_vip_user" class="vip-icon" :src="$assetsPublicPath + '/cwebassets/image/vip.png'" />
      </div>
      <div class="user-name clearfix">
        <span @click.stop="goUser" class="user-name-text fl">{{itemData.username}}</span>
        <!-- <img v-if="itemData.is_manager" :src="$assetsPublicPath + '/cwebassets/image/manager.png'" class="user-tag fl" />
        <img v-if="itemData.is_owner" :src="$assetsPublicPath + '/cwebassets/image/circle_owner.png'" class="user-tag fl" />
        <img v-if="itemData.is_settop" :src="$assetsPublicPath + '/cwebassets/image/settop.png'" class="user-tag fl" /> -->
      </div>
      <div class="publish-time-and-circle">{{itemData.time}}<i class="iconfont icon-dian"></i><i class="iconfont" :class="dysignClass"></i><span class="from-circle" v-if="itemData.circle_name">发布于<span class="from-circle-text">{{itemData.circle_name}}</span></span></div>
    </div>
    <show-hide-content :content="(itemData.type && itemData.type.toString() === '18') ? itemData.title : (itemData.content || '')" :isLongDynamic="(itemData.type && itemData.type.toString() === '18') ? true : false" />
    <div v-if="itemData.topicInfo && itemData.topicInfo.length > 0" class="topic-box clearfix">
      <div v-for="(item, idx) in itemData.topicInfo" :key="idx" @click.stop="goTopic(idx)" class="topic-item fl"><i class="iconfont icon-topic_v_2_5 relative-topic-icon"></i>{{item.title}}</div>
    </div>
    <div class="dynamic-picture" v-if="itemData.covers && itemData.covers.length > 0">
      <image-container :images="itemData.covers" :router="router" :appearAnimation="false" :showDelete="false" />
    </div>
    <a @click.stop :href="itemData.newsArticle.article_url" v-if="itemData.newsArticle && itemData.newsArticle.id" class="with-article">
      <div class="with-article-cover" v-if="itemData.newsArticle.covers && itemData.newsArticle.covers[0]" :style="{backgroundImage: 'url(' + (itemData.newsArticle.covers[0].compress || itemData.newsArticle.covers[0].url) + ')'}"></div>
      <div class="with-article-cover" v-else>
        <i class="iconfont link-image icon-link_icon"></i>
      </div>
      <div class="with-article-title">
        <div class="with-article-title-text">{{itemData.newsArticle.name || itemData.newsArticle.article_url}}</div>
      </div>
    </a>
    <a @click.stop :href="itemData.linkInfo.url" v-if="itemData.linkInfo && itemData.linkInfo.id && itemData.linkInfo.type==0" class="with-article">
      <div class="with-article-cover" v-if="itemData.linkInfo.cover" :style="{backgroundImage: 'url(' + itemData.linkInfo.cover + ')'}"></div>
      <div class="with-article-cover" v-else>
        <i class="iconfont link-image icon-link_icon"></i>
      </div>
      <div class="with-article-title">
        <div class="with-article-title-text">{{itemData.linkInfo.title || itemData.linkInfo.url}}</div>
      </div>
    </a>
    <DynamicContentVideoBox class="with-video" v-if="itemData.linkInfo && itemData.linkInfo.id && itemData.linkInfo.type==1" :dynamic="itemData" :from="1" :currentTime="itemData.videoPoint || 0"/>
    <div v-if="itemData.location" class="publish-address">{{itemData.location}}</div>
    <!-- <div v-if="itemData.activity" class="at-activity"><i class="iconfont icon-activity activity-sign"></i>{{itemData.activity.title}}</div> -->
    <!-- 活动模块 -->
    <div class="content-activity-box row center" v-if="itemData.activity && itemData.activity.id" @click.stop="goActivity(itemData.activity.id)">
      <div class="content-activity-img" :style="`background-image:url(${itemData.activity.covers?itemData.activity.covers[0].compress:''})`"/>
      <div class="content-activity-right column space-between">
        <div class="content-activity-title">{{itemData.activity.title}}</div>
        <div class="content-activity-address">{{itemData.activity.address || '线上活动'}}</div>
        <div class="content-activity-time_text">{{itemData.activity.time_text}}</div>
      </div>
    </div>
    <div class="comment-and-like clearfix">
      <div @click.stop="changeLike" class="comment-and-like-item">
        <div class="comment-and-like-icon-box">
          <transition-group name="fade" mode="in-out">
            <i v-if="itemData.has_like" key="like" class="iconfont icon-like_v_2_5 comment-and-like-icon"></i>
            <i v-else key="dislike" class="iconfont icon-dislike_v_2_5 comment-and-like-icon"></i>
          </transition-group>
          <!-- <transition
            enter-active-class="animated wobble"
            leave-active-class="hide"
          >
            <i v-if="itemData.has_like" class='iconfont icon-like comment-and-like-icon'></i>
          </transition>
          <i v-if="!itemData.has_like" class='iconfont icon-dislike comment-and-like-icon'></i> -->
          <span>{{likeNumber || ''}}</span>
        </div>
      </div>
      <div @click.stop="goDynamic" class="comment-and-like-item">
        <div class="comment-and-like-icon-box comment-box">
          <i class="iconfont icon-comment_icon comment-and-like-icon"></i>
          <span>{{commentNumber || ''}}</span>
        </div>
      </div>
      <div class="comment-and-like-border" :style="{transform: 'scale(1,' + $tranScale + ')'}"></div>
    </div>
    <div class="gray-block" v-if="!hideBlock"></div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.clearfix:after{
  content: "";
  display: block;
  width: 100%;
  height: 0;
  visibility: hidden;
  clear: both;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.dynamic-item{
  width: 100%;
  padding: 0 4%;
  overflow: visible;
  text-align: left;
}
.user-overview{
  padding: 30px 0 23px;
  position: relative;
  min-height: 76px;
  box-sizing: content-box;
}
.user-avatar-wrapper{
  width: 76px;
  height: 76px;
  position: absolute;
  left: 0;
  top: 30px;
}
.user-avatar{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  z-index: 1;
}
.vip-icon{
  display: block;
  width: 34.2%;
  height: 34.2%;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.user-name{
  padding-left: 100px;
}
.user-name-text{
  padding-top: 4px;
  font-size: 28px;
  line-height: 38px;
  color: #333;
  font-weight: bold;
}
.publish-time-and-circle{
  font-size: 24px;
  line-height: 34px;
  color: #999;
  padding-left: 100px;
  text-align: left;
}
.from-circle{
  margin-left: 20px;
}
.from-circle-text{
  color: #1EB0FD;
}
.topic-box{
  overflow: hidden;
  padding: 0 0 14px 0;
}
.topic-item{
  height: 48px;
  line-height: 48px;
  background-color: #F0F0F0;
  padding: 0 20px;
  border-radius :5px;
  margin: 0 14px 10px 0;
}
.relative-topic-icon{
  font-size: 24px;
  color: #FF611A;
  margin-right: 10px;
}
.user-tag{
  display: block;
  height: 28px;
  margin-left:10px;
  position: relative;
  top: 7px;
}
.at-activity, .publish-address{
  font-size: 24px;
  line-height: 32px;
  color: #999;
  padding-bottom:20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-sign{
  font-size: 24px;
  color: #1EB0FD;
  margin-right: 10px;
}
.dynamic-picture{
  padding: 4px 0 20px;
}
.with-article{
  display: block;
  width: 100%;
  height: 128px;
  background-color: #F5F5F5;
  position: relative;
  margin: 4px 0 20px;
}
.with-video{
  margin: 4px 0 20px;
}
.with-article-cover{
  width: 100px;
  height: 100px;
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #D8D8D8;
  left: 14px;
  top: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.link-image{
  font-size: 38px;
  color: #4B4B4B;
}
.with-article-title{
  margin-left: 134px;
  margin-right: 20px;
  overflow: hidden;
  box-sizing: content-box;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.with-article-title-text{
  width: 100%;
  font-size:28px;
  line-height: 36px;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  white-space: normal;
  word-break: break-all;
}
.comment-and-like{
  width: 100%;
  height:80px;
  line-height: 80px;
  text-align: center;
  position: relative;
  display: flex;
}
.comment-and-like-item{
  height: 100%;
  box-sizing: border-box;
  color: '#333';
  position: relative;
  background-color:#fff;
}
.comment-and-like-icon-box{
  height: 100%;
  margin-right: 60px;
  overflow: hidden;
  text-align: center;
  position: relative;
  padding-left: 56px;
}
.comment-box{
  padding-left: 58px;
}
.comment-box .comment-and-like-icon{
  left: 2px;
}
.comment-and-like-icon{
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 36px;
  color: inherit;
}
.icon-like_v_2_5{
  color: #FF6574;
}
.gray-block{
  width: 110%;
  height: 16px;
  position: relative;
  left: -5%;
  background: #F2F2F2;
}
.fade-enter-active, .fade-leave-active {
  transition: all 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5);
}

// 活动模块------------------------
.content-activity-box {
  background-color: #f5f5f5;
  height: 128px;
  margin: 4px 0 20px;
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
// 活动模块 end ------------------------

.icon-dian, .icon-dysign1, .icon-dysign2, .icon-dysign3, .icon-dysign4{
  font-size: 24px;
  color: #999;
}
.icon-dian{
  margin: 0 -2px;
}
</style>

<script>
import ImageContainer from '../../../components/ImageContainer'
import ShowHideContent from './ShowHideContent'
import utils from '@/lib/utils'
import DynamicContentVideoBox from '@/components/DynamicContentVideoBox'
export default {
  props: {
    itemData: {
      type: Object,
      required: true
    },
    hideBlock: {
      required: false
    },
    router: {
      required: false
    }
  },
  data () {
    return {}
  },
  components: {
    ImageContainer,
    ShowHideContent,
    DynamicContentVideoBox
  },
  computed: {
    likeNumber () {
      let num = parseInt(this.itemData.like_num)
      return num > 999 ? '999+' : num
    },
    commentNumber () {
      let num = parseInt(this.itemData.comment_num)
      return num > 999 ? '999+' : num
    },
    dysignClass () {
      let _class = ''
      if (this.itemData) {
        if (this.itemData.range.toString() === '1') {
          _class = 'icon-dysign3'
        } else if (this.itemData.range.toString() === '2') {
          _class = 'icon-dysign2'
        } else if ((this.itemData.range.toString() === '0' && this.itemData.show_allways.toString() === '1') || this.itemData.range.toString() === '3') {
          _class = 'icon-dysign1'
        } else {
          _class = 'icon-dysign4'
        }
      }
      return _class || ''
    }
  },
  methods: {
    changeLike () {
      if (this.itemData.submitting) {
        return false
      }
      this.$emit('changeLike', this.itemData)
    },
    addComment () {
      if (utils.checkLogin(true)) {
        this.router.push({name: 'DynamicSendComment', query: {dy_id: this.itemData.id}, params: {dynamic: this.itemData}})
      }
    },
    goDynamic () {
      this.router.push({ name: 'DynamicDetail', query: { id: this.itemData.id, isArticle: this.itemData.type.toString() === '18' } })
    },
    goUser () {
      this.router.push({ name: 'UserCenter', query: { user_id: this.itemData.uid }, params: {resetData: true} })
    },
    goCircle () {
      this.router.push({ name: 'CircleDetail', query: { circle_id: this.itemData.circle_id }, params: {resetData: true} })
    },
    goTopic (idx) {
      this.router.push({ name: 'TopicDetail', query: { topic_id: this.itemData.topicInfo[idx].id }, params: {resetData: true} })
    },
    goActivity (id) {
      this.$router.push({name: 'ActivityDetail', query: {id: id}})
    }
  }
}
</script>
