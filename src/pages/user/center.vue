<template>
  <div :style="{height: $winHeight + 'px'}">
    <cube-scroll :data="tabs" ref="pageScroller" :scrollEvents="['scroll']" :options="options" @scroll="outerScroll" @pulling-up="onPullingUp">
      <div ref="topBanner">
        <download-box />
        <header ref="topHeader" class="top-header">
          <div class="top-header-bg" :style="{backgroundImage: 'url(' + user.cover + ')'}">
            <div class="top-header-avatar" :style="{backgroundImage: 'url(' + user.avatar_url + ')', opacity: user.avatar_url ? 1 : 0}"></div>
          </div>
          <div class="top-header-overview">
            <div class="user-name"><span style="vertical-align: middle">{{user.username}}</span><img v-if="user.is_news" class="author-sign" :src="$assetsPublicPath + '/cwebassets/image/author_icon.png'" /></div>
            <div class="user-intro">{{user.intro}}</div>
            <div v-if="user.id" class="follow-and-fans clearfix">
              <div class="follow-box fl"><span class="follow-and-fans-text">关注</span><span class="follow-and-fans-number">{{followNumber}}</span></div>
              <div class="fans-box fl"><span class="follow-and-fans-text">粉丝</span><span class="follow-and-fans-number">{{fansNumber}}</span></div>
            </div>
            <transition v-if="!user.is_owner" appear appear-class="follow-appear">
              <div class="follow-btn-wrapper">
                <div @click="changeFollow" class="follow-btn" :style="{color: followStatusText === '未关注' ? '#fff' : '#666', backgroundColor: followStatusText === '未关注' ? '#1EB0FD' : '#fff', borderColor: followStatusText === '未关注' ? '#1EB0FD' : '#B7B7B7'}"><i class="iconfont follow-btn-icon" :class="{'icon-add_focus': followStatusText === '未关注', 'icon-focused': followStatusText === '已关注', 'icon-transform': followStatusText === '互相关注'}"></i>{{followStatusText}}</div>
              </div>
            </transition>
          </div>
        </header>
      </div>
      <div v-if="tabs[0].paging && tabs[0].paging.is_end && tabs[0].data && tabs[0].data.length === 0" class="empty-box">
        <img :src="$assetsPublicPath + '/cwebassets/image/empty_dynamic.png'" class="empty-image" />
        暂无动态
      </div>
      <dynamic-item v-for="(item, idx) in tabs[0].data" :key="idx" :itemData="item" :router="$router" @changeLike="changeLike" @showPreview="showPreview" @hidePreview="hidePreview" />
      <template slot="pulldown" slot-scope="props">
        <div class="cube-pulldown-wrapper" :style="props.pullDownStyle">
          <img v-show="!props.isPullingDown" class="pull-down-icon" :style="{transform: 'translateY(' + props.bubbleY + 'px)'}" :src="$assetsPublicPath + '/cwebassets/image/refresh_icon.png'" />
          <img v-show="props.isPullingDown" class="pull-down-icon refreshing" :src="$assetsPublicPath + '/cwebassets/image/refreshing_icon.png'" />
        </div>
      </template>
      <template slot="pullup" slot-scope="props">
        <!-- 可以下拉继续加载 -->
        <div class="cube-pullup-wrapper pullup-wrapper" :style="props.pullUpStyle" v-if="tabs[0].paging && tabs[0].paging.pn && !tabs[0].paging.is_end">
          <div class="pullup-content"><img class="pull-up-icon" :src="$assetsPublicPath + '/cwebassets/image/loading_icon.png'" />正在加载...</div>
        </div>
        <!-- 加载完无数据 -->
        <div v-else-if="tabs[0].paging && tabs[0].paging.is_end && tabs[0].data && tabs[0].data.length === 0" class="pullup-wrapper" style="height: 0;"></div>
        <!-- 其他情况 -->
        <div v-else class="pullup-wrapper">
          <div class="pullup-content">再刷也没有了</div>
        </div>
      </template>
    </cube-scroll>
    <scroll-to-top v-if="$refs['pageScroller']" :visible="showBackTop" :scroll="$refs['pageScroller']"/>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DownloadBox from '../../components/DownloadBox'
import DynamicItem from './components/DynamicItem'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import {
    /* eslint-disable no-unused-vars */
    Style,
    Scroll,
    Loading,
    TabBar,
    TabPanels,
    Slide,
    Sticky
  } from 'cube-ui'
Vue.use(Scroll)
Vue.use(Loading)
Vue.use(TabBar)
Vue.use(TabPanels)
Vue.use(Slide)
Vue.use(Sticky)

const initialData = {
  lastYear: '',
  user: {
    is_owner: true
  },
  showBackTop: false,
  tabs: [
    {
      title: '动态',
      data: [],
      paging: {},
      fetching: false
    }
  ],
  selectedLabel: '动态',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  options: {
    pullDownRefresh: false,
    pullUpLoad: {
      threshold: (window.innerWidth / 750) * 100
    },
    stopPropagation: true
  },
  timer: null,
  previewInstance: null,
  following: false
}
export default {
  data() {
    let _initialData = JSON.parse(JSON.stringify(initialData))
    return _initialData
  },
  components: {DownloadBox, DynamicItem, ScrollToTop},
  watch: {
    '$route': function (val, oldVal) {
      if (!val.query.previewImage && oldVal.query.previewImage) { // 点击大图后返回
        if (this.previewInstance) {
          this.$previewImage.hide(this.previewInstance)
          this.previewInstance = null
        }
      }
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'UserCenter', ['user_id', 'jump_tab'], () => {
        this.refreshData()
      })
    }
  },
  methods: {
    showPreview (instance) {
      this.previewInstance = instance
      this.$router.push({name: this.$route.name, query: {previewImage: true}, params: {previewImage: true}})
    },
    hidePreview () {
      this.previewInstance = null
      this.$router.go(-1)
    },
    changeTabBar (tabTitle) { // 点击tab切换
      const tabSlidePos = this.$refs['tabSlide'].getBoundingClientRect()
      this.tabs.forEach((item, index) => {
        if (item.title === tabTitle) {
          this.selectedLabel = tabTitle
          this.selectedIdx = index
        }
      })
    },
    changeSlide (idx) { // 滑动slide触发tab切换
      this.selectedLabel = this.tabs[idx].title
      this.selectedIdx = idx
    },
    slideScroll ({x, y}) { // 滑动slide
      if (!this.$refs['tabItem'] || this.tabs.length <= 1) {
        return false
      }
      let slideTotalWidth = this.$refs['slideInstance'].$el.getBoundingClientRect().width * this.tabs.length
      let pre = this.selectedIdx === 0 ? null : this.$refs['tabItem'][this.selectedIdx - 1]
      let next = this.selectedIdx === (this.tabs.length - 1) ? null : this.$refs['tabItem'][this.selectedIdx + 1]
      let current = this.$refs['tabItem'][this.selectedIdx]
      let position = {pre: pre ? pre.$el.getBoundingClientRect() : null, next: next ? next.$el.getBoundingClientRect() : null, current: current.$el.getBoundingClientRect()}
      let relativeX = this.selectedIdx === 0 ? 0 : -this.$refs['slideInstance'].$el.getBoundingClientRect().width * this.selectedIdx // 基准x位置
      let relativeSlideX = position.current.left + position.current.width / 2
      let preSlideX = position.pre ? (position.pre.left + position.pre.width / 2) : null
      let nextSlideX = position.next ? (position.next.left + position.next.width / 2) : null
      let touchX = x - relativeX
      let slideX = 0
      if (this.selectedIdx === 0) {
        slideX = nextSlideX - relativeSlideX
      } else if (this.selectedIdx === this.tabs.length - 1) {
        slideX = relativeSlideX - preSlideX
      } else if (touchX > 0) {
        slideX = relativeSlideX - preSlideX
      } else if (touchX <= 0) {
        slideX = nextSlideX - relativeSlideX
      }
      let moveX = (touchX / this.$refs['slideInstance'].$el.getBoundingClientRect().width) * slideX
      this.tabSlideX = relativeSlideX - moveX + 'px'
    },
    fetchList (tabIdx, pn) {
      if (this.tabs[tabIdx].fetching) { // 正在拉取动态数据
        return false
      }
      let _type = tabIdx === 0 ? 1 : 2
      let rData = { // type  1,动态  2,文章
        id: this.$route.query.user_id,
        type: _type,
        pn: pn,
        snapshot: this.tabs[tabIdx].paging.snapshot || '',
        limit: 10,
        lastYear: ''
      }
      this.tabs[tabIdx].fetching = true
      this.$ajax('/jv/anonymous/user/social', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.lastYear = res.data.lastYear
          res.data.user && (this.user = res.data.user)
          let _tabs = [].concat(this.tabs)
          _tabs[tabIdx].paging = res.data.paging
          _tabs[tabIdx].fetching = false
          if (pn === 1) { // 第一页
            _tabs[tabIdx].data = res.data.list
          } else { // 非第一页
            _tabs[tabIdx].data = this.tabs[tabIdx].data.concat(res.data.list)
          }
          this.tabs = _tabs
        }
      }).catch(err => {
        this.tabs[tabIdx].fetching = false
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取用户数据失败')
        }
      })
    },
    initSlideBlock () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.$refs['tabItem']) {
          let pos = this.$refs['tabItem'][0].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2
          this.tabSlideX = slideX + 'px'
          clearInterval(this.timer)
        }
      },30)
    },
    refreshData () {
      let _initialData = JSON.parse(JSON.stringify(initialData))
      for (let item in _initialData) {
        this[item] = _initialData[item]
      }
      this.fetchList(0, 1)
      this.initSlideBlock()
      this.$refs['pageScroller'].scrollTo(0, 0, 10)
    },
    onPullingUp () {
      if (!(this.tabs[0].paging && this.tabs[0].paging.pn && !this.tabs[0].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        return false
      }
      let pn = parseInt(this.tabs[0].paging.pn) + 1
      this.fetchList(0, pn)
    },
    changeLike (item) {
      if (!utils.checkLogin()) {
        return false
      }
      let rData = {
        id: item.id,
        like: !item.has_like,
        type: 0
      }
      this.tabs[0].data.forEach(i => {
        if (i.id === item.id) {
          i.submitting = true
        }
      })
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error)) {
          this.tabs[0].data.forEach(i => {
            if (i.id === item.id) {
              i.has_like = !i.has_like
              i.like_num = parseInt(i.like_num) + (i.has_like ? 1 : -1)
              i.submitting = false
            }
          })
        } else {
          this.tabs[0].data.forEach(i => {
            if (i.id === item.id) {
              i.submitting = false
            }
          })
        }
      }).catch(err => {
        this.tabs[0].data.forEach(i => {
          if (i.id === item.id) {
            i.submitting = false
          }
        })
      })
    },
    outerScroll ({x, y}) {
      if (-y > this.$winHeight) { // 超过一屏显示返回顶部
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    },
    changeFollow () {
      if (this.following || !utils.checkLogin()) { // 关注/取关接口不允许多次调用,未登陆先跳登陆
        return false
      }
      let rData = {
        follow: this.user.is_following ? 0 : 1,
        following_id: this.user.id
      }
      this.following = true
      this.$ajax('/jv/user/follow', {data: rData}).then(res => {
        this.following = false
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error)) { // 请求成功
          this.user.is_following = !this.user.is_following
        }
      }).catch(err => {
        this.following = false
      })
    }
  },
  computed: {
    followNumber: function () {
      let num_text = 0
      if (parseInt(this.user.follow_num) > 9999) {
        num_text = parseFloat((parseInt(this.user.follow_num) / 10000).toFixed(1)) + 'W'
      } else {
        num_text = this.user.follow_num || 0
      }
      return num_text
    },
    fansNumber: function () {
      let num_text = 0
      if (parseInt(this.user.fans_num) > 9999) {
        num_text = parseFloat((parseInt(this.user.fans_num) / 10000).toFixed(1)) + 'W'
      } else {
        num_text = this.user.fans_num || 0
      }
      return num_text
    },
    followStatusText: function () { // status 1未关注，2已关注，3互相关注
      let text = null
      if (!this.user.is_following) { // 未关注该用户
        text = '未关注'
      } else if (this.user.is_following && !this.user.is_being_followed) { // 已关注该用户，但该用户未关注我
        text = '已关注'
      } else if (this.user.is_following && this.user.is_being_followed) { // 已关注该用户，且该用户关注我
        text = '互相关注'
      }
      return text
    }
  },
  created () {
    this.fetchList(0, 1)
    this.initSlideBlock()
  }
}
</script>

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
.outer-scroller{
  width: 100%;
}
.top-header{
  width: 100%;
  box-sizing: content-box;
  position: relative;
}
.top-header-bg{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 386px;
  background-color:#292929;
}
.top-header-avatar{
  position: absolute;
  left: 4%;
  bottom: -90px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transition: opacity 300ms;
}
.top-header-overview{
  padding: 135px 4% 55px;
}
.user-name{
  font-size: 42px;
  line-height: 52px;
  font-weight: bold;
}
.author-sign{
  height: 32px;
  margin-left:20px;
  vertical-align: middle;
}
.user-intro{
  font-size: 28px;
  line-height: 38px;
  color: #999;
  padding-top: 15px;
}
.follow-and-fans{
  font-size: 28px;
  line-height: 38px;
  padding-top: 14px;
}
.follow-and-fans-text{
  color: #666;
  margin-right: 14px;
  font-weight: normal;
}
.follow-and-fans-number{
  font-weight: bold;
}
.follow-box{
  padding-right: 28px;
  position: relative;
}
.follow-box:before{
  content: "";
  display: block;
  width: 3px;
  height: 60px;
  background: #999;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) scale(0.3333, 0.3333);
  transform-origin: 100% 50%;
}
.fans-box{
  padding-left: 28px;
}
.follow-btn-wrapper{
  width: 134px;
  height: 48px;
  line-height: 48px;
  position: relative;
  overflow: visible;
  margin: 25px 0 5px;
  transition: all 300ms;
  &.follow-appear{
    transform: scale(0, 0);
    height: 0;
  }
}
.follow-btn{
  width: 300%;
  height: 300%;
  line-height: 138px;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 0;
  position: absolute;
  left: 0;
  top: 0;
  border-style: solid;
  border-width: 3px;
  border-radius: 18px;
  box-sizing: border-box;
  font-size: 60px;
  text-align: center;
  transition: all 500ms;
}
.follow-btn-icon{
  font-size: 54px;
  color: inherit;
  margin-right: 24px;
}
.nav-scroll-list-wrap{
  position: relative;
  background-color: #fff;
}
.tab-box{
  height: 88px;
  padding: 0 4%;
  overflow: hidden;
}
.tab-slider{
  width: 100%;
  height: 6px;
  position: absolute;
  left: 0;
  bottom: 0;
}
.tab-slider-body{
  width: 40px;
  height: 100%;
  position: absolute;
  left: -20px;
  bottom: 0;
  background: #1EB0FD;
  border-radius: 4px;
}
.tab-border{
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(1, 0.5);
  transform-origin: 0 100%;
  background: #e5e5e5;
}
.cube-tab-bar{
  justify-content: flex-start;
}
.cube-tab{
  flex: 0;
  margin-left: 60px;
  font-size: 36px;
  color: #666;
  white-space: nowrap;
}
.cube-tab:first-child{
  margin-left: 0;
}
.cube-tab_active{
  color: #333;
  font-weight: bold;
}
.bottom-footer{
  width: 100%;
  height: 100px;
}
.imgs-item{
  line-height: 40px;
}
.pull-down-icon{
  display: block;
  width: 44px;
  height: 44px;
  margin-top: -44px;
  margin-bottom: 25px;
}
.pull-down-icon.refreshing{
  display: block;
  width: 44px;
  height: 44px;
  margin-top: 25px;
  margin-bottom: 25px;
  animation: refreshing 500ms infinite linear;
}
.pull-up-icon{
  display: block;
  width: 32px;
  height: 32px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -18px;
  animation: loading 1000ms infinite cubic-bezier(0.5,0.5,0.5,0.5);
}
.pullup-wrapper{
  font-size: 24px;
  color: #666;
  height: 100px;
  position: relative;
}
.pullup-content{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding-left: 42px;
}
@keyframes refreshing {
  0%{
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
  }
}
@keyframes loading {
  0%{
    transform: rotate(0deg)
  }
  8.33%{
    transform: rotate(30deg)
  }
  16.66%{
    transform: rotate(60)
  }
  25%{
    transform: rotate(90deg)
  }
  33.33%{
    transform: rotate(120deg)
  }
  41.66%{
    transform: rotate(150deg)
  }
  50%{
    transform: rotate(180deg)
  }
  58.33%{
    transform: rotate(210deg)
  }
  66.66%{
    transform: rotate(240deg)
  }
  75%{
    transform: rotate(270deg)
  }
  83.32%{
    transform: rotate(300deg)
  }
  91.66%{
    transform: rotate(330deg)
  }
  100%{
    transform: rotate(360deg)
  }
}
.gray-block{
  position: relative;
  left: -5%;
  width: 110%;
  height: 10px;
  background: #F5F5F5;
}
.backtop-icon{
  display: block;
  width: 88px;
  height: 88px;
  background-color: #717171;
  color: #fff;
  font-size:46px;
  line-height: 88px;
  text-align: center;
  border-radius: 8px;
  position: fixed;
  right: 54px;
  bottom: 282px;
  z-index: 2;
}
.backtop-fade-enter-active, .backtop-fade-leave-active {
  transition: all .5s;
}
.backtop-fade-enter, .backtop-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.publish-icon{
  display: block;
  width: 88px;
  height: 88px;
  background-color: #1EB0FD;
  color: #fff;
  font-size:46px;
  line-height: 88px;
  line-height: 88px;
  text-align: center;
  border-radius: 8px;
  position: fixed;
  right: 54px;
  bottom: 184px;
  z-index: 2;
}
.empty-box{
  padding: 140px 0;
  font-size: 28px;
  color: #999;
  line-height: 68px;
  text-align: center;
}
.empty-image{
  display: block;
  width: 240px;
  height: 240px;
  margin: 0 auto;
}
</style>