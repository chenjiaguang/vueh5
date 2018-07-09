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
      <div ref="contentContainer" @load="layout" class="content-container" v-if="activity.content && activity.content.length > 0">
        <div ref="contentHeader" class="header">活动介绍</div>
        <div ref="contentContext" class="content-context">
          <template v-for="(item, idx) in activity.content">
            <p :key="idx" v-if="item.type === '1'">{{item.content}}</p>
            <img :key="idx" v-else-if="item.type === '2'" :src="item.content.image" />
          </template>
        </div>
        <div v-if="contentWrapperHeight && contentWrapperHeight > halfScreenHeight" ref="contentBtn" class="show-hide-btn" @click="changeShowContext"><span class="show-hide-text">{{showMore ? '收起' : '查看更多图文详情'}}<i class="pull-sign iconfont icon-pull_down" :style="{transform: showMore ? 'scale(0.25) rotate(180deg)' : 'scale(0.25) rotate(0)'}"></i></span></div>
      </div>
    </div>
    <div class="join-wrapper" v-if="activity.join && activity.join.length > 0">
      <div class="color-block"></div>
      <div class="join-header">已经报名的小伙伴({{activity.joinTotal}})</div>
      <div class="join-partner clearfix">
        <div class="join-avatar fl" v-for="(item, idx) in activity.join" :key="idx" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
      </div>
    </div>
    <div @click="goOrder" class="fixed-button" :style="{backgroundColor: activity.statusText === '购票' ? '#ff3f53' : '#bbbbbb'}">{{activity.statusText}}</div>
  </div>
</template>

<style scoped>
  .activity-detail{
    width:100%;
    padding-bottom: 130px;
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
  .info-container, .content-container{
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
  .content-container{
    font-size:28px;
    line-height: 46px;
    position: relative;
    overflow: hidden;
    transition: height 300ms;
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
  .content-context{
    padding-bottom: 21px;
    white-space: pre-wrap;
  }
  .content-context img{
    display: block;
    margin: 21px 0;
    width: 100%;
  }
  .show-hide-btn{
    width: 92%;
    height: 84px;
    background-color: #fff;
    margin-left: 4%;
    line-height:84px;
    font-size: 24px;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .show-hide-btn:after{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    background-color: #e5e5e5;
  }
  .show-hide-text{
    display: inline-block;
    position: relative;
    padding-right:35px;
  }
  .pull-sign{
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -38px;
    margin-right: -24px;
    display: block;
    width: 72px;
    height: 72px;
    line-height: 72px;
    font-size:72px;
    color: #333;
    transform-origin: 50% 50%;
    transition: all 300ms;

  }
  .join-partner{
    padding: 30px 23px 25px;
  }
  .join-avatar{
    width: 42px;
    height: 42px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin: 5px 11px;
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
  .fixed-button{
    height: 100px;
    width: 100%;
    background-color: #ff3f53;
    font-size: 30px;
    color: #fff;
    font-weight: 600;
    line-height: 100px;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>

<script>
import '@/iconfont/iconfont.css'
export default {
  name: 'ActivityDetail',
  data () {
    return {
      setted: false,
      activity: {
        id: '',
        banner: '',
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
        statusText: '',
        ticket: []
      },
      showMore: false, // 显示更多
      contentWrapperHeight: null,
      halfScreenHeight: parseInt(window.innerHeight * 0.5),
    }
  },
  methods: {
    fetchActivity () {
      let rData = {
        id: this.$route.query.id
      }
      this.$ajax('/jv/anonymous/qz/v21/activity', {data: rData}).then(res => { // 获取活动数据
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
        this.activity.statusText = res.data.status_text
        let tagsArr = []
        if (res.data.insurance) {
          tagsArr.push('费用中包含保险')
        }
        if (!res.data.refund) {
          tagsArr.push('不可退票')
        }
        this.activity.tags = tagsArr
      }).catch(err => {
        console.log('获取数据失败')
      })
    },
    goMap (option) { // option: lng, lat, title
      console.log('goMap', option)
      if (!option.lng || !option.lat) { // 未传入经纬度则返回
        return false
      }
      this.$router.push({name: 'mapPage', query: { lng: option.lng, lat: option.lat, title: option.title || '' }})
    },
    goOrder () {
      if (this.activity.statusText !== '购票') {
        return false
      }
      this.$router.push({name: 'ActivityOrder', query: {id: this.$route.query.id}})
    },
    changeShowContext () {
      let currentHeight = this.$refs['contentContainer'].offsetHeight
      if (currentHeight > this.halfScreenHeight) {
        this.$refs['contentContainer'].style.height = this.halfScreenHeight + 'px'
        this.showMore = false
      } else {
        this.$refs['contentContainer'].style.height = this.contentWrapperHeight + 'px'
        this.showMore = true
      }
    },
    layout () {
      if (this.setted) {
        return false
      }
      setTimeout(() => {
        let btnHeight = (84 / 750) * window.innerWidth
        if (this.$refs['contentContainer']) {
          let wrapperHeight = this.$refs['contentContainer'].offsetHeight
          if (wrapperHeight > this.halfScreenHeight && !this.showMore) { // 大于半屏且处于隐藏状态
            this.contentWrapperHeight = wrapperHeight + btnHeight
            this.$refs['contentContainer'].style.height = this.halfScreenHeight + 'px'
          }
          this.setted = true
        }
      }, 100)
    }
  },
  created () {
    this.fetchActivity()
  },
  updated () {
    this.layout()
  }
}
</script>
