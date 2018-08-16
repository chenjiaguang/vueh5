<template>
  <div class="dynamic-item">
    <div class="user-overview">
      <div class="user-avatar" :style="{backgroundImage: 'url(' + itemData.avatar + ')'}"></div>
      <div class="user-name clearfix">
        <span class="user-name-text fl">{{itemData.username}}</span>
        <img v-if="itemData.is_circle_manager" :src="$assetsPublicPath + '/cwebassets/image/manager.png'" class="user-tag fl" />
        <img v-if="itemData.is_circle_owner" :src="$assetsPublicPath + '/cwebassets/image/circle_owner.png'" class="user-tag fl" />
        <img v-if="itemData.is_top" :src="$assetsPublicPath + '/cwebassets/image/settop.png'" class="user-tag fl" />
      </div>
      <div class="publish-time">{{itemData.time}}</div>
    </div>
    <show-hide-content :content="(itemData.type && itemData.type.toString() === '18') ? itemData.title : (itemData.content || '')" :isLongDynamic="(itemData.type && itemData.type.toString() === '18') ? true : false" />
    <div class="dynamic-pinture" v-if="itemData.covers && itemData.covers.length > 0">
      <image-container :images="itemData.covers" :appearAnimation="false" :showDelete="false" @showPreview="showPreview" @hidePreview="hidePreview" />
    </div>
    <div v-if="itemData.location" class="publish-address">{{itemData.location}}</div>
    <div v-if="itemData.activity" class="at-activity"><i class="iconfont icon-activity activity-sign"></i>{{itemData.activity.title}}</div>
    <div v-if="itemData.newsArticle && itemData.newsArticle.name" class="with-article">
      <div class="with-article-cover" :style="{backgroundImage: 'url(' + ((itemData.newsArticle.covers && itemData.newsArticle.covers[0]) ? itemData.newsArticle.covers[0].compress : '') + ')'}"></div>
      <div class="with-article-title">{{itemData.newsArticle.name}}</div>
    </div>
    <div class="comment-and-like clearfix">
      <div @click="changeLike" class="comment-and-like-item fl" :style="{paddingLeft: 0, color: itemData.has_like ? '#FE5273' : '#333'}">
        <div class="comment-and-like-icon-box">
          <transition-group name="fade" mode="in-out">
            <i v-if="itemData.has_like" key="like" class="iconfont icon-like comment-and-like-icon"></i>
            <i v-else key="dislike" class="iconfont icon-dislike comment-and-like-icon"></i>
          </transition-group>
          <span>{{likeNumber || '赞'}}</span>
        </div>
      </div>
      <div class="comment-and-like-item fl" style="padding-right: 0;">
        <div class="comment-and-like-icon-box">
          <i class="iconfont icon-comment_icon comment-and-like-icon"></i>
          <span>{{commentNumber || '评论'}}</span>
        </div>
      </div>
    </div>
    <div class="gray-block"></div>
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
  padding: 0 4% 4px;
  overflow: visible;
  text-align: left;
  background-color: #fff;
}
.user-overview{
  padding: 30px 0 23px;
  position: relative;
  min-height: 76px;
  box-sizing: content-box;
}
.user-avatar{
  width: 76px;
  height: 76px;
  position: absolute;
  left: 0;
  top: 30px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
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
.publish-time{
  font-size: 24px;
  line-height: 34px;
  color: #999;
  padding-left: 100px;
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
.dynamic-pinture{
  padding: 4px 0 20px;
}
.with-article{
  width: 100%;
  height: 128px;
  background-color: #F5F5F5;
  position: relative;
  margin: 4px 0 20px;
}
.with-article-cover{
  width: 100px;
  height: 100px;
  position: absolute;
  left: 14px;
  top: 14px;
}
.with-article-title{
  font-size:28px;
  line-height: 36px;
  color: #333;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: absolute;
  left: 134px;
  top: 50%;
  transform: translateY(-50%);
  white-space: normal;
}
.comment-and-like{
  width: 100%;
  height:68px;
  line-height: 68px;
  text-align: center;
  position: relative;
}
.comment-and-like:before{
  content: "";
  display: block;
  width: 300%;
  height: 3px;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 0;
  position: absolute;
  left: 0;
  top: 0;
  background: #E5E5E5;
  z-index: 1;
}
.comment-and-like-item{
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  color: '#333';
  position: relative;
}
.comment-and-like-icon-box{
  height: 100%;
  overflow: visible;
  text-align: center;
  position: absolute;
  padding-left: 50px;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
.comment-and-like-icon{
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  line-height: 66px;
  color: inherit;
}
.gray-block{
  width: 110%;
  height: 10px;
  position: relative;
  left: -5%;
  background: #F5F5F5;
}
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.5, 0.5);
}
</style>

<script>
import ImageContainer from '../../../components/ImageContainer'
import ShowHideContent from './ShowHideContent'
export default {
  props: {
    itemData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  components: {ImageContainer, ShowHideContent},
  computed: {
    likeNumber () {
      let num = parseInt(this.itemData.like_num)
      return num > 999 ? '999+' : num
    },
    commentNumber () {
      let num = parseInt(this.itemData.comment_num)
      return num > 999 ? '999+' : num
    }
  },
  methods: {
    changeLike () {
      if (this.itemData.submitting) {
        return false
      }
      this.$emit('changeLike', this.itemData)
    },
    showPreview (instance) {
      this.$emit('showPreview', instance)
    },
    hidePreview () {
      this.$emit('hidePreview')
    }
  }
}
</script>
