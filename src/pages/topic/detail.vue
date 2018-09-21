<template>
  <div :style="{height: $winHeight + 'px'}" class="topic-page">
    <div ref="pageContainer" style="transition: all 300ms" :style="{transform: 'translateY(' + pageTop + 'px)'}">
      <div ref="topBanner" @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd">
        <download-box v-if="$route.query.isShareOpen && !$isApp" />
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
      <div ref="innerWrapper" class="scroll-wrapper" :style="{height: $winHeight + 'px'}">
        <div @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd" class="nav-scroll-list-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px'}" v-if="tabs && tabs.length > 1">
          <cube-tab-bar v-model="selectedLabel" class="tab-box clearfix" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
            <cube-tab v-for="(item) in tabs" class="fl" ref="tabItem" :label="item.title" :key="item.title">
            </cube-tab>
          </cube-tab-bar>
          <div class="tab-slider">
            <div class="tab-slider-body" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
          </div>
          <div class="tab-border" :style="{transform: 'scale(1,' + $tranScale + ')'}"></div>
        </div>
        <div class="tabs-wrapper" :style="{height: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
          <swiper class="swiper-wrapper swiper-no-swiping" ref="swiper" :style="{width: '100%', height: '100%'}" :options="swiperOption">
              <swiper-slide v-for="(item, index) in tabs" :key="item.title" :style="{width: '100%', height: '100%'}">
                <div :id="'mescroll' + index" class="mescroll content-scroll-wrapper" :style="{width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden'}">
                  <transition name="loading-scale">
                    <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                      <loading-view />
                    </div>
                  </transition>
                  <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 1 + 'px', backgroundColor: '#fff'}">
                    <topic-item v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :router="$router" :hideBlock="idx === tabs[index].data.length - 1" @changeLike="(data) => changeLike(data, index)" />
                  </div>
                  <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 1 + 'px'}">该话题暂无{{index === 0 ? '最新动态' : '最热动态'}}</div>
                </div>
              </swiper-slide>
          </swiper>
        </div>
        <!-- <div class="tabs-wrapper" ref="slideWrapper" :style="{height: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
          <cube-slide ref="slideInstance" :data="tabs" :initialIndex="selectedIdx" :autoPlay="false" :allowVertical="false" :showDots="false" :loop="false" :speed="200" :options="{listenScroll: true, probeType: 3, stopPropagation: true, click: false, preventDefault: false}" @change="changeSlide" @scroll="slideScroll">
            <cube-slide-item v-for="(item, index) in tabs" :key="item.title" :style="{height: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
               <div :id="'mescroll' + index" class="mescroll content-scroll-wrapper" :style="{width: $winWidth + 'px', height: '100%', overflowY: 'auto', overflowX: 'hidden'}">
                <transition name="loading-scale">
                  <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                    <loading-view />
                  </div>
                </transition>
                <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 0.5 + 'px', backgroundColor: '#fff'}">
                  <topic-item v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :router="$router" :hideBlock="idx === tabs[index].data.length - 1" @changeLike="(data) => changeLike(data, index)" />
                </div>
                <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该话题暂无{{index === 0 ? '最新动态' : '最热动态'}}</div>
              </div>
            </cube-slide-item>
          </cube-slide>
        </div> -->
      </div>
    </div>
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: ($winWidth / 750) * 278, right: ($winWidth / 750) * 54}" :scroll="mescroll[selectedIdx]"/>
    <div class="discuss-box" @click.stop="goPublish">
      <i class="iconfont icon-discuss discuss-icon"></i><span>参与讨论</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Vue from 'vue'
import TopicItem from './components/TopicItem'
import DownloadBox from '../../components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import MeScrollSupportArr from '@/mixin/MeScrollSupportArr'
import mescrollOptions from '@/lib/mescrollOptions'
import WeixinShareInKeepAlive from '../../mixin/WeixinShareInKeepAlive'
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
  topicInfo: {
    beginColor: 'B0B0B0',
    endColor: 'F9F9F9'
  },
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
  swiperOption: {},
  tabBarHeight: parseInt((window.innerWidth / 750) * 96),
  selectedLabel: '最新',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  showBanner: true,
  pageTop: 0,
  mescroll: []
}
export default {
  mixins: [MeScrollSupportArr, WeixinShareInKeepAlive],
  data () {
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '最热' : '最新'
    let _this = this
    let swiperOption = {
      initialSlide: selectedIdx,
      setWrapperSize: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
      on: {
        slideChangeTransitionStart: function () {
          let pos = _this.$refs['tabItem'][this.activeIndex].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2
          _this.selectedLabel = _this.tabs[this.activeIndex].title
          _this.tabSlideX = slideX + 'px'
          _this.$refs['swiper'].swiper.slideTo(this.activeIndex, 300)
        }
      }
    }
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel, swiperOption})
    return _obj
  },
  components: {TopicItem, DownloadBox, LoadingView, ScrollToTop, swiper, swiperSlide},
  watch: {
    '$route': function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'TopicDetail', ['topic_id', 'jump_tab'], () => {
        this.refreshData()
      },
      () => {
        this.runShareBindfunction()
      })
    },
    'topicInfo.title': function (val, oldVal) {
      document.title = val || '范团话题'
    }
  },
  methods: {
    changeTabBar (tabTitle) { // 点击tab切换
      this.tabs.forEach((item, index) => {
        if (item.title === tabTitle) {
          this.selectedLabel = tabTitle
          this.selectedIdx = index
          let pos = this.$refs['tabItem'][index].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2
          this.tabSlideX = slideX + 'px'
          this.$refs['swiper'].swiper.slideTo(index, 300)
          if (!this.tabs[index].paging.pn) {
            this.initMeScroll(index)
          }
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
      let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '最热' : '最新'
      let _this = this
      let swiperOption = {
        initialSlide: selectedIdx,
        setWrapperSize: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        on: {
          slideChangeTransitionStart: function () {
            let pos = _this.$refs['tabItem'][this.activeIndex].$el.getBoundingClientRect()
            let slideX = pos.left + pos.width / 2
            _this.selectedLabel = _this.tabs[this.activeIndex].title
            _this.tabSlideX = slideX + 'px'
            _this.$refs['swiper'].swiper.slideTo(this.activeIndex, 300)
          }
        }
      }
      let _initialData = JSON.parse(JSON.stringify(initialData))
      let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel, swiperOption})
      for (let item in _obj) {
        this[item] = _obj[item]
      }
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
        this.initMeScroll(1)
      } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
        this.initMeScroll(0)
      }
      this.initSlideBlock()
    },
    fetchTopic (idx, pn) {
      if (this.tabs[idx].fetching) { // 正在拉取动态数据
        this.mescroll[idx].endErr()
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
        if (res && !res.error && res.data) { // 成功获取数据
          if (this.$isApp) {
            let {id, title, content, beginColor, endColor} = res.data
            this.$appCall('h5GoTopicDetail', id, title, content, beginColor, endColor)
          }
          this.tabs[idx].fetching = false
          this.tabs[idx].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            let {id, title, state, content, beginColor, endColor} = res.data
            this.topicInfo = {id, title, state, content, beginColor, endColor}
            this.tabs[idx].data = res.data.list
            this.$nextTick(() => {
              this.mescroll[idx].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[idx].showNoMore()
              }
            })

            this.setShareData({
              type: '2',
              title: res.data.shareInfo.shareTitle,
              desc: res.data.shareInfo.shareContent,
              url: res.data.shareInfo.shareUrl,
              imgUrl: res.data.shareInfo.shareImage
            })
          } else {
            this.tabs[idx].data = this.tabs[idx].data.concat(res.data.list)
            this.$nextTick(() => {
              this.mescroll[idx].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[idx].showNoMore()
              }
            })
          }
        } else {
          this.tabs[idx].fetching = false
          this.mescroll[idx].endErr()
        }
      }).catch(err => {
        this.tabs[idx].fetching = false
        this.mescroll[idx].endErr()
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
        this.mescroll[idx].endErr()
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
      }).catch(() => {
        this.tabs[idx].data.forEach(i => {
          if (i.id === item.id) {
            i.has_like = isLike
            i.like_num = likeNum
            i.submitting = false
          }
        })
      })
    },
    goPublish () {
      if (utils.checkLogin()) {
        let topicJson = JSON.stringify([{id: this.topicInfo.id, title: this.topicInfo.title}])
        this.$router.push({name: 'EditDynamic', query: {topic: topicJson, range: 0}, params: {resetData: true}})
      }
    },
    initMeScroll (idx) {
      let _down = Object.assign({}, mescrollOptions.get(94, 198).down, {
        auto: true,
        autoShowLoading: false,
        callback: () => this.onPullingDown(idx)
      })
      let _up = Object.assign({}, mescrollOptions.get(94, 198).up, {
        callback: () => this.onPullingUp(idx),
        onScroll: this.onMeScroll,
        htmlNodata: '<div style="height:' + (this.$winWidth / 750) * 98 + 'px"></div>'
      })
      this.mescroll[idx] = new MeScroll('mescroll' + idx, {down: _down, up: _up})
    },
    onMeScroll (mescroll, y, isUp) {
      if (y <= 0 && !isUp && this.pageTop !== 0) {
        this.pageTop = 0
      } else if (y > 0 && isUp && this.pageTop === 0) {
        let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
        let bannerHeight = bannerPos.height
        this.pageTop = -bannerHeight
      }
      if (y > this.$winHeight && !this.showBackTop) {
        this.showBackTop = true
      } else if (y < this.$winHeight && this.showBackTop) {
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
  // beforeRouteEnter (to, from, next) {
  //   utils.beforeRouteEnterHandleShareOpen(to, from, next, 2)
  // },
  mounted () {
    if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
      this.initMeScroll(1)
    } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
      this.initMeScroll(0)
    }
    this.initSlideBlock()
  },
  activated () {
    this.$forceUpdate()
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
.topic-page{
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  transition: transform 300ms;
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
.empty-box{
  font-size: 28px;
  color: #999;
  line-height: 48px;
  padding: 50px 0;
  text-align: center;
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
.content-scroll-wrapper{
  -webkit-overflow-scrolling: touch;
}
</style>

<style>
.loading-content{
  margin-top: -49px;
}
</style>
