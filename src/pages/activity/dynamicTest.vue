<template>
  <div :style="{height: widHeight + 'px'}">
    <div id="mescroll" class="mescroll activity-dynamic">
      <download-box v-if="$route.params.isShareOpen" />
      <transition name="loading-scale">
        <div class="first-loading-box" v-if="!paging.pn">
          <loading-view />
        </div>
      </transition>
      <dynamic-item v-for="(item, idx) in dynamic" :key="idx" :itemData="item" :hideBlock="idx === dynamic.length - 1" :router="$router" @changeLike="changeLike" />
    </div>
    <scroll-to-top v-if="mescroll[0]" :visible="showBackTop" :position="{bottom: (winWidth / 750) * 178, right: (winWidth / 750) * 54}" :scroll="mescroll[0]"/>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import DynamicItem from './components/DynamicItem'
import DownloadBox from '@/components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import MeScrollSupportArr from '@/mixin/MeScrollSupportArr'
import mescrollOptions from '@/lib/mescrollOptions'
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
  mescroll: []
}
export default {
  mixins: [MeScrollSupportArr],
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
        this.mescroll[0].endErr()
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
          this.$nextTick(() => {
            this.mescroll[0].endSuccess(res.data.list.length, !res.data.paging.is_end)
            if (res.data.paging.is_end) {
              this.mescroll[0].showNoMore()
            }
          })
        } else {
          this.fetching = false
          this.mescroll[0].endErr()
        }
      }).catch(err => {
        this.fetching = false
        this.mescroll[0].endErr()
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
    },
    onPullingUp () {
      if (!(this.paging && this.paging.pn && !this.paging.is_end)) { // 未生成paging，或者paging.pn不存在，或者已是最后一页     终止操作
        this.mescroll[0].endErr()
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
    initMeScroll () {
      let _down = Object.assign({}, mescrollOptions.get().down, {
        auto: true,
        autoShowLoading: false
      })
      let _up = Object.assign({}, mescrollOptions.get().up, {
        callback: this.onPullingUp,
        onScroll: this.onMeScroll,
        htmlNodata: '<div style="height:0"></div>'
      })
      this.mescroll[0] = new MeScroll('mescroll', {down: _down, up: _up})
    },
    onMeScroll (mescroll, y, isUp) {
      if (y === 0 && !isUp && this.pageTop !== 0) {
        this.pageTop = 0
      } else if (isUp && this.pageTop === 0) {
        let bannerPos = this.$refs['topBanner'].getBoundingClientRect()
        let bannerHeight = bannerPos.height
        this.pageTop = -bannerHeight
      }
      if (y > window.innerHeight && !this.showBackTop) {
        this.showBackTop = true
      } else if (y < window.innerHeight && this.showBackTop) {
        this.showBackTop = false
      }
    }
  },
  mounted () {
    this.initMeScroll(0)
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
