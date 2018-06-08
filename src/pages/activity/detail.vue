<template>
  <div class="activity-detail">
    <div class="image-container" :style="{backgroundImage: 'url(' + activity.banner + ')'}"></div>
    <div class="activity-container">
      <div class="info-container">
        <div class="info-title">{{activity.title}}</div>
        <div class="info-item clearfix">
          <div class="fl left">主办方</div>
          <div class="fl sponsor-name" :style="{width: activity.sponsor.tel ? '62.32%' : 'auto'}">{{activity.sponsor.name}}</div>
          <a class="sponsor-sign fr iconfont icon-phone" :href="'tel:' + activity.sponsor.tel" v-if="activity.sponsor.name && activity.sponsor.tel"></a>
        </div>
        <div class="info-item clearfix" @click="activity.address && activity.address.coordinate && goMap(activity.address.coordinate)">
          <div class="fl left">地点</div>
          <div class="location-text fl" :style="{width: activity.address.coordinate ? '63.76%' : 'auto'}">{{activity.address.title || '线上活动'}}</div>
          <i class="location-sign fr iconfont icon-location" v-if="activity.address.title && activity.address.coordinate"></i>
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
      <div ref="contentContainer" class="content-container">
        <div ref="contentHeader" class="header">活动介绍</div>
        <div ref="contentContext" class="content-context">
          <p>工作两周，假期里养的肉都下去了么？如果没有，那就 来找点乐子吧！ 不想养膘？ 打球去吧！ 不想无所事事？ 打球去吧！</p>
          <img :src="activity.banner" />
          <p>羽毛球比赛即将于三月中旬举行，该比赛注重同学们的 身心健康发展，旨在宽阔学生们的业余活动，望大家踊 跃参与。 主办单位：中国工商银行广东省分行 报名时间：近期 比赛时间：三月</p>
        </div>
        <div ref="contentBtn" class="show-hide-btn" @click="changeShowContext"><span class="show-hide-text">{{showMore ? '收起' : '查看更多图文详情'}}<i class="pull-sign iconfont icon-pull_down" :style="{transform: showMore ? 'scale(0.25) rotate(180deg)' : 'scale(0.25) rotate(0)'}"></i></span></div>
      </div>
    </div>
    <div class="join-wrapper">
      <div class="color-block"></div>
      <div class="join-header">已经报名的小伙伴({{activity.join.length}})</div>
      <div class="join-partner clearfix">
        <div class="join-avatar fl" v-for="(item, idx) in activity.join" :key="idx" :style="{backgroundImage: 'url(' + item + ')'}"></div>
      </div>
    </div>
    <div @click="goOrder" class="fixed-button" :style="{backgroundColor: BuyStatus.toString() === '0' ? '#ff3f53' : '#bbbbbb'}">{{submitBtnText[BuyStatus.toString()]}}</div>
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
    padding-bottom:84px;
    overflow: hidden;
    transition: height 500ms;
    box-sizing: border-box;
    height: 700px;
  }
  .info-title{
    padding: 26px 0 38px;
    font-size: 32px;
    line-height: 46px;
  }
  .info-item{
    position: relative;
    height: 76px;
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
    font-weight: 600;
  }
  .cost{
    color: #ff3f53;
  }
  .tag-container{
    margin: 0 24px 90px;
    padding: 24px 0;
  }
  .tag-item{
    margin: 6px;
    height: 40px;
    line-height: 40px;
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
  }
  .content-context img{
    display: block;
    margin: 21px 0;
    max-width: 100%;
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
    position: relative;
    padding-right:35px;
  }
  .pull-sign{
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -36px;
    margin-right: -24px;
    display: block;
    width: 72px;
    height: 72px;
    line-height: 72px;
    font-size:72px;
    color: #333;
    transform-origin: 50% 50%;
    transition: all 500ms;

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
  #map-container {width:300px; height: 180px; display: none}
  #map-container.show{
    display: block;
  }
</style>

<script>
import '@/iconfont/iconfont.css'
export default {
  name: 'ActivityDetail',
  data () {
    return {
      activity: {
        banner: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
        title: '三月不减肥，四月徒伤悲 | 节后甩肉计划第一期 正式启动！羽毛球篇',
        sponsor: { // 主办方
          name: '海口禹讯信息技术有限公司',
          tel: 17508959493
        },
        address: {
          title: '海口市龙华区滨海大道百方大厦15楼b',
          coordinate: {
            lng: 110.33283799999998,
            lat: 19.913631,
            title: '北京'
          }
        },
        date: '01-03 18:30 至 05-06 18:30',
        cost: 0,
        deadline: '02-15 18:30',
        tags: ['不可退票', '费用中包含保险', '更多tag', '更多tag', '更多tag', '更多tag'],
        join: [
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528197427182&di=60534aa9b92ce3b295cc8ce42acbcd3f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0158d9594a60f2a8012193a3624461.jpg%401280w_1l_2o_100sh.jpg'
        ]
      },
      showMore: false, // 显示更多
      contentWrapperHeight: null,
      submitBtnText: {
        0: '购票',
        1: '已停止购票',
        2: '活动已下线',
        3: '票已售罄'
      },
      BuyStatus: 0 // 0 可购买
    }
  },
  methods: {
    goMap (option) { // option: lng, lat, title
      if (!option.lng || !option.lat) { // 未传入经纬度则返回
        return false
      }
      this.$router.push({name: 'mapPage', query: { lng: option.lng, lat: option.lat, title: option.title || '' }})
    },
    goOrder () {
      if (this.BuyStatus.toString() !== '0'){
        return false
      }
      this.$router.push({name: 'ActivityOrder', params: { activityId: 11}})
    },
    changeShowContext () {
      if (!this.showMore) {
        let wrapperHeight = this.$refs['contentContainer'].offsetHeight
        let headerHeight = this.$refs['contentHeader'].offsetHeight
        let contentHeight = this.$refs['contentContext'].offsetHeight
        let btnHeight = this.$refs['contentBtn'].offsetHeight
        this.$refs['contentContainer'].style.height = headerHeight + contentHeight + btnHeight + 'px'
        this.showMore = true
        if (this.contentWrapperHeight) {
          return false
        }
        this.contentWrapperHeight = wrapperHeight
      } else {
        this.$refs['contentContainer'].style.height = this.contentWrapperHeight + 'px'
        this.showMore = false
      }
    }
  }
}
</script>
