<template>
  <div :style="{height: $winHeight + 'px'}" class="circle-page">
    <div ref="pageContainer" style="transition: all 300ms" :style="{transform: 'translateY(' + pageTop + 'px)'}">
      <div ref="topBanner" @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd">
        <download-box v-if="$route.query.isShareOpen" />
        <header class="top-header">
          <div class="top-header-bg" :style="{backgroundImage: 'url(' + circle.cover.compress + ')'}"></div>
          <div class="top-header-content">
            <div class="top-header-avatar" :style="{backgroundImage: 'url(' + circle.cover.compress + ')'}"></div>
            <div class="top-header-text">
              <div class="top-header-name">{{circle.name}}</div>
              <div class="top-header-intro">{{circle.intro}}</div>
              <div class="top-header-overview">
                <span>{{circle.followed_num || 0}}人关注</span>
                <span>{{circle.dynamic_num || 0}}条动态</span>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div ref="innerWrapper" class="scroll-wrapper" :style="{height: $winHeight + 'px'}">
        <div @touchmove="bannerTouchMove" @touchstart="bannerTouchStart" @touchend="bannerTouchEnd" class="nav-scroll-list-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px'}" v-if="tabs && tabs.length > 1 && showTabbar">
          <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
            <cube-tab v-for="(item) in tabs" ref="tabItem" :label="item.title" :key="item.title">
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
                <div :id="'mescroll' + index" class="mescroll content-scroll-wrapper" :style="{width: $winWidth + 'px', height: '100%', overflowY: 'auto', overflowX: 'hidden'}">
                  <transition name="loading-scale">
                    <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                      <loading-view />
                    </div>
                  </transition>
                  <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 1 + 'px', backgroundColor: '#fff'}">
                    <dynamic-item v-if="index === 0" v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" :router="$router" @changeLike="changeLike" />
                    <activity-item v-if="index === 1" v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" />
                  </div>
                  <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 1 + 'px'}">该圈子暂无{{index === 0 ? '动态' : '活动'}}</div>
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
                  <dynamic-item v-if="index === 0" v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" :router="$router" @changeLike="changeLike" />
                  <activity-item v-if="index === 1" v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" />
                </div>
                <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该圈子暂无{{index === 0 ? '动态' : '活动'}}</div>
              </div>
            </cube-slide-item>
          </cube-slide>
        </div> -->
      </div>
    </div>
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: ($winWidth / 750) * 178, right: ($winWidth / 750) * 54}" :scroll="mescroll[selectedIdx]"/>
    <i class="iconfont icon-camera publish-icon" @click="goPublish"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Vue from 'vue'
import DynamicItem from './components/DynamicItem'
import ActivityItem from './components/ActivityItem'
import DownloadBox from '../../components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import MeScrollSupportArr from '@/mixin/MeScrollSupportArr'
import CloseImagePreviewer from '@/mixin/CloseImagePreviewer'
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
  circle: {
    cover: {
      compress: ''
    }
  },
  tabs: [
    {
      title: '动态',
      data: [],
      paging: {},
      fetching: false
    },
    {
      title: '活动',
      data: [],
      paging: {},
      fetching: false
    }
  ],
  swiperOption: {},
  tabBarHeight: parseInt((window.innerWidth / 750) * 88),
  selectedLabel: '动态',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  showTabbar: false,
  pageTop: 0,
  mescroll: []
}
export default {
  mixins: [MeScrollSupportArr, CloseImagePreviewer],
  data () {
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '活动' : '动态'
    let isShareOpen = this.$route.params.isShareOpen
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
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel, isShareOpen, swiperOption})
    return _obj
  },
  components: {DynamicItem, ActivityItem, DownloadBox, LoadingView, ScrollToTop, swiper, swiperSlide},
  watch: {
    '$route': function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'CircleDetail', ['circle_id', 'jump_tab'], () => {
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
    initSlideBlock () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        const initialTab = parseInt(this.$route.query.jump_tab || 0)
        if (this.$refs['tabItem'] && this.$refs['tabItem'].length > 0) {
          let slideBlock = this.$refs['tabItem'][initialTab] || this.$refs['tabItem']
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
      this.fetchCircle()
      this.initSlideBlock()
    },
    fetchCircle () {
      let rData = {
        cid: this.$route.query.circle_id
      }
      this.$ajax('/jv/anonymous/qz/v21/circleinfo', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          this.circle = res.data
          if (!res.data.circle_has_activity) { // 没有活动tab
            this.tabs.splice(1, 1)
            // this.initPageScroll()
            this.initMeScroll(0)
          } else {
            this.showTabbar = true
            const len = this.tabs.length.toString()
            // this.initPageScroll()
            if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
              this.initMeScroll(1)
            } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
              this.initMeScroll(0)
            }
          }
          this.$store.commit('weixinShare/set', {
            title: res.data.shareInfo.shareTitle,
            desc: res.data.shareInfo.shareContent,
            url: res.data.shareInfo.shareUrl,
            imgUrl: res.data.shareInfo.shareImage
          })
        }
      }).catch(err => {
        if (err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取圈子失败')
        }
      })
    },
    fetchDynamic (pn) {
      if (this.tabs[0].fetching) { // 正在拉取动态数据
        this.mescroll[0].endErr()
        return false
      }
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.circle.id,
        snapshot: this.tabs[0].paging.snapshot || ''
      }
      this.tabs[0].fetching = true
      this.$ajax('/jv/anonymous/qz/v21/circledynamics', {data: rData}).then(res => { // 获取动态列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          this.tabs[0].fetching = false
          this.tabs[0].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            this.tabs[0].data = res.data.list
            this.$nextTick(() => {
              this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[0].showNoMore()
              }
            })
          } else {
            this.tabs[0].data = this.tabs[0].data.concat(res.data.list)
            this.$nextTick(() => {
              this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[0].showNoMore()
              }
            })
          }
        } else {
          this.tabs[0].fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.tabs[0].fetching = false
        this.mescroll[0].endErr()
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取动态失败')
        }
      })
    },
    fetchActivity (pn) {
      if (!this.tabs[1] || (this.tabs[1] && this.tabs[1].fetching)) {
        this.mescroll[1].endErr()
        return false
      }
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.circle.id,
        snapshot: this.tabs[1].paging.snapshot || ''
      }
      this.tabs[1].fetching = true
      this.$ajax('/jv/anonymous/qz/v21/circleactivities', {data: rData}).then(res => { // 获取活动列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          this.tabs[1].fetching = false
          this.tabs[1].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            this.tabs[1].data = res.data.list
            this.$nextTick(() => {
              this.mescroll[1].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[1].showNoMore()
              }
            })
          } else {
            this.tabs[1].data = this.tabs[1].data.concat(res.data.list)
            this.$nextTick(() => {
              this.mescroll[1].endSuccess(res.data.list.length, !res.data.paging.is_end)
              if (res.data.paging.is_end) {
                this.mescroll[1].showNoMore()
              }
            })
          }
        } else {
          this.tabs[1].fetching = false
          this.mescroll[1].endErr()
        }
      }).catch(err => {
        this.tabs[1].fetching = false
        this.mescroll[1].endErr()
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取活动失败')
        }
      })
    },
    onPullingDown (idx) {
      if (idx === 0) { // 动态列表
        this.fetchDynamic(1)
      } else if (idx === 1) { // 活动列表
        this.fetchActivity(1)
      }
    },
    onPullingUp (idx) {
      if (!(this.tabs[idx].paging && this.tabs[idx].paging.pn && !this.tabs[idx].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        this.mescroll[idx].endErr()
        return false
      }
      let pn = parseInt(this.tabs[idx].paging.pn) + 1
      if (idx === 0) { // 动态列表
        this.fetchDynamic(pn)
      } else if (idx === 1) { // 活动列表
        this.fetchActivity(pn)
      }
    },
    changeLike (item) {
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
    goPublish () {
      if (utils.checkLogin()) { // 登陆后跳转
        let circleJson = JSON.stringify({id: this.circle.id, title: this.circle.name})
        this.$router.push({name: 'EditDynamic', query: {circle: circleJson}, params: {resetData: true}})
      }
    },
    initMeScroll (idx) {
      let _down = Object.assign({}, mescrollOptions.get().down, {
        auto: true,
        autoShowLoading: false,
        callback: () => this.onPullingDown(idx)
      })
      let _up = Object.assign({}, mescrollOptions.get().up, {
        callback: () => this.onPullingUp(idx),
        onScroll: this.onMeScroll,
        htmlNodata: '<div style="height:0"></div>'
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
      } else if (y < this.winHeight && this.showBackTop) {
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
  //   utils.beforeRouteEnterHandleShareOpen(to, from, next, 1)
  // },
  mounted () {
    this.fetchCircle()
    this.initSlideBlock()
  },
  activated () {
    this.$forceUpdate()
  },
  beforeDestroy () {
    alert(1111)
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
.circle-page{
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
  filter: blur(33px);
  z-index: 0;
}
.top-header-content{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 288px;
  background-color: rgba(32,31,31,0.3)
}
.top-header-text{
  padding-left: 220px;
  padding-top: 30px;
  padding-right: 30px;
}
.top-header-name{
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  line-height: 42px;
}
.top-header-intro{
  font-size: 24px;
  color: #fff;
  line-height: 36px;
  padding-top: 22px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.top-header-overview{
  font-size: 24px;
  color: #fff;
  line-height: 34px;
  padding-top: 20px;
}
.top-header-overview > span{
    padding-right: 30px;
  }
.top-header-avatar{
  position: absolute;
  left: 40px;
  top: 30px;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
  height: 88px;
  position: relative;
  z-index: 1;
}
.tab-slider{
  width: 100%;
  height: 6px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.tab-slider-body{
  width: 40px;
  height: 6px;
  position: absolute;
  left: -20px;
  bottom: 0;
  background: #1EB0FD;
  border-radius: 4px;
  transition: transform 300ms;
}
.tab-border{
  width: 100%;
  height: 2px;
  position: absolute;
  transform: scale(0.5, 0.5);
  transform-origin: 0 100%;
  background: #e5e5e5;
  left: 0;
  bottom: 0;
}
.cube-tab{
  font-size: 36px;
  color: #666;
}
.cube-tab_active{
  color: #333;
  font-weight: bold;
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
  bottom: 80px;
  z-index: 2;
}
.content-scroll-wrapper{
  -webkit-overflow-scrolling: touch;
}
.empty-box{
  font-size: 28px;
  color: #999;
  line-height: 48px;
  padding: 50px 0;
  text-align: center;
}
</style>
