<template>
  <div class="activity-detail">
    <div class="image-container" :style="{backgroundImage: 'url(' + activity.banner + ')'}"></div>
    <div class="activity-container">
      <div class="info-container" v-if="activity.id">
        <div class="info-title">{{activity.title}}</div>
        <div class="info-item clearfix">
          <div class="fl left">主办方</div>
          <div class="fl sponsor-name" :style="{width: activity.sponsor.tel ? '62.32%' : 'auto'}">{{activity.sponsor.name}}</div>
          <a class="sponsor-sign fr iconfont icon-phone" :href="'tel:' + activity.sponsor.tel" v-if="activity.sponsor.name && activity.sponsor.tel"></a>
        </div>
        <div class="info-item clearfix" @click="activity.address && activity.address.coordinate && goMap(activity.address.coordinate)">
          <div class="fl left">地点</div>
          <div class="location-text fl" :style="{width: activity.address.coordinate ? '63.76%' : 'auto'}">{{activity.address.title}}</div>
          <i class="location-sign fr iconfont icon-location" v-if="activity.address.title && activity.address.coordinate && activity.address.coordinate.lng && activity.address.coordinate.lat"></i>
        </div>
        <div class="info-item clearfix">
          <div class="fl left">时间</div>
          <div class="fl">{{activity.date}}</div>
        </div>
        <div class="info-item clearfix">
          <div class="fl left">费用</div>
          <div class="cost fl" v-if="activity.cost && activity.cost.toString() !== '0'">&yen;{{activity.cost}}</div>
          <div class="cost fl" v-else>免费</div>
        </div>
        <div class="info-item clearfix">
          <div class="fl left">报名截止时间</div>
          <div class="fl">{{activity.deadline}}</div>
        </div>
      </div>
      <div class="tag-container clearfix">
        <div class="fl tag-item" v-for="(item, idx) in activity.tags" :key="idx">{{item}}<div class="tag-border"></div></div>
      </div>
      <show-hide-content :content="activity.content" :htmlContent="activity.htmlContent" :router="$router" v-if="activity.content && activity.content.length > 0 || activity.htmlContent" />
    </div>
    <div class="join-wrapper" v-if="activity.join && activity.join.length > 0">
      <div class="color-block"></div>
      <div class="join-header">已经报名的小伙伴({{activity.joinTotal}})</div>
      <div class="join-partner clearfix">
        <div class="join-avatar fl" v-for="(item, idx) in activity.join" :key="idx" :style="{backgroundImage: 'url(' + item.avatar + ')'}">
          <div v-if="item.num && parseInt(item.num) > 1" class="join-num">x{{item.num}}</div>
        </div>
        <img class="join-avatar fl" v-if="activity.joinTotal && parseInt(activity.joinTotal) > 40"  :src="$assetsPublicPath + '/cwebassets/image/more_avatar2.png'" style="border-radius:0" />
      </div>
    </div>
    <div class="dynamic-wrapper" v-if="activity.activityHasDynamic">
      <div class="dynamic-header clearfix">
        <div class="fl">大家都在晒</div>
        <div @click.stop="goDynamicList" class="more-dynamic-text fr">更多<i class="iconfont icon-next more-dynamic-icon"></i></div>
      </div>
      <div class="dynamic-images clearfix">
        <div class="top-border"></div>
        <div class="bottom-border"></div>
        <div @click.stop="goDynamicList" class="dynamic-image-item fl" v-for="(item, idx) in activity.activityDynamic" :key="idx" :style="{backgroundImage: 'url(' + ((item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url)) + ')'}">
          <div class="long-tag" v-if="item.longCover && !item.gif">长图</div>
          <div class="gif-tag" v-if="item.gif"></div>
        </div>
        <div @click.stop="goPublish" class="dynamic-image-item fl">
          <div class="dynamic-btn">
            <i class="iconfont icon-camera1 dynamic-btn-icon"></i>
            <div class="dynamic-btn-text">晒美照</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-button clearfix" v-if="activity.id">
      <a v-if="activity.sponsor.tel" class="tel-btn fl" :href="'tel:' + activity.sponsor.tel" :style="{width: '26.66%'}">
        <div class="tel-btn-content">
           <i class="iconfont icon-phone-w tel-btn-icon"></i>
          <div>电话咨询</div>
        </div>
      </a>
      <div @click.stop="goPublish" class="go-dynamic-btn fl" :style="{width: '26.66%'}">
        <div class="go-dynamic-btn-content">
          <i class="iconfont icon-camera-w go-dynamic-btn-icon"></i>
          <div>晒图</div>
        </div>
      </div>
      <div @click="goOrder" class="order-btn fl" :style="{backgroundColor: (activity.statusText === '购票' && !submitting) ? '#ff3f53' : '#bbbbbb', width: activity.sponsor.tel ? '46.68%' : '73.34%'}">{{activity.statusText}}</div>
    </div>
  </div>
</template>

<style scoped>
  .activity-detail{
    width:100%;
    padding-bottom: 130px;
    background-color: #fff;
  }
  .header{
    font-size: 32px;
    line-height: 44px;
    font-weight: bold;
    padding-bottom: 25px;
  }
  .image-container{
    width: 100%;
    height: 422px;
    position: relative;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .info-container{
    padding: 0 4%;
  }
  .location-text, .sponsor-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sponsor-sign{
    font-size: 33px;
    color: #1EB0FD;
  }
  .location-sign{
    font-size: 24px;
    color: #1EB0FD;
  }
  .info-title{
    padding: 23px 0 38px;
    font-size: 32px;
    line-height: 46px;
  }
  .info-item{
    position: relative;
    min-height: 76px;
    line-height: 76px;
    font-size: 28px;
  }
  .left{
    width: 28.7%;
    color: #666;
  }
  .info-item:before{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.5);
    transform-origin: 0 100%;
    background-color: #E5E5E5;
  }
  .sponsor-name{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
  .cost{
    color: #ff3f53;
  }
  .tag-container{
    margin: 0 24px 0;
    padding: 24px 0;
  }
  .tag-item{
    margin: 6px;
    height: 40px;
    line-height: 42px;
    font-size: 24px;
    color: #666;
    padding: 0 14px;
    position: relative;
    text-align: center;
  }
  .tag-border{
    position: absolute;
    width: 200%;
    height: 200%;
    left: 0;
    top: 0;
    border-radius: 12px;
    border: 2px solid #bbbbbb;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: 0 0;
    z-index: 0;
  }
  .join-partner{
    padding: 20px 0 25px;
    margin: 0 25px;
  }
  .join-avatar{
    width: 7.1428%;
    height: 50px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 10px 1.4286%;
    border-radius: 50%;
    position: relative;
  }
  .join-num{
    height: 44px;
    padding: 0 6px;
    border: 2px solid #FE5F5F;
    color: #FE5F5F;
    font-size: 28px;
    line-height: 44px;
    border-radius: 22px;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: scale(0.5, 0.5) translateY(50%);
    transform-origin: 100% 100%;
    background: #fff;
  }
  .color-block{
    height: 16px;
    background-color: #f3f3f3;
  }
  .join-header{
    font-size: 32px;
    line-height: 42px;
    font-weight: bold;
    padding-top: 55px;
    padding-left: 34px;
  }
  .dynamic-header{
    font-size: 32px;
    line-height: 42px;
    font-weight: bold;
    padding-top: 20px;
    padding-left: 34px;
  }
  .more-dynamic-text{
    font-size: 28px;
    font-weight: normal;
    padding-right: 30px;
    color: #666;
  }
  .more-dynamic-icon{
    font-size: 24px;
    color: #666;
  }
  .dynamic-images{
    position: relative;
    margin: 35px 24px 25px;
  }
  .dynamic-image-item{
    width: 22.08%;
    height: 155px;
    margin: 20px 1.46%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #F4F4F4;
    font-size: 24px;
    line-height: 40px;
    text-align: center;
    color: #999;
    position: relative;
  }
  .long-tag{
    width: 128px;
    height: 64px;
    font-size: 42px;
    line-height: 64px;
    color: #fff;
    border-top-left-radius: 16px;
    background-color: rgba(0,0,0,0.5);
    text-align: center;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: scale(0.5, 0.5);
    transform-origin: 100% 100%;
    z-index: 1;
  }
  .gif-tag{
    width: 54px;
    height: 26px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-image: url('/h5/cwebassets/image/is_gif.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .dynamic-btn{
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .dynamic-btn-icon{
    font-size: 48px;
    line-height: 60px;
    color: #999;
  }
  .top-border{
    position: absolute;
    top: 0;
    left: 10px;
    width: 690px;
    height: 2px;
    transform: scale(1, 0.5);
    transform-origin: 0 0;
    background: #E5E5E5;
  }
  .bottom-border{
    position: absolute;
    bottom: 0;
    left: 10px;
    width: 690px;
    height: 2px;
    transform: scale(1, 0.5);
    transform-origin: 0 100%;
    background: #E5E5E5;
  }
  .fixed-button{
    height: 100px;
    width: 100%;
    max-width: 800PX;
    background-color: #fff;
    font-size: 30px;
    color: #fff;
    font-weight: bold;
    line-height: 100px;
    text-align: center;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  .fixed-button:before{
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    top: 0;
    background: #CBCBCB;
    transform: scale(1, 0.5);
    transform-origin: 0 0;
    z-index: 0;
  }
  .tel-btn, .go-dynamic-btn{
    display: block;
    font-size: 24px;
    line-height: 30px;
    color: #666;
    text-align: center;
    position: relative;
    height: 100%;
    z-index: 1;
  }
  .order-btn{
    position: relative;
    height: 100%;
    z-index: 1;
  }
  .tel-btn:before{
    content: "";
    display: block;
    width: 2px;
    height: 60px;
    background: #E1E1E1;
    position: absolute;
    right: 0;
    top: 20px;
  }
  .tel-btn-content, .go-dynamic-btn-content{
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .tel-btn-icon, .go-dynamic-btn-icon{
    font-size: 34px;
    line-height: 40px;
  }
</style>

<script>
import '@/iconfont/iconfont.css'
import ShowHideContent from './components/ShowHideContent'
import utils from '@/lib/utils'
import WeixinShareInKeepAlive from '../../mixin/WeixinShareInKeepAlive'

const initialData = {
  setted: false,
  activity: {
    id: '',
    banner: '',
    content: [],
    htmlContent: '',
    title: '',
    sponsor: { // 主办方
      name: '',
      tel: ''
    },
    address: {
      title: '',
      coordinate: {
        lng: '',
        lat: ''
      }
    },
    date: '',
    cost: '',
    deadline: '',
    tags: [],
    joinTotal: 0,
    join: [],
    activityHasDynamic: false,
    activityDynamic: [],
    statusText: '',
    ticket: [],
    following: false
  },
  circle: {},
  showMore: false, // 显示更多
  contentWrapperHeight: null,
  halfScreenHeight: parseInt(window.innerHeight * 0.5),
  submitting: false
}
export default {
  mixins: [WeixinShareInKeepAlive],
  name: 'ActivityDetail',
  data () {
    if (this.$isApp && this.$route.query.id) { // 范团app内打开,跳转原生活动详情页面
      // appCall('finishWebView')
      this.$appCall('h5GoActivityDetail', this.$route.query.id)
    }
    let _initialData = JSON.parse(JSON.stringify(initialData))
    return _initialData
  },
  components: { ShowHideContent },
  watch: {
    '$route': function (val, oldVal) {
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'ActivityDetail', ['id'], () => {
        this.refreshData()
      },
      () => {
        this.runShareBindfunction()
      })
    },
    'activity.title': function (val, oldVal) {
      document.title = val || ''
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
      if (followed || !utils.checkLogin()) { // 已加入或未登录均返回
        return false
      }
      if (this.following) { // 正在申请
        this.$toast('正在申请...')
        return false
      }
      this.$prompt.showPrompt({contentText: '加入群组才能进行更多操作哦~', leftText: '我再想想', rightText: _rightText}, () => {
        this.applyJoinCircle()
      }, () => {
        console.log('cancel')
      })
    },
    getTimeText (date) {
      let oDate = new Date(date)
      let _year = oDate.getFullYear()
      let _month = oDate.getMonth() + 1
      _month = _month.toString().length < 2 ? '0' + _month : _month
      let _date = oDate.getDate()
      _date = _date.toString().length < 2 ? '0' + _date : _date
      let _hours = oDate.getHours()
      _hours = _hours.toString().length < 2 ? '0' + _hours : _hours
      let _minutes = oDate.getMinutes()
      _minutes = _minutes.toString().length < 2 ? '0' + _minutes : _minutes
      let _string = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes
      // 如果是今年，则把年份去掉
      let replaceStr = new Date().getFullYear() + '-'
      _string = _string.replace(replaceStr, '')
      return _string
    },
    previewActivity () {
      let rData = {
        circleId: this.$route.query.circleId,
        token: this.$route.query.token
      }
      this.$ajax('/jv/qz/draft/activity/search', {data: rData}).then(res => { // 获取活动数据
        if (res && res.data && !res.error) {
          let contentObj = JSON.parse(res.data.content)
          this.activity.id = 'preview'
          this.activity.banner = contentObj.form.cover.url
          this.activity.title = contentObj.form.name
          this.activity.sponsor.name = contentObj.form.sponsor_name
          this.activity.sponsor.tel = contentObj.form.sponsor_tel
          this.activity.address.title = contentObj.form.address_data.location
          this.activity.address.coordinate.lng = contentObj.form.address_data.lnglat[0]
          this.activity.address.coordinate.lat = contentObj.form.address_data.lnglat[1]
          let _start = new Date(contentObj.form.activity_time.start)
          let _end = new Date(contentObj.form.activity_time.end)
          this.activity.date = this.getTimeText(_start) + ' 至 ' + this.getTimeText(_end)
          let minCost = 0
          let maxCost = 0
          let priceText = ''
          contentObj.form.ticket_data.forEach(item => {
            if (!minCost || (minCost && parseFloat(item.price) < minCost)) {
              minCost = item.price
            }
            if (parseFloat(item.price) > maxCost) {
              maxCost = item.price
            }
          })
          if (maxCost.toString === 0) {
            priceText = '免费'
          } else if (minCost === maxCost) {
            priceText = minCost
          } else if (minCost !== maxCost) {
            priceText = minCost + '~' + maxCost
          }
          this.activity.cost = priceText
          let _deadline_date = new Date(contentObj.form.deadline_date)
          this.activity.deadline =  contentObj.form.deadline.toString() === '1' ? this.getTimeText(_end) : this.getTimeText(_deadline_date)
          this.activity.htmlContent = contentObj.form.editorContent
          this.activity.statusText = '购票'
          let tagsArr = []
          if (contentObj.form.has_insurance.toString() === '1') {
            tagsArr.push('费用中包含保险')
          }
          tagsArr.push('不可退票')
          if (contentObj.form.ticket_limit) {
            tagsArr.push('限购' + contentObj.form.ticket_limit + '张')
          }
          this.activity.tags = tagsArr
        }
      }).catch(err => {
        console.log('获取数据失败')
      })
    },
    fetchActivity () {
      if (this.$route.query.circleId && this.$route.query.token) {
        this.previewActivity()
        return false
      }
      let rData = {
        id: this.$route.query.id
      }
      this.$ajax('/jv/anonymous/qz/v21/activity', {data: rData}).then(res => { // 获取活动数据
        this.circle = res.data.circle
        this.activity.id = res.data.id
        this.activity.banner = res.data.covers[0].compress
        let largeBanner = new Image()
        largeBanner.src = res.data.covers[0].url
        largeBanner.onload = () => {
          this.activity.banner = res.data.covers[0].url
        }
        this.activity.title = res.data.title
        this.activity.sponsor.name = res.data.oid
        this.activity.sponsor.tel = res.data.phone
        this.activity.address.title = res.data.address_text
        this.activity.address.coordinate.lng = res.data.longitude
        this.activity.address.coordinate.lat = res.data.latitude
        this.activity.date = res.data.time_text
        this.activity.cost = res.data.money
        this.activity.deadline = res.data.deadline_text
        this.activity.content = res.data.content.filter(item => item.type.toString() !== '0').map(item => {
          return {
            type: item.type,
            content: item.type.toString() === '1' ? item.content : {
              image: item.imageUrl,
              description: item.des
            },
            width: item.width,
            height: item.height
          }
        })
        this.activity.joinTotal = res.data.joined_total
        this.activity.join = res.data.joined_users
        this.activity.activityHasDynamic = res.data.activity_has_dynamic
        this.activity.activityDynamic = res.data.activity_images.filter((item, idx) => idx < 3)
        this.activity.statusText = res.data.status_text
        let tagsArr = []
        if (res.data.insurance) {
          tagsArr.push('费用中包含保险')
        }
        if (!res.data.refund) {
          tagsArr.push('不可退票')
        }
        if (res.data.max_ticket && parseInt(res.data.max_ticket)) {
          tagsArr.push('限购' + res.data.max_ticket + '张')
        }
        this.activity.tags = tagsArr

        this.setShareData({
          type: '5',
          title: res.data.shareInfo.shareTitle,
          desc: res.data.shareInfo.shareContent,
          url: res.data.shareInfo.shareUrl,
          imgUrl: res.data.shareInfo.shareImage
        })
      }).catch(err => {
        console.log('获取数据失败')
      })
    },
    refreshData () {
      let _initialData = JSON.parse(JSON.stringify(initialData))
      for (let item in _initialData) {
        this[item] = _initialData[item]
      }
      this.fetchActivity()
    },
    goMap (option) { // option: lng, lat, title
      if (!option.lng || !option.lat) { // 未传入经纬度则返回
        return false
      }
      this.$router.push({name: 'mapPage', query: { lng: option.lng, lat: option.lat, title: option.title || '' }})
    },
    goPublish () {
      if (this.$route.query.isPreview) { // 预览模式下不可点击
        return false
      }
      let {followed} = this.circle
      if (!followed) {
        this.joinCircle()
        return false
      }
      if (utils.checkLogin()) {
        let circleJson = JSON.stringify({id: this.circle.id, title: this.circle.name})
        let activityJson = JSON.stringify({id: this.activity.id, title: this.activity.title})
        this.$router.push({name: 'EditDynamic', query: {circle: circleJson, activity: activityJson}, params: {resetData: true}})
      }
    },
    goDynamicList () {
      this.$router.push({name: 'ActivityDynamic', query: {activity_id: this.activity.id}, params: {resetData: true}})
    },
    checkOrder () {
      let rData = {
        aid: this.$route.query.id
      }
      this.submitting = true
      this.$ajax('/jv/qz/v25/order/unpaid', {data: rData, dontToast: true}).then(res => {
        console.log('获取未支付订单成功', res)
        this.submitting = false
        if (res && res.data && res.data.checkcode && !res.error) { // 有未支付订单
          if (res.data.leftTime && parseInt(res.data.leftTime) > 0) { // 剩余时间大于0
            this.$router.push({name: 'ConfirmOrder', query: {aid: this.$route.query.id}, params: {data: res.data, refreshData: true}})
          } else { // 剩余时间不足
            this.$router.push({name: 'ActivityOrder', query: {id: this.$route.query.id}})
          }
        } else { // 无未支付订单
          this.$router.push({name: 'ActivityOrder', query: {id: this.$route.query.id}})
        }
      }).catch(err => {
        console.log('获取未支付订单失败', err)
        this.submitting = false
        if (err && err.status && err.status.toString() === '200') {
          this.$router.push({name: 'ActivityOrder', query: {id: this.$route.query.id}})
        }
      })
    },
    goOrder () {
      if (this.$route.query.isPreview || this.activity.statusText !== '购票' || !utils.checkLogin() || this.submitting) { // 未登录或不可购票时终止,预览模式下不可点击
        return false
      }
      let {followed} = this.circle
      if (!followed) {
        this.joinCircle()
        return false
      }
      this.checkOrder()
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   utils.beforeRouteEnterHandleShareOpen(to, from, next, 5)
  // },
  mounted () {
    this.fetchActivity()
  }
}
</script>
