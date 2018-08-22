<template>
  <div :style="{height: widHeight + 'px'}">
    <cube-scroll :data="dynamic" class="activity-dynamic" ref="pageScroller" :scrollEvents="['scroll']" :options="options" @scroll="pageScroll" @pulling-up="onPullingUp">
      <div ref="topBanner">
        <download-box />
      </div>
      <transition name="loading-scale">
        <div class="first-loading-box" v-if="!paging.pn">
          <loading-view />
        </div>
      </transition>
      <dynamic-item v-for="(item, idx) in dynamic" :key="idx" :itemData="item" :router="$router" @changeLike="changeLike" />
      <template slot="pullup" slot-scope="props">
        <!-- 可以下拉继续加载 -->
        <div class="cube-pullup-wrapper pullup-wrapper" :style="props.pullUpStyle" v-if="paging && paging.pn && !paging.is_end">
          <div class="pullup-content"><img class="pull-up-icon" :src="$assetsPublicPath + '/cwebassets/image/loading_icon.png'" />正在加载...</div>
        </div>
        <!-- 加载完无数据 -->
        <div v-else-if="paging && paging.is_end && dynamic && dynamic.length === 0" style="height: 0;"></div>
        <!-- 其他情况 -->
        <div v-else class="pullup-wrapper">
          <div class="pullup-content">再刷也没有了</div>
        </div>
      </template>
    </cube-scroll>
    <scroll-to-top :visible="showBackTop" :position="{bottom: (winWidth / 750) * 178, right: (winWidth / 750) * 54}" :scroll="$refs['pageScroller']"/>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DynamicItem from './components/DynamicItem'
import DownloadBox from '@/components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import {
  /* eslint-disable no-unused-vars */
  Style,
  Scroll
} from 'cube-ui'
Vue.use(Scroll)

const initialData = {
  showBackTop: false,
  dynamic: [],
  paging: {},
  fetching: false,
  winWidth: window.innerWidth,
  widHeight: window.innerHeight,
  options: {
    pullDownRefresh: false,
    pullUpLoad: {
      threshold: (window.innerWidth / 750) * 100
    },
    probType: 3,
    stopPropagation: true
  }
}
export default {
  data () {
    let _initialData = JSON.parse(JSON.stringify(initialData))
    return _initialData
  },
  components: {DynamicItem, DownloadBox, LoadingView, ScrollToTop},
  watch: {
    '$route': function (val, oldVal) {
      if (!val.query.previewImage && oldVal.query.previewImage) { // 点击大图后返回
        if (window.previewImageId) {
          this.$previewImage.hide(window.previewImageId)
          window.previewImageId = null
        }
      }
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'ActivityDynamic', ['activity_id'], () => {
        this.refreshData()
      })
    }
  },
  methods: {
    fetchDynamic (pn) {
      if (this.fetching) { // 正在拉取动态数据
        return false
      }
      let rData = {
        pn: pn,
        limit: 10,
        id: this.$route.query.activity_id,
        snapshot: this.paging.snapshot || ''
      }
      this.fetching = true
      this.$ajax('/jv/anonymous/qz/v21/activitydynamics', {data: rData}).then(res => { // 获取动态列表
        if (res && res.msg) {
          this.$toast(res.msg)
        }
        if (res && !res.error && res.data) { // 成功获取数据
          this.fetching = false
          this.paging = res.data.paging
          if (pn.toString() === '1') { // 刷新
            this.dynamic = res.data.list
          } else {
            this.dynamic = this.dynamic.concat(res.data.list)
          }
        } else {
          this.fetching = false
        }
      }).catch(err => {
        this.fetching = false
        if (err && err.msg) {
          this.$toast(err.msg)
        } else {
          this.$toast('获取动态失败')
        }
      })
    },
    refreshData () {
      let _initialData = JSON.parse(JSON.stringify(initialData))
      for (let item in _initialData) {
        this[item] = _initialData[item]
      }
      this.fetchDynamic(1)
      this.$refs['pageScroller'].scrollTo(0, 0, 10)
    },
    onPullingUp () {
      if (!(this.paging && this.paging.pn && !this.paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        return false
      }
      let pn = parseInt(this.paging.pn) + 1
      this.fetchDynamic(pn)
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
      this.dynamic.forEach(i => {
        if (i.id === item.id) {
          i.has_like = !isLike
          i.like_num = likeNum + (isLike ? -1 : 1)
          i.submitting = true
        }
      })
      this.$ajax('/jv/qz/like', {data: rData}).then(res => {
        if (!res || (res && Boolean(res.error))) { // 出错时重置点赞
          this.dynamic.forEach(i => {
            if (i.id === item.id) {
              i.has_like = isLike
              i.like_num = likeNum
              i.submitting = false
            }
          })
        } else {
          this.dynamic.forEach(i => {
            if (i.id === item.id) {
              i.submitting = false
            }
          })
        }
      }).catch(() => {
        this.dynamic.forEach(i => {
          if (i.id === item.id) {
            i.has_like = isLike
            i.like_num = likeNum
            i.submitting = false
          }
        })
      })
    },
    pageScroll ({x, y}) {
      if (-y > window.innerHeight) { // 超过一屏显示返回顶部
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    }
  },
  created () {
    this.fetchDynamic(1)
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
.activity-dynamic{
  width: 100%;
  height: 100%;
  background: #F5F5F5;
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
