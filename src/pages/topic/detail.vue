<template>
  <div :style="{height: winHeight + 'px'}">
    <cube-scroll class="toutiao" ref="pageScroller" :scrollEvents="['scroll']" :options="{bounce: false}">
      <div class="banner" ref="topBanner">
        <download-box />
        <header ref="topHeader" class="top-header">
          <div class="top-header-bg" :style="{backgroundImage: 'linear-gradient(60deg,#' + topicInfo.beginColor + ',#' + topicInfo.endColor + ')'}"></div>
          <div class="top-header-content-wrapper">
            <div class="top-header-content">
              <div class="top-header-title" v-if="topicInfo.title"><i class="iconfont icon-topic top-header-icon"></i><span class="top-header-title-text">{{topicInfo.title}}</span></div>
              <div class="top-header-intro">{{topicInfo.content}}</div>
            </div>
          </div>
        </header>
      </div>
      <div ref="innerWrapper" class="scroll-wrapper" :style="{height: winHeight + 'px'}">
        <div class="nav-scroll-list-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px'}" v-if="tabs && tabs.length > 1">
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
          <cube-slide ref="slideInstance" :data="tabs" :initialIndex="selectedIdx" :autoPlay="false" :showDots="false" :allow-vertical="false" :loop="false" :speed="500" :options="{listenScroll: true, probeType: 3, click: false}" @change="changeSlide" @scroll="slideScroll">
            <cube-slide-item v-for="(item, index) in tabs" :key="item.title" :style="{height: (winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
              <cube-scroll
                ref="contentScroll"
                :data="tabs[index].data"
                :scrollEvents="['scroll']"
                :options="options"
                @scroll="innerScroll"
                @pulling-down="onPullingDown(index)"
                @pulling-up="onPullingUp(index)">
                <transition name="loading-scale">
                  <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                    <loading-view />
                  </div>
                </transition>
                <div v-if="tabs[index].paging && tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该话题暂无{{index === 0 ? '最新动态' : '最热动态'}}</div>
                <topic-item v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :router="$router" @changeLike="(data) => changeLike(data, index)" />
                <template slot="pulldown" slot-scope="props">
                  <div class="cube-pulldown-wrapper" :style="props.pullDownStyle">
                    <img v-show="!props.isPullingDown" class="pull-down-icon" :style="{transform: 'translateY(' + props.bubbleY + 'px)'}" :src="$assetsPublicPath + '/cwebassets/image/refresh_icon.png'" />
                    <img v-show="props.isPullingDown" class="pull-down-icon refreshing" :src="$assetsPublicPath + '/cwebassets/image/refreshing_icon.png'" />
                  </div>
                </template>
                <template slot="pullup" slot-scope="props">
                  <!-- 可以下拉继续加载 -->
                  <div class="cube-pullup-wrapper pullup-wrapper" :style="props.pullUpStyle" v-if="tabs[index].paging && tabs[index].paging.pn && !tabs[index].paging.is_end">
                    <div class="pullup-content"><img class="pull-up-icon" :src="$assetsPublicPath + '/cwebassets/image/loading_icon.png'" />正在加载...</div>
                  </div>
                  <!-- 加载完无数据 -->
                  <div v-else-if="tabs[index].paging && tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="pullup-wrapper" style="height: 0;"></div>
                  <!-- 其他情况 -->
                  <div v-else class="pullup-wrapper">
                    <div class="pullup-content">再刷也没有了</div>
                  </div>
                </template>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-scroll>
    <scroll-to-top v-if="$refs['contentScroll']" :visible="showBackTop" :position="{bottom: (winWidth / 750) * 278, right: (winWidth / 750) * 54}" :scroll="$refs['contentScroll'][selectedIdx]"/>
    <div class="discuss-box" @click="goPublish">
      <i class="iconfont icon-discuss discuss-icon"></i><span>参与讨论</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import TopicItem from './components/TopicItem'
import DownloadBox from '../../components/DownloadBox'
import LoadingView from '@/components/LoadingView'
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
  topicInfo: {
    beginColor: 'B0B0B0',
    endColor: 'F9F9F9'
  },
  showBackTop: false,
  tabs: [
    {
      title: '最新',
      data: [],
      paging: {},
      fetching: false
    },
    {
      title: '最热',
      data: [],
      paging: {},
      fetching: false
    }
  ],
  winWidth: window.innerWidth,
  winHeight: window.innerHeight,
  tabBarHeight: parseInt((window.innerWidth / 750) * 96),
  selectedLabel: '最新',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  options: {
    pullDownRefresh: {
      threshold: (window.innerWidth / 750) * 89,
      stopTime: 0
    },
    pullUpLoad: {
      threshold: (window.innerWidth / 750) * 100
    },
    probeType: 3,
    stopPropagation: true
  }
}
export default {
  data() {
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '最热' : '最新'
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
    return _obj
  },
  components: {TopicItem, DownloadBox, LoadingView, ScrollToTop},
  watch: {
    '$route': function (val, oldVal) {
      if (!val.query.previewImage && oldVal.query.previewImage) { // 点击大图后返回
        if (window.previewImageId) {
          this.$previewImage.hide(window.previewImageId)
          window.previewImageId = null
        }
      }
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'TopicDetail', ['topic_id', 'jump_tab'], () => {
        this.refreshData()
      })
    }
  },
  methods: {
    changeTabBar (tabTitle) { // 点击tab切换
      let wrapperWidth = this.$refs['navWrapper'] ? this.$refs['navWrapper'].offsetWidth : window.innerWidth
      this.tabs.forEach((item, index) => {
        if (item.title === tabTitle) {
          this.selectedLabel = tabTitle
          this.selectedIdx = index
          if (!this.tabs[index].paging.pn) {
            this.fetchTopic(index, 1)
          }
        }
      })
    },
    changeSlide (idx) { // 滑动slide触发tab切换
      this.selectedLabel = this.tabs[idx].title
      this.selectedIdx = idx
      if (!this.tabs[idx].paging.pn) {
        this.fetchTopic(idx, 1)
      }
    },
    slideScroll ({x, y}) { // 华东slide
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
          this.$refs['pageScroller'].disable()
          clearInterval(this.timer)
        }
      },30)
    },
    refreshData () {
      let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
      let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '最热' : '最新'
      let _initialData = JSON.parse(JSON.stringify(initialData))
      let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
      for (let item in _obj) {
        this[item] = _obj[item]
      }
      this.fetchTopic(this.selectedIdx, 1)
      this.initSlideBlock()
      for (let i = 0; i < this.tabs.length; i++) {
        this.$refs['contentScroll'][i].scrollTo(0, 0, 10)
      }
    },
    fetchTopic (idx, pn) {
      console.log('11this.$route.query.topic_id', this.$route.query.topic_id)
      if (this.tabs[idx].fetching) { // 正在拉取动态数据
        return false
      }
      let rData = { // type区分最新和最热，0最新，1最热
        pn: pn,
        limit: 20,
        topicId: this.$route.query.topic_id,
        snapshot: this.tabs[idx].paging.snapshot || '',
        type: idx
      }
      this.tabs[idx].fetching = true
      this.$ajax('/jv/anonymous/qz/topic/find', {data: rData}).then(res => { // 获取动态列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.tabs[idx].fetching = false
          this.tabs[idx].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            let {id, title, state, content, beginColor, endColor} = res.data
            this.topicInfo = {id, title, state, content, beginColor, endColor}
            this.tabs[idx].data = res.data.list
          } else {
            this.tabs[idx].data = this.tabs[idx].data.concat(res.data.list)
          }
        } else {
          this.tabs[idx].fetching = false
        }
      }).catch(err => {
        this.tabs[idx].fetching = false
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取话题失败')
        }
      })
    },
    onPullingDown (idx) {
      this.fetchTopic(idx, 1)
    },
    onPullingUp (idx) {
      if (!(this.tabs[idx].paging && this.tabs[idx].paging.pn && !this.tabs[idx].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        return false
      }
      let pn = parseInt(this.tabs[idx].paging.pn) + 1
      this.fetchTopic(idx, pn)
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
      this.tabs[idx].data.forEach(i => {
        if (i.id === item.id) {
          i.has_like = !isLike
          i.like_num = likeNum + (isLike ? -1 : 1)
          i.submitting = true
        }
      })
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (!res || (res && Boolean(res.error))) { // 出错时重置点赞
          this.tabs[idx].data.forEach(i => {
            if (i.id === item.id) {
              i.has_like = isLike
              i.like_num = likeNum
              i.submitting = false
            }
          })
        } else {
          this.tabs[idx].data.forEach(i => {
            if (i.id === item.id) {
              i.submitting = false
            }
          })
        }
      }).catch(err => {
        this.tabs[idx].data.forEach(i => {
          if (i.id === item.id) {
            i.has_like = isLike
            i.like_num = likeNum
            i.submitting = false
          }
        })
      })
    },
    innerScroll ({x, y}) {
      let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
      // let outerWrapperPos = this.$refs['pageScroller'].scrollTo(0, -innerWrapperPos.top, 500)
      if (-y > window.innerHeight) { // 超过一屏显示返回顶部
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
      if (-y > window.innerHeight / 200) { // 超过半屏隐藏顶部banner
        this.$refs['pageScroller'].scrollTo(0, -bannerPos.height, 500)
      } else {
        this.$refs['pageScroller'].scrollTo(0, 0, 500)
      }
    },
    goPublish () {
      if (utils.checkLogin()) {
        this.$router.push({name: 'EditDynamic', params: {topic: [{id: this.topicInfo.id, title: this.topicInfo.title}]}})
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    utils.beforeRouteEnterHandleShareOpen(to, from, next, 2)
  },
  created () {
    this.fetchTopic(this.selectedIdx, 1)
    this.initSlideBlock()
  }
}
</script>

<style scoped>
.clearfix:after{
  content: "";
  display: block;
  width: 100%;
  height: 0;
  visibility: hidden;
  clear: both;
}
fl{
  float: left;
}
.toutiao{
  width: 100%;
  height: 100%;
}
.top-header{
  width: 100%;
  position: relative;
  overflow: hidden;
}
.top-header-bg{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.top-header-content-wrapper{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 264px;
}
.top-header-content{
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 4%;
  box-sizing: border-box;
}
.top-header-title{
  font-size: 46px;
  line-height: 56px;
  color: #fff;
  white-space: normal;
}
.top-header-title-text{
  vertical-align: middle;
}
.top-header-intro{
  font-size: 24px;
  color: #fff;
  line-height: 32px;
  padding-top: 18px;
  overflow : hidden;
  white-space: normal;
}
.top-header-icon{
  font-size: 46px;
  vertical-align: middle;
  margin-right: 10px;
  position: relative;
  top: -2px;
}
.scroll-wrapper{
  position: relative;
  background: #F5F5F5;
}
.nav-scroll-list-wrap{
  position: relative;
  background-color: #fff;
}
.tab-box{
  display: block;
  height: 96px;
  line-height: 96px;
  padding: 0 4%;
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
  background: #FF611A;
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
  flex-grow: 0;
  margin-left: 45px;
  font-size: 36px;
  color: #666;
  white-space: nowrap;
  padding: 0;
}
.cube-tab:first-child{
  margin-left: 0;
}
.cube-tab_active{
  color: #333;
  font-weight: bold;
}
div.cube-tab_active div{
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
  background-color: #fff;
  box-sizing: content-box;
  padding-bottom: 98px;
}
.pullup-content{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: -49px;
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
.publish-icon{
  display: block;
  width: 88px;
  height: 88px;
  background-color: #FF5126;
  background-image: linear-gradient(155deg, #FAB03C, #FF273B);
  color: #fff;
  font-size:46px;
  line-height: 88px;
  text-align: center;
  border-radius: 8px;
  position: fixed;
  right: 54px;
  bottom: 178px;
  z-index: 2;
}
.first-loading-box{
  height: 152px;
  margin-top: 0;
}
.loading-scale-leave-to{
  transform: scale(0.5, 0.5);
  height: 0;
}
.loading-scale-leave-active{
  transition: all 500ms;
}
.empty-box{
  font-size: 28px;
  color: #999;
  line-height: 48px;
  padding: 50px 0;
  text-align: center;
}
.discuss-box{
  width: 100%;
  height: 98px;
  line-height: 98px;
  font-size: 30px;
  color: #666;
  text-align: center;
  background: #FAFAFA;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 3;
}
.discuss-box:before{
  content: "";
  display: block;
  width: 300%;
  height: 3px;
  position: absolute;
  left: 0;
  top: 0;
  background: #CBCBCB;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 0;
}
.discuss-icon{
  font-size: 36px;
  color: #FF611A;
  margin-right: 20px;
}
</style>