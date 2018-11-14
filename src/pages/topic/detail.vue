<template>
  <div id="topic-detail" class="topic-page mescroll">
    <div ref="topBanner">
      <download-box v-if="$route.query.isShareOpen && !$isApp" />
      <header ref="topHeader" class="top-header">
        <!-- <div class="top-header-bg" :style="{backgroundImage: 'linear-gradient(60deg,#' + topicInfo.beginColor + ',#' + topicInfo.endColor + ')'}"></div> -->
        <div class="top-header-overview">
          <div class="top-header-avatar" :style="{backgroundImage: 'url(' + (topicInfo.cover.staticImage || topicInfo.cover.url) + ')'}"></div>
          <div class="top-header-others">
            <div class="top-header-title" v-if="topicInfo.title"><i class="iconfont icon-topic_v_2_5 top-header-icon"></i><span class="top-header-title-text">{{topicInfo.title}}</span><div class="end-mask"></div></div>
            <div class="top-header-dynum" v-if="topicInfo.dyCount">{{topicInfo.dyCount}}条动态</div>
            <div class="top-header-tags" v-if="topicInfo.tcName">
              <div class="top-header-tag-item"><span>{{topicInfo.tcName}}</span></div>
            </div>
          </div>
        </div>
        <div class="top-header-intro"><span style="font-weight:bold;">简介：</span>{{topicInfo.content}}</div>
      </header>
      <div class="gray-block"></div>
    </div>
    <div class="nav-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px', zIndex: '99999'}" v-if="tabs && tabs.length > 1">
      <div class="nav-content" ref="navContent" :style="{height: tabBarHeight + 'px'}">
        <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
          <cube-tab v-for="(item) in tabs" :class="{current: selectedLabel === item.title}" ref="tabItem" :label="item.title" :key="item.title">
          </cube-tab>
        </cube-tab-bar>
        <div class="tab-slider">
          <div class="tab-slider-body" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
        </div>
        <div class="tab-border" :style="{transform: 'scale(1,' + $tranScale + ')'}"></div>
      </div>
    </div>
    <div class="list-wrapper">
      <div :style="{width: '100%', overflow: 'hidden'}">
        <div :style="{width: 100 * tabs.length + '%'}">
          <div v-for="(item, index) in tabs" v-show="selectedIdx === index" :key="item.title" :style="{width: 100 / tabs.length + '%', overflow: 'hidden', backgroundColor: '#F2F2F2'}">
            <transition name="loading-scale">
              <div class="first-loading-box" v-if="!tabs[index].paging.pn">
                <loading-view />
              </div>
            </transition>
            <div v-if="tabs[index].paging.pn && tabs[index].data && tabs[index].data.length !== 0" :style="{backgroundColor: '#fff'}">
              <topic-item v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :router="$router" :hideBlock="idx === tabs[index].data.length - 1" @changeLike="(data) => changeLike(data, index)" />
            </div>
            <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该话题暂无{{index === 0 ? '最新动态' : '最热动态'}}</div>
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
              <topic-item v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" :router="$router" :hideBlock="idx === tabs[index].data.length - 1" @changeLike="(data) => changeLike(data, index)" />
            </div>
            <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">该话题暂无{{index === 0 ? '最新动态' : '最热动态'}}</div>
          </div>
        </cube-slide-item>
      </cube-slide>
    </div> -->
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 278, right: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 54}" :scroll="mescroll[0]"/>
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

let maxWidth = window.innerWidth > (54 * 10) ? (54 * 10) : window.innerWidth // 最大宽度，flexible中html font-size都最大值的10倍
const initialData = {
  showBackTop: false,
  topicInfo: {
    beginColor: 'B0B0B0',
    endColor: 'F9F9F9',
    cover: {}
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
  // swiperOption: {},
  tabBarHeight: parseInt((maxWidth / 750) * 96),
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
    //       let appPos = document.getElementById('app').getBoundingClientRect()
    //       let pos = _this.$refs['tabItem'][this.activeIndex].$el.getBoundingClientRect()
    //       let slideX = pos.left + pos.width / 2 - appPos.left
    //       _this.selectedLabel = _this.tabs[this.activeIndex].title
    //       _this.tabSlideX = slideX + 'px'
    //       _this.$refs['swiper'].swiper.slideTo(this.activeIndex, 300)
    //     }
    //   }
    // }
    let _obj = Object.assign({}, _initialData, {selectedIdx, selectedLabel})
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
      document.title = val
    }
  },
  methods: {
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
              this.fetchTopic(0, 1)
            } else if (index === 1) {
              this.fetchTopic(1, 1)
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
        if (this.$refs['tabItem']) {
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
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
        this.initMeScroll()
      } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
        this.initMeScroll()
      }
      this.initSlideBlock()
    },
    fetchTopic (idx, pn) {
      if (this.tabs[idx].fetching) { // 正在拉取动态数据
        this.mescroll[0].endErr()
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
            let {id, title, content, beginColor, endColor, tcName, cover, dyCount} = res.data
            this.$appCall('h5GoTopicDetail', id, title, content, tcName, cover.staticImage || cover.url, dyCount)
          }
          this.tabs[idx].fetching = false
          this.tabs[idx].paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            let {id, title, state, content, beginColor, endColor, dyCount, cover, tcName} = res.data
            this.topicInfo = {id, title, state, content, beginColor, endColor, dyCount, cover, tcName}
            this.tabs[idx].data = res.data.list
            this.setShareData({
              type: '2',
              title: res.data.shareInfo.shareTitle,
              desc: res.data.shareInfo.shareContent,
              url: res.data.shareInfo.shareUrl,
              imgUrl: res.data.shareInfo.shareImage
            })
          } else {
            this.tabs[idx].data = this.tabs[idx].data.concat(res.data.list)
          }
          if (res.data.paging.is_end) {
            this.mescroll[0].showNoMore()
          }
          this.$nextTick(() => {
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
          })
        } else {
          this.tabs[idx].fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.tabs[idx].fetching = false
        this.mescroll[0].endErr()
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取话题失败')
        }
      })
    },
    onPullingDown () {
      let idx = this.selectedIdx
      this.fetchTopic(idx, 1)
    },
    onPullingUp () {
      let idx = this.selectedIdx
      if (!(this.tabs[idx].paging && this.tabs[idx].paging.pn && !this.tabs[idx].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        this.mescroll[0].endErr()
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
      // let _down = Object.assign({}, mescrollOptions.get(94, 198).down, {
      //   isLock: true,
      //   auto: true,
      //   autoShowLoading: false,
      //   callback: () => this.onPullingDown(idx)
      // })
      // let _up = Object.assign({}, mescrollOptions.get(94, 198).up, {
      //   callback: () => this.onPullingUp(idx),
      //   onScroll: this.onMeScroll,
      //   htmlNodata: '<div style="height:' + ((this.$winWidth > (54 * 10) ? (54 * 10) : this.$winWidth) / 750) * 98 + 'px"></div>'
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
      this.mescroll[0] = new MeScroll('topic-detail', {down: _down, up: _up})
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
        this.fetchTopic(1, 1)
      } else if ((!this.$route.query.jump_tab) || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0')) { // 初始tab为0
        this.fetchTopic(0, 1)
      }
      this.$nextTick(this.setSticky)
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
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   utils.beforeRouteEnterHandleShareOpen(to, from, next, 2)
  // },
  mounted () {
    if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
      this.initMeScroll()
    } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
      this.initMeScroll()
    }
    this.initSlideBlock()
  },
  activated () {
    this.$forceUpdate()
    if (this.topicInfo && this.topicInfo.title) {
      document.title = this.topicInfo.title
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
  }
}
</script>

<style scoped>
.gray-block{
  width: 100%;
  height: 16px;
  position: relative;
  background: #F2F2F2;
}
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
  overflow-y: auto;
  overflow-x: hidden;
  background: #F2F2F2;
  padding-bottom: 98px;
}
.top-header{
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 26px 4% 30px;
  background: #fff;
}
.top-header-overview{
  display: flex;
}
.top-header-avatar{
  width: 158px;
  height: 158px;
  border-radius: 10px;
  margin-top: 4px;
  margin-right: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: #eeeeee;
}
.top-header-others{
  flex: 1;
  overflow: hidden;
}
.top-header-title{
  font-size: 36px;
  line-height: 44px;
  color: #333;
  font-weight: bold;
  word-break: break-all;
  white-space: normal;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.end-mask{
  width: 64px;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,1));
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}
.top-header-dynum{
  font-size: 24px;
  line-height: 32px;
  padding-top: 12px;
  color: #666;
}
.top-header-tags{
  height: 32px;
  color: #333;
  position: relative;
  margin-top: 30px;
}
.top-header-tag-item{
  display: flex;
  height: 200%;
  font-size: 40px;
  background: #FFEB88;
  border-radius: 12px;
  color: #333;
  padding: 0 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  transform: scale(0.5, 0.5);
  transform-origin: 0 0;
  white-space: nowrap;
}
.top-header-tag-item span{
  font-weight: bold;
}
.top-header-title-text{
  vertical-align: middle;
  font-weight: bold;
}
.top-header-intro{
  font-size: 24px;
  color: #fff;
  line-height: 30px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  white-space: normal;
  word-break: break-all;
  color: #666666;
  padding-top: 27px;
}
.top-header-icon{
  font-size: 34px;
  color: #FF611A;
  vertical-align: middle;
  margin-right: 10px;
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
  max-width: 800PX;
  height: 98px;
  line-height: 98px;
  font-size: 30px;
  color: #666;
  text-align: center;
  background: #FAFAFA;
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 3;
  transform: translateX(-50%);
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

/* 吸顶效果 */
.nav-fixed{
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
