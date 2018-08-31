<template>
  <div class="map-page" :style="{width: $winWidth + 'px', height: $winHeight + 'px'}">
    <div id="map-container"></div>
    <div id="panel"></div>
  </div>
</template>

<style scoped>
  .map-page{
    background-color: #FAFAFA;
    user-select: none;
  }
  #map-container{
    width: 100%;
    height: 100%;
  }
</style>

<script>
import Vue from 'vue'
import MapInfoWindow from '../components/MapInfoWindow'
export default {
  name: 'ActivityDetail',
  data () {
    return {
      locationText: 'sdfsdfsdf',
      map: null
    }
  },
  methods: {
    showMap (lng, lat) {
      if (!this.map) { // 未初始化完成时不能调用地图相关api
        return false
      }
      let position = [lng, lat]  // 简写
      this.map.setCenter(position)
      // 将创建的点标记添加到已有的地图实例：
      let marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      })
      this.map.add(marker)
      this.show = !this.show
    },
    activeMap (lng, lat) {
      let marker = new AMap.Marker({
        position: [lng, lat]
      })
      marker.markOnAMAP({
        position: marker.getPosition(),
        name: '首开广场' // name属性在移动端有效
      })
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
  },
  mounted () {
    window.initMap = () => {
      let {lng, lat, title} = this.$route.query
      let position = [lng, lat]  // 简写
      this.map = new AMap.Map('map-container')
      AMap.plugin(['AMap.Geocoder', 'AMap.Driving', 'AMap.Geolocation'], () => { // 异步加载插件
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        })
        geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // 将创建的点标记添加到已有的地图实例：
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              title: title || 'title',
              clickable: true
            })
            this.map.add(marker)
            // 创建 infoWindow 实例
            const InfoDomConstructor = Vue.extend(MapInfoWindow) // 直接将Vue组件作为Vue.extend的参数
            const Info = (text) => {
              return new InfoDomConstructor({
                data: {
                  text: text
                },
                methods: {
                  drive: () => {
                    let geolocation = new AMap.Geolocation({
                      // 是否使用高精度定位，默认：true
                      enableHighAccuracy: true,
                      // 设置定位超时时间，默认：无穷大
                      timeout: 10000,
                      // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                      buttonOffset: new AMap.Pixel(10, 20),
                      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                      zoomToAccuracy: true,
                      //  定位按钮的排放位置,  RB表示右下
                      buttonPosition: 'RB'
                    })
                    geolocation.getCurrentPosition((type, data) => {
                      if (data.type === 'complete' && data.info === 'SUCCESS') {
                        let startPos = new AMap.LngLat(data.position.lng, data.position.lat)
                        let endPos = new AMap.LngLat(lng, lat)
                        let driving = new AMap.Driving({
                          map: this.map,
                          panel: 'panel'
                        })
                        // 根据起终点经纬度规划驾车导航路线
                        driving.search(startPos, endPos)
                      } else {
                        alert('获取您的位置出错')
                      }
                    })
                  }
                }
              })
            }
            const InfoInstance = Info(result.regeocode.formattedAddress).$mount()
            const InfoDom = InfoInstance.$el
            let infoWindow = new AMap.InfoWindow({
              isCustom: true,  // 使用自定义窗体
              content: InfoDom,  // 传入 dom 对象，或者 html 字符串
              offset: new AMap.Pixel(16, -50)
            })
            infoWindow.open(this.map, marker.getPosition())
          }
        })
        geocoder.getLocation('海南省海口市观澜湖新城', function (status, result) {
          if (status === 'complete' && result.info === 'OK') {

          }
        })
      })
      this.map.setZoom(13)
      this.map.setCenter(position)
    }
    let url = 'https://webapi.amap.com/maps?v=1.4.6&key=ba6c996137985103dfcccd5ac7457ccb&callback=initMap'
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  }
}
</script>
