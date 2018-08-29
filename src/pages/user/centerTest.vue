<template>
  <div :style="{height: winHeight + 'px'}" class="user-center-page">
    <div ref="pageContainer" style="transition: all 300ms" :style="{transform: 'translateY(' + pageTop + 'px)'}">
      <div ref="topBanner" @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd">
        <download-box v-if="$route.params.isShareOpen" />
        <header ref="topHeader" class="top-header">
          <div class="top-header-bg" :style="{backgroundImage: 'url(' + user.cover + ')'}">
            <div class="top-header-avatar" :style="{backgroundImage: 'url(' + user.avatar_url + ')', opacity: user.avatar_url ? 1 : 0}"></div>
          </div>
          <div class="top-header-overview">
            <div class="user-name"><span style="vertical-align: middle">{{user.username}}</span><img v-if="user.is_news" class="author-sign" :src="$assetsPublicPath + '/cwebassets/image/author_icon.png'" /><img v-if="!user.is_news" class="level-sign" :src="$assetsPublicPath + '/cwebassets/image/level' + user.level + '.png'" /></div>
            <div class="user-intro" v-if="user.intro">{{user.intro}}</div>
            <div v-if="user.id" class="follow-and-fans clearfix">
              <div class="follow-box fl"><span class="follow-and-fans-text">关注</span><span class="follow-and-fans-number">{{followNumber}}</span></div>
              <div class="fans-box fl"><span class="follow-and-fans-text">粉丝</span><span class="follow-and-fans-number">{{fansNumber}}</span></div>
            </div>
            <transition v-if="!user.is_owner" appear appear-class="follow-appear">
              <div class="follow-btn-wrapper">
                <div @click="changeFollow" class="follow-btn" :style="{color: followStatusText === '关注' ? '#fff' : '#666', backgroundColor: followStatusText === '关注' ? '#1EB0FD' : '#fff', borderColor: followStatusText === '关注' ? '#1EB0FD' : '#B7B7B7'}"><i class="iconfont follow-btn-icon" :class="{'icon-add_focus': followStatusText === '关注', 'icon-focused': followStatusText === '已关注', 'icon-transform': followStatusText === '互相关注'}"></i>{{followStatusText}}</div>
              </div>
            </transition>
          </div>
        </header>
      </div>
      <div ref="innerWrapper" class="scroll-wrapper" :style="{height: winHeight + 'px'}">
        <div @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd" class="nav-scroll-list-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px'}" v-if="tabs && tabs.length > 1 && showTabbar">
          <cube-tab-bar v-model="selectedLabel" class="tab-box clearfix" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
            <cube-tab v-for="(item) in tabs" class="fl" ref="tabItem" :label="item.title" :key="item.title">
            </cube-tab>
          </cube-tab-bar>
          <div class="tab-slider">
            <div class="tab-slider-body" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
          </div>
          <div class="tab-border" :style="{transform: 'scale(1,' + $tranScale + ')'}"></div>
        </div>
        <div class="tabs-wrapper" ref="slideWrapper" :style="{height: (winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
          <cube-slide ref="slideInstance" :data="tabs" :initialIndex="selectedIdx" :autoPlay="false" :allowVertical="false" :showDots="false" :loop="false" :speed="200" :options="{listenScroll: true, probeType: 3, stopPropagation: true, click: false, preventDefault: false}" @change="changeSlide" @scroll="slideScroll">
            <cube-slide-item v-for="(item, index) in tabs" :key="item.title" :style="{height: (winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
               <div :id="'mescroll' + index" class="mescroll content-scroll-wrapper" :style="{width: winWidth + 'px', height: '100%', overflowY: 'auto', overflowX: 'hidden'}">
                <!-- <transition name="loading-scale">
                  <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                    <loading-view />
                  </div>
                </transition> -->
                <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{minHeight: (winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 0.5 + 'px', backgroundColor: '#fff'}">
                  <dynamic-item v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" :router="$router" @changeLike="(data) => changeLike(data, index)" />
                </div>
                <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">
                  <img :src="$assetsPublicPath + '/cwebassets/image/empty_dynamic.png'" class="empty-image" />
                  暂无{{index === 0 ? '动态' : '文章'}}
                </div>
              </div>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </div>
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: (winWidth / 750) * 178, right: (winWidth / 750) * 54}" :scroll="mescroll[selectedIdx]"/>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DownloadBox from '../../components/DownloadBox'
import DynamicItem from './components/DynamicItem'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import MeScrollSupportArr from '@/mixin/MeScrollSupportArr'
import mescrollOptions from '@/lib/mescrollOptions'
import {
  /* eslint-disable no-unused-vars */
  Style,
  TabBar,
  Slide
} from 'cube-ui'
Vue.use(TabBar)
Vue.use(Slide)

const initialData = {
  showBackTop: false,
  lastYear: '',
  user: {
    is_owner: true
  },
  tabs: [
    {
      title: '动态',
      data: [],
      paging: {},
      fetching: false
    }
    // {
    //   title: '文章',
    //   data: [],
    //   paging: {},
    //   fetching: false
    // }
    // 目前只显示动态
  ],
  winWidth: window.innerWidth,
  winHeight: window.innerHeight,
  tabBarHeight: parseInt((window.innerWidth / 750) * 88),
  selectedLabel: '动态',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  timer: null,
  following: false,
  showTabbar: false,
  showBanner: true,
  pageTop: 0,
  mescroll: []
}
export default {
  mixins: [MeScrollSupportArr],
  data () {
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '文章' : '动态'
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
    return _obj
  },
  components: {DownloadBox, DynamicItem, LoadingView, ScrollToTop},
  watch: {
    '$route': function (val, oldVal) {
      if (!val.query.previewImage && oldVal.query.previewImage) { // 点击大图后返回
        if (window.previewImageId) {
          this.$previewImage.hide(window.previewImageId)
          window.previewImageId = null
        }
      }
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'UserCenterTest', ['user_id', 'jump_tab'], () => {
        this.refreshData()
      })
    }
  },
  methods: {
    changeTabBar (tabTitle) { // 点击tab切换
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
      if (!this.tabs[idx].paging.pn) {
        this.initMeScroll(idx)
      }
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
        this.mescroll[tabIdx].endErr()
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
        if (res && !res.error && res.data) { // 成功获取数据
          this.lastYear = res.data.lastYear
          if (res.data.user) {
            this.user = res.data.user
            if (!res.data.user.has_articles) { // 没有文章tab
              this.tabs.splice(1, 1)
              if (_type === 2) {
                this.selectedLabel = '动态'
                this.selectedIdx = 0
                if (!this.tabs[0].paging.pn) { // 动态没拉取过数据
                  this.initMeScroll(0)
                  return false
                }
              }
            } else { // 有文章tab,显示导航
              this.showTabbar = true
            }
          }
          this.tabs[tabIdx].paging = res.data.paging
          this.tabs[tabIdx].fetching = false
          if (pn === 1) { // 第一页
            this.tabs[tabIdx].data = res.data.list
          } else { // 非第一页
            this.tabs[tabIdx].data = this.tabs[tabIdx].data.concat(res.data.list)
          }
          this.$nextTick(() => {
            this.mescroll[tabIdx].endSuccess(res.data.list.length, !res.data.paging.is_end)
            if (res.data.paging.is_end) {
              this.mescroll[tabIdx].showNoMore()
            }
          })
        } else {
          this.tabs[tabIdx].fetching = false
          this.mescroll[tabIdx].endErr()
        }
      }).catch(err => {
        this.tabs[tabIdx].fetching = false
        this.mescroll[tabIdx].endErr()
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
        const initialTab = parseInt(this.$route.query.jump_tab || 0)
        if (this.$refs['tabItem']) {
          let pos = this.$refs['tabItem'][initialTab].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2
          this.tabSlideX = slideX + 'px'
          clearInterval(this.timer)
        }
      }, 30)
    },
    refreshData () {
      if (this.mescroll) {
        for (let i = 0; i < this.mescroll.length; i++) {
          this.mescroll[i].setScrollTop(0)
          this.mescroll[i].destroy()
        }
      }
      let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
      let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '文章' : '动态'
      let _initialData = JSON.parse(JSON.stringify(initialData))
      let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
      for (let item in _obj) {
        this[item] = _obj[item]
      }
      // if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
      //   this.initMeScroll(1)
      // } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
      //   this.initMeScroll(0)
      // }
      // 目前只显示动态
      this.initMeScroll(0)
      this.initSlideBlock()
    },
    onPullingDown (idx) {
      this.fetchList(idx, 1)
    },
    onPullingUp (idx) {
      if (!(this.tabs[idx].paging && this.tabs[idx].paging.pn && !this.tabs[idx].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        this.mescroll[idx].endErr()
        return false
      }
      let pn = parseInt(this.tabs[idx].paging.pn) + 1
      this.fetchList(idx, pn)
    },
    changeLike (item, idx) {
      if (!utils.checkLogin()) {
        return false
      }
      const isLike = item.has_like
      const likeNum = parseInt(item.like_num)
      let rData = {
        id: item.id,
        like: !isLike,
        type: 0
      }
      this.tabs[0].data.forEach(i => {
        if (i.id === item.id) {
          i.has_like = !isLike
          i.like_num = likeNum + (isLike ? -1 : 1)
          i.submitting = true
        }
      })
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (!res || (res && Boolean(res.error))) { // 出错时重置点赞
          this.tabs[0].data.forEach(i => {
            if (i.id === item.id) {
              i.has_like = isLike
              i.like_num = likeNum
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
            i.has_like = isLike
            i.like_num = likeNum
            i.submitting = false
          }
        })
      })
    },
    changeFollow () {
      if (this.following || !utils.checkLogin()) { // 关注/取关接口不允许多次调用,未登录先跳登录
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
        if (res && !res.error) { // 请求成功
          this.user.is_following = !this.user.is_following
        }
      }).catch(err => {
        this.following = false
      })
    },
    initMeScroll (idx) {
      let _down = Object.assign({}, mescrollOptions.get().down, {
        auto: true,
        autoShowLoading: false,
        callback: () => this.onPullingDown(idx),
        isLock: true
      })
      let _up = Object.assign({}, mescrollOptions.get().up, {
        callback: () => this.onPullingUp(idx),
        onScroll: this.onMeScroll,
        htmlNodata: '<div style="height:0"></div>'
      })
      this.mescroll[idx] = new MeScroll('mescroll' + idx, {down: _down, up: _up})
    },
    onMeScroll (mescroll, y, isUp) {
      if (y === 0 && !isUp && this.pageTop !== 0) {
        this.pageTop = 0
      } else if (isUp && this.pageTop === 0) {
        let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
        let bannerHeight = bannerPos.height
        this.pageTop = -bannerHeight
      }
      if (y > window.innerHeight && !this.showBackTop) {
        this.showBackTop = true
      } else if (y < window.innerHeight && this.showBackTop) {
        this.showBackTop = false
      }
    },
    bannerTouchStart (e) {
      this.wrapperTouchY = e.touches[0].screenY
    },
    bannerTouchMove (e) {
      if (e.changedTouches[0].screenY < this.wrapperTouchY && this.pageTop === 0) {
        let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
        let bannerHeight = bannerPos.height
        let currentTabScrollY = this.mescroll[this.selectedIdx].getScrollTop()
        if (currentTabScrollY === 0) {
          this.mescroll[this.selectedIdx].scrollTo(1, 0)
        }
        this.pageTop = -bannerHeight
      } else if (e.changedTouches[0].screenY > this.wrapperTouchY && this.pageTop !== 0) {
        this.pageTop = 0
      }
    },
    bannerTouchEnd (e) {
      this.wrapperTouchY = 0
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
        text = '关注'
      } else if (this.user.is_following && !this.user.is_being_followed) { // 已关注该用户，但该用户未关注我
        text = '已关注'
      } else if (this.user.is_following && this.user.is_being_followed) { // 已关注该用户，且该用户关注我
        text = '互相关注'
      }
      return text
    }
  },
  mounted () {
    // if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
    //   this.initMeScroll(1)
    // } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
    //   this.initMeScroll(0)
    // }
    // 目前只显示动态
    this.initMeScroll(0)
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
.user-center-page{
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
  position: relative;
  bottom: -3px;
}
.level-sign{
  height: 26px;
  margin-left:20px;
  vertical-align: middle;
  position: relative;
  bottom: -7px;
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
  &.v-leave-to, &.v-leave-active{
    transition: all 0ms;
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
