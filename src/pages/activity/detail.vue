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
      <show-hide-content :content="activity.content" :router="$router" v-if="activity.content && activity.content.length > 0" />
    </div>
    <div class="join-wrapper" v-if="activity.join && activity.join.length > 0">
      <div class="color-block"></div>
      <div class="join-header">已经报名的小伙伴({{activity.joinTotal}})</div>
      <div class="join-partner clearfix">
        <div class="join-avatar fl" v-for="(item, idx) in activity.join" :key="idx" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
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
      <div @click="goOrder" class="order-btn fl" :style="{backgroundColor: activity.statusText === '购票' ? '#ff3f53' : '#bbbbbb', width: activity.sponsor.tel ? '46.68%' : '73.34%'}">{{activity.statusText}}</div>
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
    font-weight: 600;
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
    font-weight: 600;
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
  }
  .color-block{
    height: 16px;
    background-color: #f3f3f3;
  }
  .join-header{
    font-size: 32px;
    line-height: 42px;
    font-weight: 600;
    padding-top: 55px;
    padding-left: 34px;
  }
  .dynamic-header{
    font-size: 32px;
    line-height: 42px;
    font-weight: 600;
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
    background-color: #fff;
    font-size: 30px;
    color: #fff;
    font-weight: 600;
    line-height: 100px;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
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

const initialData = {
  setted: false,
  activity: {
    id: '',
    banner: '',
    content: [],
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
    ticket: []
  },
  circle: {},
  showMore: false, // 显示更多
  contentWrapperHeight: null,
  halfScreenHeight: parseInt(window.innerHeight * 0.5)
}
export default {
  name: 'ActivityDetail',
  data () {
    let _initialData = JSON.parse(JSON.stringify(initialData))
    return _initialData
  },
  components: { ShowHideContent },
  watch: {
    '$route': function (val, oldVal) {
      if (!val.query.previewImage && oldVal.query.previewImage) { // 点击大图后返回
        if (window.previewImageId) {
          this.$previewImage.hide(window.previewImageId)
          window.previewImageId = null
        }
      }
      utils.checkReloadWithKeepAliveNew(this, val, oldVal, 'ActivityDetail', ['id'], () => {
        this.refreshData()
      })
    }
  },
  methods: {
    fetchActivity () {
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

        this.$store.commit('weixinShare/set', {
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
      if (utils.checkLogin()) {
        let circleJson = JSON.stringify({id: this.circle.id, title: this.circle.name})
        let activityJson = JSON.stringify({id: this.activity.id, title: this.activity.title})
        this.$router.push({name: 'EditDynamic', query: {circle: circleJson, activity: activityJson}, params: {resetData: true}})
      }
    },
    goDynamicList () {
      this.$router.push({name: 'ActivityDynamic', query: {activity_id: this.activity.id}, params: {resetData: true}})
    },
    goOrder () {
      if (this.activity.statusText !== '购票' || !utils.checkLogin()) { // 未登录或不可购票时终止
        return false
      }
      this.$router.push({name: 'ActivityOrder', query: {id: this.$route.query.id}})
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
