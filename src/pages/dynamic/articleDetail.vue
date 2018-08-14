<template>
  <div>
    <DownloadBox />
    <div class="container">
      <div v-if="dynamic" id="title-container" class="column">
        <div class="title">{{dynamic.title}}</div>
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
            <div class="follow-button" v-if="!dynamic.is_following"  @click="clickFollow(dynamic.uid)">+ 关注</div>
          </div>
        </div>
      </div>

      <div v-if="dynamic" id="content-container" class="column">
        <div v-for="(content,index) in dynamic.contents" :key="index">
          <div class="article-image-container">
            <img class="article-image" v-if="content.type==2" :src="content.imageUrl" @click="openLightBox(content.imageIndex)"/>
          </div>

          <div class="article-desc" v-if="content.type==2&&content.des">{{content.des}}</div>
          <div class="article-content" v-if="content.type==1">{{content.content}}</div>
        </div>
        <div class="row foot-info-box">
          <i class="iconfont icon-location"></i>
          <div class="location" v-if="dynamic.location">{{dynamic.location}}</div>
        </div>
      </div>

      <div v-if="dynamic" class="like-box" id="like-container">
        <div class="like-text">{{dynamic.like_num}}个人点了赞</div>
        <div class="row space-between">
          <div class="row center">
            <div class="image-avatar-box row">
              <img class="image-avatar" v-for="(image,index) in dynamic.like_list" :src="image.avatar" :key="index" @click="clickUser(image.uid)"/>
              <i class="iconfont icon-more"></i>
            </div>
          </div>
        </div>
      </div>

      <div v-if="dynamic" id="comment-container" class="column">
        <div class="comment-text">{{dynamic.comment_num}}条评论</div>
        <div v-for="(comment,index) in dynamic.comment_list" :key="'comments'+index">
          <div class="comment-box row space-between">
            <div class="column">
              <img class="user-avatar" :src="comment.avatar" @click="clickUser(comment.uid)" />
            </div>
            <div class="comment-right-box column">
              <div class="row">
                <div class="comment-username" @click="clickUser(comment.uid)">{{comment.username}}</div>
              </div>
              <div class="comment-content">{{comment.content}}</div>
              <div class="comment-time">{{comment.time}}</div>
              <div v-if="comment.replys.list.length>0" class="comment-replies-box">
                <div class="reply-box" v-for="(reply,index) in comment.replys.list" :key="index">
                  <span class="reply-from" v-if="reply.pusername">{{reply.username}}</span><span class="reply-from" v-if="!reply.pusername">{{reply.username}}:</span><span class="reply-reply" v-if="reply.pusername">回复</span><span class="reply-to" v-if="reply.pusername">{{reply.pusername}}:</span>
                  <span class="reply-content">{{reply.content}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DynamicFixedBox v-if="dynamic" :dynamic="dynamic"/>
    </div>
  </div>
</template>

<script>
import DownloadBox from '../../components/DownloadBox';
import DynamicFixedBox from '../../components/DynamicFixedBox';
export default {
  data () {
    return {
      dynamic: null
    };
  },
  components: { DownloadBox, DynamicFixedBox },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      let rData = {
        id: '506',
        showAll: false
      };
      this.$ajax('/jv/anonymous/qz/dynamicarticle', { data: rData })
        .then(res => {
          console.log(res.data.data)
          this.dynamic = res.data
        })
        .catch();
    },
    clickUser (uid) {

    },
    clickFollow (uid) {
      // 关注可点击，首次点击关注检测未登录弹出登录逻辑，已登录直接跳转关注成功页面，icon不显示，出现toast弹窗：关注成功！

    }
  }
};
</script>

<style src='../../common.css' />
<style  scoped>
.container{
  margin-left: 30px;
  margin-right: 30px;
}
#title-container{
 margin-bottom:43px
}
.title {
  margin-top: 30px;
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
.fromPrefix{
  color: #999999;
  font-size: 24px;
}
.fromQz {
  color: #1EB0FD;
  font-size: 24px;
}
.follow-button{
  width:98px;
  height:44px;
  text-align: center;
  font-size: 24px;
  line-height: 44px;
  color: #ffffff;
  background-color: #1EB0FD;
  border-radius:6px;
}
.follow-cancel-button{
  width:98px;
  height:44px;
  text-align: center;
  font-size: 24px;
  line-height: 44px;
  color: #ffffff;
  background-color: #1EB0FD;
  border-radius:6px;
}
/********************************************************************/
#content-container{
 margin-bottom:60px
}
.article-content{
  font-size:32px;
  line-height: 50px;
  color: #333333;
  margin-bottom: 21px;
  white-space: pre-wrap;
}
.article-desc{
  font-size:24px;
  line-height: 34px;
  color: #999999;
  text-align: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 36px;
}
.article-image-container{
  margin-left: -30px;
  margin-right: -30px;
}
.article-image{
  width: 100%;
  flex: 1;
  margin-bottom: 13px;
}
.foot-info-box{
  margin-top: 30px;
}
.location{
  font-size:24px;
  line-height: 28px;
  color: #999999;
  margin-right: 30px;
}
.viewNum{
  font-size:24px;
  line-height: 28px;
  color: #999999;
}
.top{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-left:42px;
  padding-right:42px;
  padding-top:56px;
  padding-bottom:56px;
}
.top-text{
  color: #ffffff;
  font-size: 32px;
  text-align:center;
}
.top-close{
  position: absolute;
  left:42px;
  top:56px;
  height: 34px;
  width: 34px;
}
.icon-location{
  font-size: 24px;
  color: #1eb0fd;
  margin-right: 10px;
}
/*************************************************************************/
#title-container{
 margin-bottom:20px
}
.image-avatar{
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.icon-more{
  font-size: 60px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.like-text{
  color: #333333;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px
}
/**************************************************************************/
#comment-container{
 margin-bottom:100px
}
.comment-text{
  font-size:28px;
  color:#333333;
  margin-bottom: 40px;
  font-weight:bold
}
.user-avatar{
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin-right: 20px;
}
.comment-box {
  margin-bottom: 40px;
}
.comment-right-box{
  flex: 1;
}
.comment-username{
  color: #225894;
  font-size: 28px;
  line-height: 28px;
  margin-bottom: 14px;
}
.comment-content{
  color: #333333;
  font-size: 30px;
  line-height: 42px;
  margin-bottom: 14px;
}
.comment-time{
  color: #999999;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 24px;
}
.comment-replies-box{
  padding-top: 18px;
  padding-bottom: 10px;
  padding-left: 24px;
  padding-right: 24px;
  background-color:#F6F6F6;
  border-radius: 4px;
}
.reply-box{
  background-color:transparent;
  margin-bottom: 8px;
}
.reply-box:active{
  background-color:#cccccc;
}
.reply-from{
  color: #255A96;
  font-size: 26px;
  line-height: 38px;
}
.reply-reply{
  color: #666666;
  font-size: 26px;
  line-height: 38px;
}
.reply-to{
  color: #255A96;
  font-size: 26px;
  line-height: 38px;
}
.reply-content{
  color: #333333;
  font-size: 26px;
  line-height: 38px;
}
</style>
