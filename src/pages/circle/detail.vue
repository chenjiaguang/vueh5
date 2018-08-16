<template>
  <div :style="{height: winHeight + 'px'}">
    <cube-scroll class="toutiao" ref="pageScroller" :scrollEvents="['scroll']" :options="{bounce: false}">
      <div ref="topBanner">
        <download-box />
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
      <div ref="innerWrapper" class="scroll-wrapper" :style="{height: winHeight + 'px'}">
        <div class="nav-scroll-list-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px'}" v-if="tabs && tabs.length > 1 && showTabbar">
          <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
            <cube-tab v-for="(item) in tabs" ref="tabItem" :label="item.title" :key="item.title">
            </cube-tab>
          </cube-tab-bar>
          <div class="tab-slider">
            <div class="tab-slider-body" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
          </div>
          <div class="tab-border"></div>
        </div>
        <div class="tabs-wrapper" ref="slideWrapper" :style="{height: (winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 'px'}">
          <cube-slide ref="slideInstance" :data="tabs" :initialIndex="selectedIdx" :autoPlay="false" :allow-vertical="false" :refreshResetCurrent="true" :loop="false" :speed="500" :options="{listenScroll: true, probeType: 3, stopPropagation: true}" @change="changeSlide" @scroll="slideScroll">
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
                <div v-if="tabs[index].paging && tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该圈子暂无{{index === 0 ? '动态' : '活动'}}</div>
                <dynamic-item v-if="index === 0" v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" @changeLike="changeLike" @showPreview="showPreview" @hidePreview="hidePreview" />
                <activity-item v-if="index === 1" v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" />
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
                  <div v-else-if="tabs[index].paging && tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" style="height: 0;"></div>
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
    <scroll-to-top v-if="$refs['contentScroll']" :visible="showBackTop" :position="{bottom: (winWidth / 750) * 178, right: (winWidth / 750) * 54}" :scroll="$refs['contentScroll'][selectedIdx]"/>
    <i class="iconfont icon-camera publish-icon" @click="goPublish"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DynamicItem from './components/DynamicItem'
import ActivityItem from './components/ActivityItem'
import DownloadBox from '../../components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
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
const tabs = [
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
]
export default {
  data() {
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') ? '活动' : '动态'
    return {
      showBackTop: false,
      circle: {
        cover: {
          compress: ''
        }
      },
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
      tabs: tabs,
      tabBarHeight: parseInt((window.innerWidth / 750) * 88),
      selectedLabel: selectedLabel,
      selectedIdx: selectedIdx,
      tabSlideX: -window.innerWidth + 'px',
      options: {
        pullDownRefresh: {
          threshold: (window.innerWidth / 750) * 89,
          stopTime: 0
        },
        pullUpLoad: {
          threshold: (window.innerWidth / 750) * 100
        },
        click: false
      },
      previewInstance: null,
      showTabbar: false
    }
  },
  components: {DynamicItem, ActivityItem, DownloadBox, LoadingView, ScrollToTop},
  watch: {
    'circle.id': function () {
      console.log('this.tabs', this.tabs, this.selectedIdx, this.selectedLabel)
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 有指定首先显示的tab则刷新该tab数据,否则默认刷新动态tab
        if (this.tabs[1]) {
          this.fetchActivity(1)
        } else {
          this.fetchDynamic(1)
        }
      } else {
        this.fetchDynamic(1)
      }
    },
    '$route.query.previewImage': function (val, oldVal) {
      if (!val && oldVal) {
        if (this.previewInstance) {
          this.$previewImage.hide(this.previewInstance)
          this.previewInstance = null
        }
      }
    }
  },
  methods: {
    showPreview (instance) {
      this.previewInstance = instance
      this.$router.push({name: 'CircleDetail', query: {previewImage: true}, params: {previewImage: true}})
    },
    hidePreview () {
      this.previewInstance = null
      this.$router.go(-1)
    },
    changeTabBar (tabTitle) { // 点击tab切换
      let wrapperWidth = this.$refs['navWrapper'] ? this.$refs['navWrapper'].offsetWidth : window.innerWidth
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
        if (idx === 0) {
          this.fetchDynamic(1)
        } else if (idx === 1) {
          this.fetchActivity(1)
        }
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
      let relativeSlideX = position.current.x + position.current.width / 2
      let preSlideX = position.pre ? (position.pre.x + position.pre.width / 2) : null
      let nextSlideX = position.next ? (position.next.x + position.next.width / 2) : null
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
          let slideX = pos.x + pos.width / 2
          this.tabSlideX = slideX + 'px'
          clearInterval(this.timer)
        }
      },30)
    },
    fetchCircle () {
      let rData = {
        cid: this.$route.query.circle_id,
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U'
      }
      this.$ajax('/jv/qz/v21/circleinfo', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.circle = res.data
          if (!res.data.circle_has_activity) { // 有活动tab
            this.tabs.splice(1, 1)
            this.showTabbar = true
          } else {
            this.showTabbar = true
          }
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
        return false
      }
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.circle.id,
        snapshot: this.tabs[0].paging.snapshot || '',
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U'
      }
      this.tabs[0].fetching = true
      this.$ajax('/jv/qz/v21/circledynamics', {data: rData}).then(res => { // 获取动态列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.tabs[0].fetching = false
          this.tabs[0].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            this.tabs[0].data = res.data.list
          } else {
            this.tabs[0].data = this.tabs[0].data.concat(res.data.list)
          }
        } else {
          this.tabs[0].fetching = false
        }
      }).catch(err => {
        this.tabs[0].fetching = false
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取动态失败')
        }
      })
    },
    fetchActivity (pn) {
      if (!this.tabs[1]) {
        return false
      }
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.circle.id,
        snapshot: this.tabs[1].paging.snapshot || '',
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U'
      }
      this.tabs[1].fetching = true
      this.$ajax('/jv/qz/v21/circleactivities', {data: rData}).then(res => { // 获取活动列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.tabs[1].fetching = false
          this.tabs[1].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            this.tabs[1].data = res.data.list
          } else {
            this.tabs[1].data = this.tabs[1].data.concat(res.data.list)
          }
        } else {
          this.tabs[1].fetching = false
        }
      }).catch(err => {
        this.tabs[1].fetching = false
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
      let rData = {
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U',
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
              i.has_like = !item.has_like
              i.like_num = parseInt(item.like_num) + (item.has_like ? 1 : -1)
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
      this.$router.push({name: 'EditDynamic', params: {circle: {id: this.circle.id, title: this.circle.name}}})
    }
  },
  created () {
    this.fetchCircle()
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
  width: 300%;
  height: 3px;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 100%;
  background: #e5e5e5;
}
.cube-tab{
  font-size: 36px;
  color: #666;
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
  background-color: #fff;
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
</style>