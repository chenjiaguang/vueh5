<template>
  <div :style="{height: winHeight + 'px'}">
    <cube-scroll class="outer-scroller" ref="pageScroller" :options="options" @scroll="outerScroll" @pulling-up="onPullingUp(index)">
      <template slot="pulldown" slot-scope="props">
        <div class="cube-pulldown-wrapper" :style="props.pullDownStyle">
          <img v-show="!props.isPullingDown" class="pull-down-icon" :style="{transform: 'translateY(' + props.bubbleY + 'px)'}" :src="$assetsPublicPath + '/cwebassets/image/refresh_icon.png'" />
          <img v-show="props.isPullingDown" class="pull-down-icon refreshing" :src="$assetsPublicPath + '/cwebassets/image/refreshing_icon.png'" />
        </div>
      </template>
      <template slot="pullup" slot-scope="props">
        <div class="cube-pullup-wrapper pullup-wrapper" :style="props.pullUpStyle">
          <div class="pullup-content"><img class="pull-up-icon" :src="$assetsPublicPath + '/cwebassets/image/loading_icon.png'" />正在加载...</div>
        </div>
      </template>
      <header ref="topHeader" class="top-header">
        <div class="top-header-bg" :style="{backgroundImage: 'url(' + user.cover + ')'}">
          <div class="top-header-avatar" :style="{backgroundImage: 'url(' + user.avatar_url + ')', opacity: user.avatar_url ? 1 : 0}"></div>
        </div>
        <div class="top-header-overview">
          <div class="user-name"><span style="vertical-align: middle">{{user.username}}</span><img v-if="user.is_news" class="author-sign" :src="$assetsPublicPath + '/cwebassets/image/author_icon.png'" /></div>
          <div class="user-intro">{{user.intro}}</div>
          <div class="follow-and-fans clearfix">
            <div class="follow-box fl"><span class="follow-and-fans-text">关注</span><span class="follow-and-fans-number">{{followNumber}}</span></div>
            <div class="fans-box fl"><span class="follow-and-fans-text">粉丝</span><span class="follow-and-fans-number">{{fansNumber}}</span></div>
          </div>
          <transition v-if="!user.is_owner" appear appear-class="follow-appear">
            <div class="follow-btn-wrapper">
              <div class="follow-btn" :style="{color: followStatusText === '未关注' ? '#fff' : '#666', backgroundColor: followStatusText === '未关注' ? '#1EB0FD' : '#fff', borderColor: followStatusText === '未关注' ? '#1EB0FD' : '#B7B7B7'}"><i class="iconfont follow-btn-icon" :class="{'icon-jia': followStatusText === '未关注', 'icon-focused': followStatusText === '已关注', 'icon-transform': followStatusText === '互相关注'}"></i>{{followStatusText}}</div>
            </div>
          </transition>
        </div>
      </header>
      <!-- <dynamic-item :itemData="testItem" @changeLike="changeLike" /> -->
      <div class="scroll-wrapper" v-if="tabs && tabs.length > 0">
        <div class="nav-scroll-list-wrap" ref="navWrapper" v-if="tabs && tabs.length > 1">
          <cube-tab-bar v-model="selectedLabel" class="tab-box" @change="changeTabBar">
            <cube-tab v-for="(item) in tabs" ref="tabItem" :label="item.title" :key="item.title">
            </cube-tab>
          </cube-tab-bar>
          <div class="tab-slider">
            <div class="tab-slider-body" ref="tabSlide" :style="{transform: 'translateX(' + tabSlideX + ')'}"></div>
          </div>
          <div class="tab-border"></div>
        </div>
        <div class="tabs-wrapper" ref="slideWrapper">
          <cube-slide ref="slideInstance" :data="tabs" :initialIndex="selectedIdx" :autoPlay="false" :allow-vertical="false" :loop="false" :speed="500" :options="{listenScroll: true, probeType: 3, click: false}" @change="changeSlide" @scroll="slideScroll">
            <cube-slide-item v-for="(item, index) in tabs" :key="index">
              <cube-scroll
                ref="contentScroll"
                :data="tabs[index].data"
                :options="{bounce: false, click: false}">
                <dynamic-item v-for="(item, idx) in tabs[index].data" :key="idx" :itemData="item" @changeLike="changeLike" />
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-scroll>
    <transition name="backtop-fade">
      <i v-if="showBackTop" class="iconfont icon-back_top backtop-icon"></i>
    </transition>
    <i class="iconfont icon-camera publish-icon"></i>
    <download-box />
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DownloadBox from '../../components/DownloadBox'
import DynamicItem from './components/DynamicItem'
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
    data: [
      {
        title: '111111111'
      }
    ]
  },
  {
    title: '文章',
    data: [
      {
        title: '2222222222'
      }
    ]
  }
]
const imgs = [
  {
    url: 'http://om0jxp12h.bkt.clouddn.com/toutiao_12.JPG'
  },
  {
    url: 'http://om0jxp12h.bkt.clouddn.com/toutiao_21.JPG'
  },
  {
    url: 'http://om0jxp12h.bkt.clouddn.com/toutiao_31.JPG'
  },
  {
    url: 'http://om0jxp12h.bkt.clouddn.com/toutiao_21.JPG'
  }
]
const txts = ['关注', '推荐', '新时代', '热点', '体育', '娱乐', '科技', '头条号', '问答', '国际', 'cube-ui666']
let cnt = 1
export default {
  data() {
    return {
      lastYear: '',
      user: {
        is_owner: true
      },
      dynamic: [],
      dynamicPaging: {},
      article: [],
      articlePaging: {},
      activityItem: {
        id: 74,
        cover: 'http://img.qikula.com/file/image/pic/1a485694362n61804661c27.jpg',
        title: '夏日沙滩排球大作战，我的战队等你来约，兄弟就差你了！',
        address: '海口市秀英区滨海大道假日海滩夏日烧烤园A12区水电费就算了收到了房间收到了饭是',
        time: '01-03 18:30 至 05-06 18:30',
        fee: '65起',
        status: '进行中'
      },
      showBackTop: false,
      testItem: {
        theme: [
          {
            id: 1,
            title: '舌尖上的海口'
          },
          {
            id: 2,
            title: '海南生活'
          },
          {
            id: 3,
            title: '治理熊孩子'
          }
        ],
        circle_name: '舌尖上的海鸥',
        is_like: false,
        like_number: 4,
        comment_number: 6,
        address: '海口世贸北路一号椰风海岸二期',
        activity: '啤酒与烧烤，夏日里的绝佳搭配。约吗？快来加入我们吧阿斯顿了开发建设的收到了副科级',
        name: '测试名字',
        time_text: '2018-08-05',
        content_text: '动态的内容动态的内容动态的内容动态的内容动态的内容动水电费水电费上课地方失联飞机阿失联飞机阿失联飞机阿市领导发就阿市领导开发就阿市领导发  老师看大家发拉屎阿酸辣粉 爱上 发生的福利态的内容动态的内容动态的内容动态的内容动态的内容',
        avatar: 'http://img.qikula.com/file/image/pic/1a485694362n61804661c27.jpg',
        is_long_dynamic: true,
        is_manager: true,
        is_owner: true,
        is_settop: true,
        pictrues: [
          {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533548953876&di=179b3cf1aa8604adcdf1654a5c0650b9&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F7acb0a46f21fbe09334115c061600c338644adc3.jpg',
            width: 1200,
            height: 720
          },
          {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533549055739&di=7e26cb3f8760b42ca4d043f91c6a2140&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4a36acaf2edda3ccd53548ea0be93901203f9223.jpg',
            width: 1200,
            height: 675
          },
          {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533549104992&di=e8a8aa74591a4982dc6324ba4e429b12&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fac4bd11373f0820207282ceb41fbfbedaa641baf.jpg',
            width: 1200,
            height: 750
          },
          {
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533549171335&di=aa3f0a281a41cfb2f189abbcd47e45ca&imgtype=0&src=http%3A%2F%2Fa3.topitme.com%2Fa%2Fff%2Fc8%2F1183976520bfec8ffao.jpg',
            width: 1500,
            height: 2120
          },
          {
            url: 'http://img.zcool.cn/community/01247f5991c8d40000002129fce48c.jpg',
            width: 1000,
            height: 6047
          }
        ],
        with_article: {
          title: '测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题测试文章标题',
          cover: 'http://img.zcool.cn/community/01247f5991c8d40000002129fce48c.jpg'
        }
      },
      userHeader: {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533549055739&di=7e26cb3f8760b42ca4d043f91c6a2140&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4a36acaf2edda3ccd53548ea0be93901203f9223.jpg',
        avatar: 'http://img.zcool.cn/community/01247f5991c8d40000002129fce48c.jpg',
        is_author: true,
        user_name: '追逐繁星的孩子',
        user_intro: '海南有趣、有料、有温度的生活圈，分分钟带你吃遍全海南吃遍全海南',
        follow_number: 9999,
        fans_number: 12456,
        is_fans: false,
        is_follow: true
      },
      winHeight: window.innerHeight,
      tabs: tabs,
      selectedLabel: '动态',
      content: imgs.slice(),
      selectedIdx: 0,
      tabSlideX: -window.innerWidth + 'px',
      options: {
        pullDownRefresh: false,
        pullUpLoad: {
          threshold: (window.innerWidth / 750) * 128
        }
      },
      timer: null
    }
  },
  components: {DownloadBox, DynamicItem},
  methods: {
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
    fetchList (tabIdx, pn) {
      let _type = tabIdx === 0 ? 1 : 2
      let rData = { // type  1,动态  2,文章
        id: this.$route.query.user_id,
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U',
        type: _type,
        pn: pn,
        limit: 10,
        lastYear: ''
      }
      this.$ajax('/jv/user/social', {data: rData}).then(res => {
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.user = res.data.user
          this.lastYear = res.data.lastYear
          if (_type === 1) { // 请求的数据是动态
            if (pn === 1) { // 加载第一页时
              this.tabs[0] = {
                title: '动态',
                data: res.data.list,
                paging: res.data.paging
              }
              if (!res.data.user.has_articles) { // 没有文章tab时
                this.tabs.splice(1, 1)
              } else { // 有文章tab时
                this.tabs[1] = this.tabs[1] || {
                  title: '文章',
                  data: [],
                  paging: {}
                }
              }
            } else {
              this.tabs[0].data = this.tabs[0].data.concat(res.data.list)
              this.tabs[0].data.paging = res.data.paging
              if (!res.data.user.has_articles) { // 没有文章tab时
                this.tabs.splice(1, 1)
              } else { // 有文章tab时
                this.tabs[1] = this.tabs[1] || {
                  title: '文章',
                  data: [],
                  paging: {}
                }
              }
            }
          } else if (_type === 2) { // 请求的数据是文章
            if (pn === 1) { // 加载第一页时
              if (res.data.user.has_articles) { // 有文章tab时
                this.tabs[1] = {
                  title: '文章',
                  data: [],
                  paging: {}
                }
              } else { // 没有文章tab时
                this.tabs.splice(1, 1)
              }
            } else {
              if (res.data.user.has_articles) { // 有文章tab时
                this.tabs[1].data = this.tabs[1].data.concat(res.data.list)
                this.tabs[1].data.paging = res.data.paging
              } else { // 没有文章tab时
                this.tabs.splice(1, 1)
              }
            }
          }
        }
      }).catch(err => {

      })
    },
    fetchDynamic (pn) {
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.$route.query.circle_id,
        snapshot: '0',
        token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U'
      }
      this.$ajax('/jv/qz/v21/circledynamics', {data: rData}).then(res => { // 获取动态列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.circle = res.data
          if (res.data.user_can_create_activity) { // 有活动tab
            this.tabs = [
              {
                title: '动态',
                data: []
              },
              {
                title: '活动',
                data: []
              }
            ]
            this.tabSlideX = (window.innerWidth / this.tabs.length / 2) + 'px'
          } else { // 无活动tab
            this.tabs = [
              {
                title: '动态',
                data: []
              }
            ]
            this.tabSlideX = (window.innerWidth / this.tabs.length / 2) + 'px'
          }
        }
      }).catch(err => {

      })
    },
    fetchActivity (pn) {
      let rData = {
        pn: pn,
        limit: 20,
        cid: this.$route.query.circle_id,
        snapshot: '0'
      }
      this.$ajax('/jv/qz/v21/circleactivities', {data: rData}).then(res => { // 获取活动列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !Boolean(res.error) && res.data) { // 成功获取数据
          this.circle = res.data
          if (res.data.user_can_create_activity) { // 有活动tab
            this.tabs = [
              {
                title: '动态',
                data: []
              },
              {
                title: '活动',
                data: []
              }
            ]
            this.tabSlideX = (window.innerWidth / this.tabs.length / 2) + 'px'
          } else { // 无活动tab
            this.tabs = [
              {
                title: '动态',
                data: []
              }
            ]
            this.tabSlideX = (window.innerWidth / this.tabs.length / 2) + 'px'
          }
        }
      }).catch(err => {

      })
    },
    initSlideBlock () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.$refs['tabItem']) {
          let pos = this.$refs['tabItem'][0].$el.getBoundingClientRect()
          let slideX = pos.x + pos.width / 2
          this.tabSlideX = slideX + 'px'
          clearInterval(this.timer)
        }
      },30)
    },
    onPullingDown (idx) {
      if (idx === 0) { // 动态列表
        this.fetchDynamic(1)
      } else if (idx === 1) { // 活动列表
        this.fetchActivity(1)
      }
      setTimeout(() => {
        // let tabs = this.tabs
        this.tabs[idx].data.unshift({title: 'sdfsdfsdf'})
        // this.tabs = tabs
        this.$refs['contentScroll'][idx].scrollTo(0, 0, 500)
        // this.$refs['contentScroll'][idx].forceUpdate()
      }, 1000)
    },
    onPullingUp (idx) {
      setTimeout(() => {
        this.tabs[idx].data = this.tabs[idx].data.concat({title: 'sdfsdfsdf'})
        this.$refs['contentScroll'][idx].forceUpdate()
      }, 1000)
    },
    changeLike () {
      if (this.testItem.is_like) {
        this.testItem.is_like = false
        this.testItem.like_number -= 1
      } else {
        this.testItem.is_like = true
        this.testItem.like_number += 1
      }
    },
    outerScroll ({x, y}) {
      if (-y > this.winHeight) { // 超过半屏显示返回顶部
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    },
    test () {
      console.log('test')
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
      } else if (!this.user.is_being_followed) { // 已关注该用户，但该用户未关注我
        text = '已关注'
      } else if (this.user.isFriend) { // 已关注该用户，且该用户关注我
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
}
.follow-btn-icon{
  font-size: 66px;
  color: inherit;
  margin-right: 9px;
}
.nav-scroll-list-wrap{
  position: relative;
  background-color: #fff;
}
.tab-box{
  height: 88px;
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
  height: 228px;
  position: relative;
}
.pullup-content{
  position: absolute;
  margin-top: -64px;
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
</style>