<template>
  <div :style="{height: $winHeight + 'px'}">
    <div id="mescroll" class="mescroll activity-dynamic" :style="{width: $winWidth + 'px', height: '100%', overflowY: 'auto', overflowX: 'hidden'}">
      <download-box v-if="$route.query.isShareOpen && !$isApp" />
      <transition name="loading-scale">
        <div class="first-loading-box" v-if="!paging.pn">
          <loading-view />
        </div>
      </transition>
      <div v-if="paging.pn && dynamic && dynamic.length !== 0" :style="{minHeight: '100%', backgroundColor: '#fff'}">
        <dynamic-item v-for="(item, idx) in dynamic" :key="item.id" :itemData="item" :hideBlock="idx === dynamic.length - 1" :router="$router" @changeLike="changeLike" />
      </div>
      <div v-else-if="paging.is_end && dynamic && dynamic.length === 0" class="empty-box">该活动暂无晒图</div>
    </div>
    <scroll-to-top v-if="mescroll[0]" :visible="showBackTop" :position="{bottom: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 178, right: (($winWidth > (54 * 10) ? (54 * 10) : $winWidth) / 750) * 54}" :scroll="mescroll[0]"/>
  </div>
</template>

<script type="text/ecmascript-6">
import DynamicItem from './components/DynamicItem'
import DownloadBox from '@/components/DownloadBox'
import LoadingView from '@/components/LoadingView'
import ScrollToTop from '@/components/ScrollToTop'
import utils from '@/lib/utils'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import MeScrollSupportArr from '@/mixin/MeScrollSupportArr'
import mescrollOptions from '@/lib/mescrollOptions'

const initialData = {
  showBackTop: false,
  dynamic: [],
  paging: {},
  fetching: false,
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
        this.fetching = false
        if (res && !res.error && res.data) { // 成功获取数据
          this.paging = res.data.paging
          if (this.$isApp && res.data.list && res.data.list[0]) { // 范团app内打开,跳转原生活动晒图页面
            // appCall('finishWebView')
            let {circle_id, circle_name, actid} = res.data.list[0]
            let actname = res.data.list[0].activity.title
            this.$appCall('h5GoActivityDynamic', circle_id, circle_name, actid, actname)
          }
          if (pn.toString() === '1') { // 刷新
            this.dynamic = res.data.list
          } else {
            this.dynamic = this.dynamic.concat(res.data.list)
          }
          this.$nextTick(() => {
            this.mescroll[0].endSuccess(res.data.list.length, true)
            if (res.data.paging.is_end) {
              this.mescroll[0].showNoMore()
            }
          })
        } else {
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
      if (this.mescroll) {
        for (let i = 0; i < this.mescroll.length; i++) {
          this.mescroll[i].setScrollTop(0)
          this.mescroll[i].destroy()
        }
      }
      let _initialData = JSON.parse(JSON.stringify(initialData))
      for (let item in _initialData) {
        this[item] = _initialData[item]
      }
      this.initMeScroll(0)
    },
    onPuillingDown () {
      this.fetchDynamic(1)
    },
    onPullingUp () {
      if (this.paging && this.paging.pn && this.paging.is_end) { // 最后一页不允许上拉加载
        this.mescroll[0].endErr()
        return false
      }
      let pn = parseInt(this.paging.pn || 0) + 1
      if (pn === 1) {
        this.mescroll[0].hideUpScroll()
      }
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
        autoShowLoading: false,
        isLock: true,
        callback: this.onPuillingDown
      })
      let _up = Object.assign({}, mescrollOptions.get().up, {
        callback: this.onPullingUp,
        onScroll: this.onMeScroll,
        htmlNodata: '<div style="height:0"></div>'
      })
      this.mescroll[0] = new MeScroll('mescroll', {down: _down, up: _up})
    },
    onMeScroll (mescroll, y, isUp) {
      if (y > this.$winHeight && !this.showBackTop) {
        this.showBackTop = true
      } else if (y < this.$winHeight && this.showBackTop) {
        this.showBackTop = false
      }
    }
  },
  mounted () {
    this.initMeScroll(0)
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
