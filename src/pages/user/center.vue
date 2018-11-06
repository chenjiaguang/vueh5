<template>
  <div class="user-center-page mescroll" id="user-center">
    <div ref="topBanner">
      <download-box v-if="$route.query.isShareOpen && !$isApp" />
      <header ref="topHeader" class="top-header" :style="{backgroundImage: 'url(' + user.cover + ')'}">
        <div class="top-header-content">
          <div class="top-header-left">
            <div class="name-and-gender">
              <div class="user-name">{{user.chatNickName || user.username}}</div>
            </div>
            <div class="constellation-and-location" v-if="user.constellation || user.location || (user.sex && (user.sex.toString() === '1' || user.sex.toString() === '2'))">
              <div class="user-constellation" v-if="user.constellation">
                <i v-if="user.sex && (user.sex.toString() === '1' || user.sex.toString() === '2')" class="user-gender iconfont" :class="{'icon-gender1': user.sex && user.sex.toString() === '1', 'icon-gender2': user.sex && user.sex.toString() === '2'}"></i>
                <i v-if="user.sex && (user.sex.toString() === '1' || user.sex.toString() === '2') && user.constellation" class="separator-dot iconfont icon-dian"></i>
                <span class="user-constellation-text" v-if="user.constellation">{{user.constellation}}</span>
              </div>
              <div class="user-location" v-if="user.location"><span>{{user.location}}</span></div>
            </div>
            <div class="vip-user" v-if="user.is_vip_user"><i class="iconfont icon-vip vip-icon"></i>{{user.vip_intro}}</div>
            <div class="user-intro">{{user.intro}}</div>
            <div class="focus-and-fans">
              <div class="user-follow"><span class="follow-text">关注</span><span class="num">{{followNumber}}</span></div>
              <div class="user-fans"><span class="fans-text">粉丝</span><span class="num">{{fansNumber}}</span></div>
            </div>
          </div>
          <div class="top-header-right">
            <div class="top-header-avatar" :style="{backgroundImage: 'url(' + user.avatar_url + ')', opacity: user.avatar_url ? 1 : 0}"></div>
            <transition v-if="!user.is_owner" appear appear-class="follow-appear">
              <div @click="changeFollow" class="follow-btn" :style="{backgroundColor: followStatusText === '关注' ? '#1EB0FD' : '#B2B2B2'}"><i class="iconfont follow-btn-icon" :class="{'icon-add': followStatusText === '关注', 'icon-focused': followStatusText === '已关注', 'icon-transform': followStatusText === '互相关注'}"></i>关注</div>
            </transition>
          </div>
        </div>
      </header>
    </div>
    <div class="nav-wrap" ref="navWrapper" :style="{height: tabBarHeight + 'px', zIndex: '99999'}" v-if="tabs && tabs.length > 1 && showTabbar">
      <div class="nav-content" ref="navContent" :style="{height: tabBarHeight + 'px'}">
        <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar" :style="{height: tabBarHeight + 'px'}">
          <cube-tab v-for="(item) in tabs" ref="tabItem" :label="item.title" :key="item.title">
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
            <!-- 资料 -->
            <div v-if="tabs[index].paging.pn && index === 0" :style="{backgroundColor: '#fff'}">
              <div class="gray-block"></div>
              <div class="info-relationship" v-if="!user.is_owner">
                <div class="info-title">关系<div class="border-bottom"></div></div>
                <div>
                  <div class="relationship-item" v-if="tabs[index].data.isChatFriend">
                    <div class="relation-left">好友</div>
                    <div class="relation-right">已经是好友啦</div>
                  </div>
                  <div class="relationship-item" v-else @click.stop="beFriend">
                    <div class="relation-left">好友</div>
                    <div class="relation-right relationship-space-between"><span class="space-between-flex1">看了这么久，不如加好友？</span><i class="iconfont icon-goforward space-between-flex0"></i></div>
                  </div>
                  <div class="relationship-item" v-if="tabs[index].data.isChatFriend && tabs[index].data.chatNickName">
                    <div class="relation-left">备注</div>
                    <div class="relation-right">{{tabs[index].data.chatNickName}}</div>
                  </div>
                  <div class="relationship-item" v-if="tabs[index].data.isChatFriend && tabs[index].data.chatPhone">
                    <div class="relation-left">电话</div>
                    <a class="relation-right" style="color:#507DAF" :href="'tel:' + (tabs[index].data.chatPhone)">{{tabs[index].data.chatPhone}}</a>
                  </div>
                </div>
                <div class="gray-block"></div>
              </div>
              <div class="info-base">
                <div class="info-title">基本信息<div class="border-bottom"></div></div>
                <div>
                  <div class="relationship-item">
                    <div class="relation-left">昵称</div>
                    <div class="relation-right">{{tabs[index].data.username}}</div>
                  </div>
                  <div class="relationship-item">
                    <div class="relation-left">性别</div>
                    <div class="relation-right">{{setText[tabs[index].data.sex.toString()] || '保密'}}</div>
                  </div>
                  <div class="relationship-item">
                    <div class="relation-left">星座</div>
                    <div class="relation-right">{{tabs[index].data.constellation || '还没被人类发现的星座'}}</div>
                  </div>
                   <div class="relationship-item">
                    <div class="relation-left">地区</div>
                    <div class="relation-right">{{tabs[index].data.location || '可能不在地球上'}}</div>
                  </div>
                  <div class="relationship-item">
                    <div class="relation-left">等级</div>
                    <div class="relation-right">LV.{{tabs[index].data.level}}</div>
                  </div>
                </div>
                <div class="gray-block"></div>
              </div>
              <div class="info-intro">
                <div class="info-title">签名<div class="border-bottom"></div></div>
                <div class="info-slogen-text">{{tabs[index].data.intro || 'TA很低调，什么都没写'}}</div>
                <div class="gray-block"></div>
              </div>
            </div>
            <!-- 动态 -->
            <div v-else-if="tabs[index].paging.pn && index === 1 && tabs[index].data && tabs[index].data.length !== 0" :style="{backgroundColor: '#fff'}">
              <div class="gray-block"></div>
              <dynamic-item v-for="(item, idx) in tabs[index].data" :key="item.id" :itemData="item" :hideBlock="idx === tabs[index].data.length - 1" :router="$router" @changeLike="(data) => changeLike(data, index)" />
            </div>
            <!-- 文章 -->
            <div v-else-if="tabs[index].paging.pn && index === 2 && tabs[index].data && tabs[index].data.length !== 0" :style="{backgroundColor: '#fff'}">
              <div class="gray-block"></div>
              <article-item v-for="item in tabs[index].data" :key="item.id" :itemData="item" />
            </div>
            <div v-else-if="tabs[index].paging.is_end && tabs[index].data && tabs[index].data.length === 0" class="empty-box">
              <!-- <img :src="$assetsPublicPath + '/cwebassets/image/empty_dynamic.png'" class="empty-image" /> -->
              TA很神秘，什么都没有发
            </div>
            <!-- <div v-else class="empty-box" :style="{minHeight: ($winHeight - ((tabs && tabs.length) > 1 ? tabBarHeight : 0)) + 1 + 'px'}">
              TA很神秘，什么都没有发
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <scroll-to-top v-if="mescroll && mescroll.length > 0" :visible="showBackTop" :position="{bottom: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 178, right: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 54}" :scroll="mescroll[0]"/>
  </div>
</template>

<script type="text/ecmascript-6">
// import 'swiper/dist/css/swiper.css'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Vue from 'vue'
import DownloadBox from '../../components/DownloadBox'
import DynamicItem from './components/DynamicItem'
import ArticleItem from './components/ArticleItem'
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
  beingFriend: false,
  showBackTop: false,
  lastYear: '',
  user: {
    is_owner: true
  },
  setText: {
    1: '男',
    2: '女'
  },
  emptyText: {
    0: '获取用户资料失败',
    1: 'TA很神秘，什么都没有发',
    2: 'TA很神秘，什么都没有发'
  },
  tabs: [
    {
      title: '资料',
      data: {},
      paging: {},
      fetching: false,
      scrollTop: 0
    },
    {
      title: '动态',
      data: [],
      paging: {},
      fetching: false,
      scrollTop: 0
    },
    {
      title: '文章',
      data: [],
      paging: {},
      fetching: false,
      scrollTop: 0
    }
    // 目前只显示动态
  ],
  // swiperOption: {},
  tabBarHeight: parseInt((maxWidth / 750) * 88),
  selectedLabel: '动态',
  selectedIdx: 1,
  tabSlideX: -window.innerWidth + 'px',
  timer: null,
  following: false,
  showTabbar: false,
  showBanner: true,
  pageTop: 0,
  mescroll: []
}
export default {
  mixins: [MeScrollSupportArr, WeixinShareInKeepAlive],
  data () {
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let selectedIdx = parseInt(this.$route.query.jump_tab || 1)
    console.log('selectedIdx', selectedIdx)
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
  components: {DownloadBox, DynamicItem, ArticleItem, LoadingView, ScrollToTop},
  watch: {
    '$route': function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'UserCenter', ['user_id', 'jump_tab'], () => {
        this.refreshData()
      },
      () => {
        this.runShareBindfunction()
      })
    },
    'user.username': function (val, oldval) {
      document.title = val || '范团名片'
    }
  },
  methods: {
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
          if (!this.tabs[index].paging.pn) {
            console.log('111')
            if (index === 0) {
              this.fetchUserInfo(true)
            } else if (index === 1) {
              this.fetchDynamicList(1)
            } else if (index === 2) {
              this.fetchArticleList(1)
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
    fetchUserInfo (islist) { // 获取用户资料
      console.log('获取用户资料')
      if (this.tabs[0].fetching) { // 正在拉取动态数据
        this.mescroll[0].endErr()
        return false
      }
      let rData = {
        id: this.$route.query.user_id
      }
      this.tabs[0].fetching = true
      this.$ajax('/jv/anonymous/user/social/data', {data: rData}).then(res => {
        console.log('fetchUserInfo.res', res)
        this.tabs[0].fetching = false
        if (res && !res.error && res.data) {
          if (this.$isApp) {
            let {id, is_news} = res.data.user
            this.$appCall('h5GoUserCenter', id, is_news, '1') // type传1
          }
          if (res.data.user) {
            this.user = res.data.user
            this.showTabbar = true
            if (!res.data.user.has_articles) { // 没有文章tab
              this.tabs.splice(2, 1)
            }
            this.$nextTick(this.setSticky)
            if (islist) { // 列表调用的时候该参数位true,否则为false
              this.tabs[0].data = res.data.user
              this.tabs[0].paging.pn = 1
              this.tabs[0].paging.is_end = true
              this.$nextTick(() => {
                console.log('endSuccess-fetchUserInfo')
                this.mescroll[0].endSuccess(1, false)
                this.mescroll[0].showNoMore()
              })
            }
          }
        }
      }).catch(err => {
        this.showTabbar = true
        this.$nextTick(this.setSticky)
        this.mescroll[0].endErr()
        console.log('err')
      })
    },
    fetchDynamicList (pn) {
      if (this.tabs[1].fetching) { // 正在拉取动态数据
        this.mescroll[0].endErr()
        return false
      }
      let rData = { // type  1,动态  2,文章
        id: this.$route.query.user_id,
        pn: pn,
        snapshot: this.tabs[1].paging.snapshot || '',
        limit: 10,
        lastYear: ''
      }
      this.tabs[1].fetching = true
      this.$ajax('/jv/anonymous/user/social/dynamic', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          if (this.$isApp) {
            let {id, is_news} = res.data.user
            this.$appCall('h5GoUserCenter', id, is_news, '1') // type传1
          }
          this.lastYear = res.data.lastYear
          this.tabs[1].paging = res.data.paging
          this.tabs[1].fetching = false
          this.showTabbar = true
          if (pn === 1) { // 第一页
            this.tabs[1].data = res.data.list
            this.setShareData({
              type: '',
              title: res.data.shareInfo.shareTitle,
              desc: res.data.shareInfo.shareContent,
              url: res.data.shareInfo.shareUrl,
              imgUrl: res.data.shareInfo.shareImage
            })
          } else { // 非第一页
            this.tabs[1].data = this.tabs[1].data.concat(res.data.list)
          }
          if (res.data.paging.is_end) {
            this.mescroll[0].showNoMore()
          }
          this.$nextTick(() => {
            this.setSticky()
            console.log('endSuccess-fetchDynamicList')
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
          })
        } else {
          this.tabs[1].fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.tabs[1].fetching = false
        this.$nextTick(this.setSticky)
        this.mescroll[0].endErr()
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取用户数据失败')
        }
      })
    },
    fetchArticleList (pn) { // 获取文章列表
      console.log('获取文章列表')
      if (this.tabs[2].fetching) { // 正在拉取动态数据
        this.mescroll[0].endErr()
        return false
      }
      let rData = { // type  1,动态  2,文章
        id: this.$route.query.user_id,
        pn: pn,
        snapshot: this.tabs[2].paging.snapshot || '',
        limit: 10,
        lastYear: ''
      }
      this.tabs[2].fetching = true
      this.$ajax('/jv/anonymous/user/social/article', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          if (this.$isApp) {
            let {id, is_news} = res.data.user
            this.$appCall('h5GoUserCenter', id, is_news, '1') // type传1
          }
          this.lastYear = res.data.lastYear
          if (res.data.user) {
            this.user = res.data.user
          }
          this.tabs[2].paging = res.data.paging
          this.tabs[2].fetching = false
          this.showTabbar = true
          if (pn === 1) { // 第一页
            this.tabs[2].data = res.data.list
            this.setShareData({
              type: '',
              title: res.data.shareInfo.shareTitle,
              desc: res.data.shareInfo.shareContent,
              url: res.data.shareInfo.shareUrl,
              imgUrl: res.data.shareInfo.shareImage
            })
          } else { // 非第一页
            this.tabs[2].data = this.tabs[2].data.concat(res.data.list)
          }
          if (res.data.paging.is_end) {
            this.mescroll[0].showNoMore()
          }
          this.$nextTick(() => {
            this.setSticky()
            console.log('endSuccess-fetchArticleList')
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
          })
        } else {
          this.tabs[2].fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.tabs[2].fetching = false
        this.$nextTick(this.setSticky)
        this.mescroll[0].endErr()
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
        const initialTab = parseInt(this.$route.query.jump_tab || 1)
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
      let selectedIdx = parseInt(this.$route.query.jump_tab || 1)
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
      // if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1') { // 初始tab为1
      //   this.initMeScroll(1)
      // } else if ((!this.$route.query.jump_tab || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0'))) { // 初始tab为0
      //   this.initMeScroll(0)
      // }
      // 目前只显示动态
      // this.fetchUserInfo()
      this.initMeScroll()
      this.initSlideBlock()
    },
    onPullingDown () {
      if (this.selectedIdx === 1) {
        this.fetchDynamicList(1)
      } else if (this.selectedIdx === 2) { // 拉取文章列表
        this.fetchUserInfo(true)
      } else if (this.selectedIdx === 0) { // 拉去用户资料
        this.fetchArticleList(1)
      }
    },
    onPullingUp () {
      let idx = this.selectedIdx
      if (!(this.tabs[idx].paging && this.tabs[idx].paging.pn && !this.tabs[idx].paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        this.mescroll[idx].endErr()
        return false
      }
      let pn = parseInt(this.tabs[idx].paging.pn) + 1
      if (idx === 0) {
        this.fetchUserInfo(true)
      } else if (idx === 1) {
        this.fetchDynamicList(pn)
      } else if (idx === 2) {
        this.fetchArticleList(pn)
      }
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
    initMeScroll () {
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
      this.mescroll[0] = new MeScroll('user-center', {down: _down, up: _up})
      if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '2') { // 初始tab为2
        this.fetchArticleList(1)
      } else if ((!this.$route.query.jump_tab) || (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '1')) { // 初始tab为1
        this.fetchDynamicList(1)
      } else if (this.$route.query.jump_tab && this.$route.query.jump_tab.toString() === '0') { // 初始tab为0
        this.fetchUserInfo(true)
      }
    },
    beFriend () { // 申请成为好友
      console.log('申请成为好友')
      if (this.beingFriend) { // 正在申请则不做任何回应
        return false
      }
      this.$prompt.showPrompt({contentText: '向TA发送好友申请？', leftText: '取消', rightText: '发送'}, () => {
        this.requestFriend()
      }, () => {
        console.log('cancel')
      })
    },
    requestFriend () {
      let rData = {
        toId: this.user.id
      }
      this.beingFriend = true
      this.$ajax('/jv/user/friend/apply', {data: rData}).then(res => {
        this.beingFriend = false
        if (res && !res.error) { // 发送成功
          this.$toast('发送成功，耐心等待一下吧~')
        }
      }).catch(err => {
        this.beingFriend = false
        console.log('err', err)
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
    // this.fetchUserInfo()
    this.fetchUserInfo(false)
    this.initMeScroll()
    this.initSlideBlock()
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
  overflow-y: auto;
  overflow-x: hidden;
  background: #F2F2F2;
}
.outer-scroller{
  width: 100%;
}
.top-header{
  width: 100%;
  height: 332px;
  background-color:#292929;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.top-header-content{
  width: 100%;
  height: 100%;
  box-sizing: content-box;
  position: relative;
  display: flex;
  background: rgba(0,0,0,0.1);
}
.top-header-left{
  width: 68%;
  flex-grow: 0;
  flex-shrink: 0;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.top-header-right{
  width: 32%;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
.top-header-avatar{
  width: 172px;
  height: 172px;
  border: 4px solid #fff;
  border-radius: 50%;
  margin: 44px 0 24px;
  box-sizing: content-box;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.focus-and-fans{
  height: 88px;
  display: flex;
  padding: 0 10px;
  margin-top: 8px;
}
.top-header-bg{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 386px;
}
.user-follow, .user-fans{
  padding: 0 20px;
  font-size: 24px;
  display: flex;
  align-items: center;
  position: relative;
}
.user-fans:before{
  content: "";
  display: block;
  width: 2px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -10px;
  background: #fff;
}
.follow-text, .fans-text{
  margin-top: 4px;
}
.num{
  font-size: 36px;
  font-weight: bold;
  margin-left: 10px;
}
.name-and-gender{
  width: 100%;
  display: flex;
  font-size: 42px;
  line-height: 58px;
  align-items: center;
  padding-left: 30px;
}
.user-name{
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-gender{
  flex-shrink: 0;
  font-size: 24px;
  line-height: 32px;
}
.separator-dot{
  font-size: 24px;
  margin: 0 -2px;
  line-height: 32px;
}
.user-constellation-text{
  font-size: 24px;
  line-height: 32px;
}
.constellation-and-location{
  width: 100%;
  display: flex;
  font-size: 24px;
  line-height: 32px;
  padding: 8px 0 8px 20px;
  overflow: hidden;
}
.user-constellation, .user-location{
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 20px;
  background: rgba(0,0,0,0.3);
  margin-left: 10px;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.3);
  box-sizing: content-box;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.user-location{
  flex-shrink: 1;
  overflow: hidden;
}
.user-location span{
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.vip-user{
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  line-height: 40px;
  padding-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vip-icon{
  font-size: 24px;
  margin-right: 8px;
  color: #33C8FE;
}
.user-intro{
  font-size: 24px;
  line-height: 30px;
  margin: 5px 0 5px 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
}
.follow-btn{
  width: 128px;
  height: 60px;
  line-height: 60px;
  transform-origin: 0 0;
  border-radius: 30px;
  font-size: 24px;
  text-align: center;
  transition: all 500ms;
  color: #fff;
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
.follow-btn-icon{
  font-size: 20px;
  color: inherit;
  margin-right: 6px;
}

.info-relationship{
  background: #fff;
}
.gray-block{
  height: 16px;
  background: #F2F2F2;
}
.info-title{
  position: relative;
  text-indent: 50px;
  height: 96px;
  line-height: 96px;
  font-size: 28px;
  color: #111111;
  font-weight: bold;
  background: #fff;
}
.info-title:before{
  content: "";
  display: block;
  width: 6px;
  height: 24px;
  border-radius: 3px;
  background: #FEDE3B;
  position: absolute;
  left: 30px;
  top: 50%;
  margin-top: -12px;
}
.info-title .border-bottom{
  width: 100%;
  height: 2px;
  background: #E5E5E5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(1, 0.5);
}
.relationship-item{
  margin-left: 30px;
  font-size: 30px;
  height: 102px;
  line-height: 102px;
  display: flex;
  position: relative;
}
.relationship-item:before{
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background: #E5E5E5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scale(1, 0.5);
}
.relationship-item:last-child:before{
  display: none;
}
.relation-left{
  width: 140px;
  color: #111;
  flex-shrink: 0;
  flex-grow: 0;
}
.relation-right{
  color: #666;
  flex-grow: 1;
  flex-shrink: 1;
}
.relation-right .icon-goforward{
  font-size: 24px;
}
.relationship-space-between{
  display: flex;
  justify-content: space-between;
}
.space-between-flex1{
  flex-shrink: 1;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.icon-goforward{
  margin-right: 30px;
}
.space-between-flex0{
  flex-shrink: 0;
  flex-grow: 0;
}
.info-slogen-text{
  font-size: 30px;
  line-height: 36px;
  padding: 34px 30px;
  color: #666;
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
  padding: 130px 0 0 0;
  font-size: 34px;
  line-height: 58px;
  color: #999;
  text-align: center;
}
.empty-image{
  display: block;
  width: 240px;
  height: 240px;
  height: 240px;
  margin: 0 auto;
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
