<template>
  <div class="toutiao">
    <header ref="topHeader" class="top-header"><img src="http://om0jxp12h.bkt.clouddn.com/toutiao_header2.png" style="width: 100%; height: 100%;"></header>
    <div class="nav-scroll-list-wrap">
      <cube-tab-bar v-model="selectedLabel" showSlider>
        <cube-tab v-for="(item) in tabs" :label="item.title" :key="item.title">
        </cube-tab>
      </cube-tab-bar>
      <div class="tab-slider">
        <div class="tab-slider-body"></div>
      </div>
    </div>
    <div class="tabs-wrapper">
      <cube-slide ref="slide" :autoPlay="false" :allow-vertical="false" :loop="false" :options="{listenScroll: true, probeType: 3}" @change="changePage" @scroll="tabScroll">
        <cube-slide-item v-for="(item, index) in tabs" :key="item.title" @click.native="clickHandler(item, index)">
          <div v-for="(item, idx) in item.data" :key="idx">{{item.title}}</div>
        </cube-slide-item>
      </cube-slide>
    </div>
    <div class="content-scroll-wrapper">
      <div class="content-scroll-list-wrap" ref="scrollWrapper">
        <cube-scroll
          ref="contentScroll"
          :data="content"
          :options="options"
          @pulling-down="onPullingDown"
          @pulling-up="onPullingUp">
          <ul class="imgs-wrapper">
            <li v-for="(item, index) in content" :key="index" class="imgs-item">
              <img :src="item.url">
            </li>
          </ul>
          <template slot="pulldown" slot-scope="props">
            <div v-if="props.pullDownRefresh"
              class="cube-pulldown-wrapper"
              :style="props.pullDownStyle">
              <div v-if="props.beforePullDown"
                class="before-trigger"
                :style="{paddingTop: props.bubbleY + 'px'}">
                <span :class="{rotate: props.bubbleY > 0}">↓</span>
              </div>
              <div class="after-trigger" v-else>
                <div v-show="props.isPullingDown" class="loading">
                  <cube-loading></cube-loading>
                </div>
                <transition name="success">
                  <div v-show="!props.isPullingDown" class="text-wrapper"><span class="refresh-text">今日头条推荐引擎有x条更新</span></div>
                </transition>
              </div>
            </div>
          </template>
        </cube-scroll>
      </div>
    </div>
    <footer ref="footer" class="bottom-footer"><img src="http://om0jxp12h.bkt.clouddn.com/toutiao_footer2.png" style="width: 100%; height: 100%;"></footer>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import {
    /* eslint-disable no-unused-vars */
    Style,
    Scroll,
    Loading,
    TabBar,
    TabPanels,
    Slide
  } from 'cube-ui'
Vue.use(Scroll)
Vue.use(Loading)
Vue.use(TabBar)
Vue.use(TabPanels)
Vue.use(Slide)
const tabs = [
  {
    title: '动态',
    data: [
      {title: 'tab1 title1'},
      {title: 'tab1 title2'},
      {title: 'tab1 title3'},
      {title: 'tab1 title4'},
      {title: 'tab1 title5'},
      {title: 'tab1 title6'},
      {title: 'tab1 title7'},
      {title: 'tab1 title8'},
      {title: 'tab1 title9'},
      {title: 'tab1 title10'},
      {title: 'tab1 title11'},
      {title: 'tab1 title12'},
      {title: 'tab1 title13'}
    ]
  },
  {
    title: '活动',
    data: [
      {title: 'tab2 title1'},
      {title: 'tab2 title2'},
      {title: 'tab2 title3'},
      {title: 'tab2 title4'},
      {title: 'tab2 title5'},
      {title: 'tab2 title6'},
      {title: 'tab2 title7'},
      {title: 'tab2 title8'},
      {title: 'tab2 title9'},
      {title: 'tab2 title10'},
      {title: 'tab2 title11'},
      {title: 'tab2 title12'},
      {title: 'tab2 title13'}
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
      tabs: tabs,
      selectedLabel: '动态',
      content: imgs.slice(),
      options: {
        pullDownRefresh: {
          threshold: 60,
          // stop: 44,
          stopTime: 1000,
          txt: '更新成功'
        },
        pullUpLoad: true
      },
      navTxts: txts,
      secondStop: 26
    }
  },
  methods: {
    changePage (idx) {
      console.log('changePage', idx)
    },
    clickHandler (item, idx) {
      console.log('clickHandler', item, idx)
    },
    tabScroll ({x, y}) {
      console.log('event', x, y)
    },
    onPullingDown() {
      setTimeout(() => {
        this.content.unshift(imgs[cnt++ % 3])
        this.$refs.contentScroll.scrollTo(0, this.secondStop, 300)
      }, 1000)
    },
    onPullingUp() {
      setTimeout(() => {
        this.content = this.content.concat(imgs)
      }, 1000)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.toutiao{
  width: 100%;
  height: 100%;
}
.top-header{
  width: 100%;
  height: 288px;
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
</style>