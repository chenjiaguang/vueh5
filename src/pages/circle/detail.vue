<template>
  <div id="circle-detail" class="circle-page mescroll">
    <div ref="topBanner">
      <download-box v-if="$route.query.isShareOpen && !$isApp" />
      <header class="top-header">
        <div class="top-header-bg" :style="{backgroundImage: 'url(' + circle.cover.compress + ')'}"></div>
        <div class="top-header-content">
          <div class="top-header-avatar" :style="{backgroundImage: 'url(' + circle.cover.compress + ')'}"></div>
          <div class="top-header-text">
            <div class="top-header-name">{{circle.name}}</div>
            <div class="top-header-intro">{{circle.intro}}</div>
            <div class="top-header-overview">
              <span>{{circle.followed_num || 0}}人加入</span>
              <span>{{circle.dynamic_num || 0}}条动态</span>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div class="nav-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px', zIndex: '99999'}" v-if="tabs && tabs.length > 1 && showTabbar">
      <div class="nav-content" ref="navContent" :style="{height: tabBarHeight + 'px'}">
        <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
          <cube-tab v-for="(item) in tabs" class="tab-item" ref="tabItem" :label="item.title" :key="item.title">
          </cube-tab>
        </cube-tab-bar>
        <div class="tab-slider">
          <div class="tab-slider-body" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
        </div>
        <div class="tab-border" :style="{transform: 'scale(1,' + $tranScale + ')'}"></div>
      </div>
    </div>
    <div>
      <div :style="{width: '100%', overflow: 'hidden'}">
        <div :style="{width: 100 * tabs.length + '%'}">
          <div v-for="(item, index) in tabs" v-show="selectedIdx === index" :key="item.title" :style="{width: 100 / tabs.length + '%', overflow: 'hidden', backgroundColor: '#F2F2F2'}">
            <transition name="loading-scale">
              <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                <loading-view />
              </div>
            </transition>
            <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{backgroundColor: '#fff'}">
              <dynamic-item v-if="index === 0" v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" :router="$router" @changeLike="changeLike" />
              <activity-item v-if="index === 1" v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" />
            </div>
            <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">{{circle.followed ? ('该群组暂无' + index === 0 ? '动态' : '活动') : '加入群组才能进行更多操作哦~'}}</div>
          </div>
        </div>
      </div>
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
            <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该群组暂无{{index === 0 ? '动态' : '活动'}}</div>
          </div>
        </cube-slide-item>
      </cube-slide>
    </div> -->
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: (maxWidth / 750) * 178, right: (maxWidth / 750) * 54}" :scroll="mescroll[0]"/>
    <i class="iconfont icon-camera publish-icon" :style="{marginRight: marginRight + 'px'}" v-if="circle.followed" @click="goPublish"></i>
    <div v-if="!circle.followed && circle.followed !== null" class="follow-box" :style="{height: followBoxHeight + 'px'}" @click="joinCircle">
      <div class="follow-icon" :style="{backgroundImage: 'url(' + $assetsFullPath + 'image/add_circle_icon.png)'}"></div>
      <div class="follow-text">申请加入群组</div>
    </div>
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
import WeixinShareInKeepAlive from '../../mixin/WeixinShareInKeepAlive'
import {
  /* eslint-disable no-unused-vars */
  Style,
  TabBar,
  Slide
} from 'cube-ui'
Vue.use(TabBar)
Vue.use(Slide)

let _maxWidth = window.innerWidth > (54 * 10) ? (54 * 10) : window.innerWidth // 最大宽度，flexible中html font-size都最大值的10倍
let _marginRight = (window.innerWidth - (window.innerWidth > 800 ? 800 : window.innerWidth)) / 2
const initialData = {
  showBackTop: false,
  circle: {
    cover: {
      compress: ''
    },
    followed: null
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
  // swiperOption: {},
  tabBarHeight: parseInt((_maxWidth / 750) * 88),
  followBoxHeight: parseInt((_maxWidth / 750) * 100),
  selectedLabel: '动态',
  selectedIdx: 0,
  tabSlideX: -window.innerWidth + 'px',
  showTabbar: false,
  pageTop: 0,
  mescroll: [],
  following: false,
  maxWidth: _maxWidth,
  marginRight: _marginRight,
  videoPoint: {}
}
export default {
  mixins: [MeScrollSupportArr, CloseImagePreviewer, WeixinShareInKeepAlive],
  data () {
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
    let selectedLabel = _initialData.tabs[parseInt(selectedIdx)].title
    let isShareOpen = this.$route.params.isShareOpen
    let _this = this
    // let swiperOption = {
    //   initialSlide: selectedIdx,
    //   setWrapperSize: true,
    //   pagination: {
    //     el: '.swiper-pagination',
    //     type: 'fraction'
    //   },
    //   on: {
    //     slideChangeTransitionStart: function () {
    //       let appPos = document.getElementById('app').getBoundingClientRect()
    //       let pos = _this.$refs['tabItem'][this.activeIndex].$el.getBoundingClientRect()
    //       let slideX = pos.left + pos.width / 2 - appPos.left
    //       _this.selectedLabel = _this.tabs[this.activeIndex].title
    //       _this.tabSlideX = slideX + 'px'
    //       _this.$refs['swiper'].swiper.slideTo(this.activeIndex, 300)
    //     }
    //   }
    // }
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel, isShareOpen})
    return _obj
  },
  components: {DynamicItem, ActivityItem, DownloadBox, LoadingView, ScrollToTop, swiper, swiperSlide},
  watch: {
    '$route': function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'CircleDetail', ['circle_id', 'jump_tab'], () => {
        this.refreshData()
      },
      () => {
        this.runShareBindfunction()
      })
    },
    'circle.name': function (val, oldVal) {
      if (val) {
        document.title = val
      }
    }
  },
  methods: {
    applyJoinCircle () {
      let {need_audit, id} = this.circle
      if (need_audit) { // 跳转申请加入
        this.$router.push({name: 'CircleApply', query: {circle_id: id}})
      } else { // 直接申请
        if (this.following) { // 正在申请
          this.$toast('正在申请...')
          return false
        }
        let rData = {
          id: id,
          follow: 1
        }
        this.following = true
        this.$ajax('/jv/qz/following', {data: rData}).then(res => {
          if (res && !res.error) { // 申请成功
            this.circle.followed = true
            this.following = false
            this.$toast('加入成功')
            this.refreshData()
          } else if (res.error && res.msg) {
            this.following = false
            this.$toast(res.msg)
          } else {
            this.following = false
          }
        }).catch(err => {
          console.log('加入群组出错', err)
          this.following = false
        })
      }
    },
    joinCircle () {
      let {need_audit, followed} = this.circle
      let _rightText = need_audit ? '申请加入' : '立即加入'
      if (followed || !utils.checkLogin(true)) { // 已加入或未登录均返回
        return false
      }
      if (this.following) { // 正在申请
        this.$toast('正在申请...')
        return false
      }
      this.$prompt.showPrompt({titleText: '加入群组才能进行更多操作哦~', leftText: '我再想想', rightText: _rightText}, () => {
        this.applyJoinCircle()
      }, () => {
        console.log('cancel')
      })
    },
    changeTabBar (tabTitle) { // 点击tab切换
      const bannerHeight = this.$refs['topBanner'].getBoundingClientRect().height
      // 记录点击前tab的滚动高度
      let preIdx = this.selectedIdx
      let preTop = this.mescroll[0].getScrollTop()
      this.tabs[preIdx].scrollTop = preTop
      this.tabs.forEach((item, index) => {
        if (item.title === tabTitle) {
          this.selectedLabel = tabTitle
          this.selectedIdx = index
          let currentTop = this.tabs[index].scrollTop || 0
          if (currentTop > bannerHeight) { // 滚动到所点击tap原来记录的滚动高度
            this.$nextTick(() => {
              this.mescroll[0].scrollTo(currentTop, 0)
            })
          }
          let pos = this.$refs['tabItem'][index].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2
          this.tabSlideX = slideX + 'px'
          // this.$refs['swiper'].swiper.slideTo(index, 300)
          // if (!this.tabs[index].paging.pn) {
          //   this.initMeScroll(index)
          // }
          if (!this.tabs[index].paging.pn) {
            console.log('111')
            if (index === 0) {
              this.fetchDynamic(1)
            } else if (index === 1) {
              this.fetchActivity(1)
            }
          } else if (this.tabs[index].paging.is_end) {
            console.log('222')
            // this.mescroll[0].endSuccess(1, false)
            this.$nextTick(() => {
              console.log('endSuccess-changeTabBar')
              this.mescroll[0].endSuccess(1, false)
              this.mescroll[0].showNoMore()
            })
          } else if (!this.tabs[index].paging.is_end) {
            console.log('333')
            this.$nextTick(() => {
              console.log('endSuccess-changeTabBar')
              this.mescroll[0].endSuccess(10, true)
              // this.mescroll[0].showUpScroll()
            })
          }
        }
      })
    },
    initSlideBlock () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        const initialTab = parseInt(this.$route.query.jump_tab || 0)
        if (this.$refs['tabItem'] && this.$refs['tabItem'].length > 0) {
          let slideBlock = this.$refs['tabItem'][initialTab] || this.$refs['tabItem']
          let appPos = document.getElementById('app').getBoundingClientRect()
          let pos = this.$refs['tabItem'][initialTab].$el.getBoundingClientRect()
          let slideX = pos.left + pos.width / 2 - appPos.left
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
      let _initialData = JSON.parse(JSON.stringify(initialData))
      let selectedIdx = parseInt(this.$route.query.jump_tab || 0)
      let selectedLabel = _initialData.tabs[parseInt(selectedIdx)].title
      let _this = this
      // let swiperOption = {
      //   initialSlide: selectedIdx,
      //   setWrapperSize: true,
      //   pagination: {
      //     el: '.swiper-pagination',
      //     type: 'fraction'
      //   },
      //   on: {
      //     slideChangeTransitionStart: function () {
      //       let pos = _this.$refs['tabItem'][this.activeIndex].$el.getBoundingClientRect()
      //       let slideX = pos.left + pos.width / 2
      //       _this.selectedLabel = _this.tabs[this.activeIndex].title
      //       _this.tabSlideX = slideX + 'px'
      //       _this.$refs['swiper'].swiper.slideTo(this.activeIndex, 300)
      //     }
      //   }
      // }
      let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
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
            this.initMeScroll()
          } else { // 有活动tab
            if (this.$isApp) {
              let {id, name, circle_has_activity} = res.data
              this.$appCall('h5GoCircleDetail', id, name, circle_has_activity)
            }
            this.showTabbar = true
            this.$nextTick(this.setSticky)
            const len = this.tabs.length.toString()
            // this.initPageScroll()
            if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
              this.initMeScroll()
            } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
              this.initMeScroll()
            }
          }
          this.setShareData({
            type: '1',
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
          this.$toast('获取群组失败')
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
          } else {
            this.tabs[0].data = this.tabs[0].data.concat(res.data.list)
          }
          if (res.data.paging.is_end) {
            this.mescroll[0].showNoMore()
          }
          this.$nextTick(() => {
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
          })
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
        this.mescroll[0].endErr()
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
          } else {
            this.tabs[1].data = this.tabs[1].data.concat(res.data.list)
          }
          if (res.data.paging.is_end) {
            this.mescroll[0].showNoMore()
          }
          this.$nextTick(() => {
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
          })
        } else {
          this.tabs[1].fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.tabs[1].fetching = false
        this.mescroll[0].endErr()
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取活动失败')
        }
      })
    },
    onPullingDown (idx) {
      if (this.selectedIdx === 0) { // 动态列表
        this.fetchDynamic(1)
      } else if (this.selectedIdx === 1) { // 活动列表
        this.fetchActivity(1)
      }
    },
    onPullingUp () {
      let idx = this.selectedIdx
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
      if (utils.checkLogin(true)) { // 登陆后跳转
        let circleJson = JSON.stringify({id: this.circle.id, title: this.circle.name})
        this.$router.push({name: 'EditDynamic', query: {circle: circleJson}, params: {resetData: true}})
      }
    },
    initMeScroll () {
      // let _down = Object.assign({}, mescrollOptions.get().down, {
      //   isLock: true,
      //   auto: true,
      //   autoShowLoading: false,
      //   callback: () => this.onPullingDown(idx)
      // })
      // let _up = Object.assign({}, mescrollOptions.get().up, {
      //   callback: () => this.onPullingUp(idx),
      //   onScroll: this.onMeScroll,
      //   htmlNodata: '<div style="height:0"></div>'
      // })
      // this.mescroll[idx] = new MeScroll('mescroll' + idx, {down: _down, up: _up})

      let _down = Object.assign({}, mescrollOptions.get().down, {
        isLock: true,
        auto: true,
        autoShowLoading: false,
        callback: () => this.onPullingDown()
      })
      let _up = Object.assign({}, mescrollOptions.get().up, {
        callback: () => this.onPullingUp(),
        htmlNodata: '<div style="height:0"></div>'
      })
      this.mescroll[0] = new MeScroll('circle-detail', {down: _down, up: _up})
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
        this.fetchActivity(1)
      } else if ((!this.$route.query.jump_tab) || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0')) { // 初始tab为0
        this.fetchDynamic(1)
      }
    },
    setSticky () {
      this.mescroll[0].optUp.onScroll = (mescroll, y, isUp) => {
        // 设置吸顶
        if (y >= this.$refs['navWrapper'].offsetTop) {
          this.$refs['navContent'].classList.add('nav-fixed')
        } else {
          this.$refs['navContent'].classList.remove('nav-fixed')
        }
        // 显示隐藏返回顶部按钮
        if (y > window.innerHeight && !this.showBackTop) {
          this.showBackTop = true
        } else if (y < window.innerHeight && this.showBackTop) {
          this.showBackTop = false
        }
      }
    },
    onMeScroll (mescroll, y, isUp) {
      // 设置吸顶
      if (y >= this.$refs['navWrapper'].offsetTop) {
        this.$refs['navContent'].classList.add('nav-fixed')
      } else {
        this.$refs['navContent'].classList.remove('nav-fixed')
      }
      // 显示隐藏返回顶部按钮
      if (y > window.innerHeight && !this.showBackTop) {
        this.showBackTop = true
      } else if (y < window.innerHeight && this.showBackTop) {
        this.showBackTop = false
      }
      // if (y <= 0 && !isUp && this.pageTop !== 0) {
      //   this.pageTop = 0
      // } else if (y > 0 && isUp && this.pageTop === 0) {
      //   let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
      //   let bannerHeight = bannerPos.height
      //   this.pageTop = -bannerHeight
      // }
      // if (y > this.$winHeight && !this.showBackTop) {
      //   this.showBackTop = true
      // } else if (y < this.$winHeight && this.showBackTop) {
      //   this.showBackTop = false
      // }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'VideoMedia' && from.params && (from.params.videoPoint || from.params.videoPoint === 0)) {
        let _data = vm.tabs[0].data
        for (let i = 0; i < _data.length; i++) {
          console.log('beforeRouteEnter', from.query.dynamic_id, _data[i].id)
          if (_data[i].id === from.query.dynamic_id) {
            _data[i].videoPoint = from.params.videoPoint
            break
          }
        }
        vm.tabs[0].data = _data
      }
    })
  },
  mounted () {
    this.fetchCircle()
    this.initSlideBlock()
  },
  activated () {
    this.$forceUpdate()
    if (this.circle && this.circle.name) {
      document.title = this.circle.name
    }
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
  overflow-y: auto;
  overflow-x: hidden;
  background: #F2F2F2;
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
  min-height: 288px;
  background-color: rgba(32,31,31,0.3);
  box-sizing: border-box;
  padding-bottom: 36px;
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
  word-break: break-all;
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
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  word-break: break-all;
  box-sizing: content-box;
  min-height: 106px;
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
  background: #F2F2F2;
}
.nav-scroll-list-wrap{
  position: relative;
  background-color: #fff;
}

.nav-wrap{
  position: relative;
  background-color: #fff;
}
.nav-content{
  background: #fff;
}
.tab-box{
  height: 88px;
  padding: 0 21.33%;
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
body .cube-tab-bar{
  justify-content: space-around;
}
.cube-tab{
  flex: 144px 0 0;
  text-align: center;
  font-size: 36px;
  color: #666;
  white-space: nowrap;
}
.cube-tab_active{
  color: #333;
}
.cube-tab_active /deep/ div{
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
.follow-box{
  position: fixed;
  left: 50%;
  bottom: 0;
  width: 100%;
  max-width: 800PX;
  transform: translateX(-50%);
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.follow-box:before{
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  top: 0;
  transform: scale(1, 0.5);
  transform-origin: 0 0;
  background: #e5e5e5;
}
.follow-icon{
  width: 32px;
  height: 32px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 16px;
}
.follow-text{
  font-size: 32px;
  line-height: 50px;
}

/* 吸顶效果 */
.nav-fixed{
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
