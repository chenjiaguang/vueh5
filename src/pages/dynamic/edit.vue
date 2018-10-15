<template>
  <div class="edit-page">
    <div class="text-box">
      <textarea class="text-content" placeholder="此刻，我想说..." v-model="dynamicText"></textarea>
    </div>
    <!-- <div ref="picBox" class="pic-box">
      <image-container :images="images" :router="$router" :showDelete="true" @deleteFunc="deleteImage" :appearAnimation="true" :isUpload="true" @addFunc="addImage" />
    </div> -->
    <upload-image v-if="!refreshing" ref="uploader" />
    <div class="options-box" v-if="topic || activity || circle || range">
      <edit-option :option="{leftIcon: 'topic_edit', title: '话题'}" v-if="topic">
        <div class="topic-box clearfix" slot="extra">
          <div class="topic-item fl" v-for="(item, idx) in topic" :key="idx">
            <i class="iconfont icon-topic_v_2_5 topic-icon"></i>{{item.title}}
          </div>
        </div>
      </edit-option>
      <edit-option :option="{leftIcon: 'activity_edit', title: activity.title}" v-if="activity"></edit-option>
      <edit-option :option="{leftIcon: 'circle', title: '发布于群组', rightText: circle.title}" v-if="circle">
        <div class="topic-box clearfix" slot="extra">
          <div @click.stop="showAllwaysChecked = !showAllwaysChecked" class="check-sync fr">
            <i class="iconfont check-icon" :class="{'icon-checked': showAllwaysChecked, 'icon-uncheck': !showAllwaysChecked}"></i><span>同步到动态</span>
          </div>
        </div>
      </edit-option>
      <edit-option :option="{leftIcon: 'range_' + range, title: rangeMap[range.toString()], rightIcon: 'next'}" @tapFunc="changeRange" v-if="range || range === 0"></edit-option>
    </div>
    <div class="submit-btn" @click.stop="submitDynamic">发布</div>
  </div>
</template>

<style src="../../../cwebassets/css/webuploader.css"></style>
<style lang="scss" type="text/scss" scoped>
.edit-page{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 4%;
  -webkit-overflow-scrolling: touch;
}
.text-box{
  height: 298px;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.text-content{
  padding: 15px 10px;
  font-size: 34px;
  line-height: 44px;
  color: #333;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  border: none;
  resize: none;
  outline: none;
}
.options-box{
  padding-top: 88px;
  position: relative;
}
.options-box:before{
  content: "";
  display: block;
  width: 300%;
  height: 3px;
  background: #E1E1E1;
  position: absolute;
  left: 0;
  top: 88px;
  transform: scale(0.3333, 0.3333);
  transform-origin: 0 0;
}
.topic-box{
  padding-top: 16px;
  padding-left: 11.3%;
}
.topic-item{
  height: 54px;
  line-height: 54px;
  font-size: 28px;
  padding: 0 20px;
  background: #F0F0F0;
  border-radius: 6px;
}
.topic-icon{
  font-size:28px;
  color: #FF611A;
  margin-right: 8px;
}
.check-sync{
  display: flex;
  height: 34px;
  line-height: 30px;
  font-size: 24px;
  color: #999;
  justify-content: flex-end;
  align-items: center;
}
.check-icon{
  font-size: 30px;
  margin-right: 16px;
  transition: color 300ms;
}
.check-icon.icon-uncheck{
  color: #C1C1C1;
}
.check-icon.icon-checked{
  color: #1EB0FD;
}
.submit-btn{
  margin-top: 80px;
  margin-bottom: 50px;
  height: 90px;
  font-size: 34px;
  line-height: 90px;
  color: #fff;
  background: #1EB0FD;
  border-radius: 8px;
  text-align: center;
}
</style>

<script>
import UploadImage from '@/components/UploadImage'
import imageContainer from '@/components/ImageContainer'
import EditOption from './components/EditOption'
import axios from 'axios'
import utils from '@/lib/utils'
import 'lrz/dist/lrz.bundle.js'

// 接受参数(params) topic: [{id: 2, title: '测试话题'}]    activity: {id: 2, title: '屯昌木色湖一日游'}    circle: {id: 2, title: '舌尖上的海口'}    range: 0||1||2
let initialData = {
  dynamicText: '',
  images: [],
  cancelRequest: {},
  topic: [],
  activity: {},
  circle: {},
  range: 0,
  rangeMap: {
    0: '公开',
    1: '仅好友可见',
    2: '仅自己可见'
  },
  submitting: false,
  submitSuccess: false,
  showAllwaysChecked: false,
  refreshing: false
}
export default {
  data () {
    if (this.$isApp) {
      this.$appCall('h5GoPublishShortDynamic')
    }
    let topic = this.$route.query.topic ? JSON.parse(this.$route.query.topic) : null
    let activity = this.$route.query.activity ? JSON.parse(this.$route.query.activity) : null
    let circle = this.$route.query.circle ? JSON.parse(this.$route.query.circle) : null
    let range = this.$route.query.range !== undefined ? this.$route.query.range.toString() : null
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, {topic, activity, circle, range})
    return _obj
  },
  components: {imageContainer, EditOption, UploadImage},
  watch: {
    submitSuccess: function (val, oldVal) {
      if (val && !oldVal) {
        this.refreshData()
        this.$router.go(-1)
      }
    }
  },
  methods: {
    convertBase64UrlToBlob (urlData) {
      let arr = urlData.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type: mime})
    },
    readFile (files, idx, success) {
      let sign = new Date().getTime() + idx
      let imageItem = {
        id: '',
        sign: sign,
        url: '',
        width: '',
        height: '',
        localUrl: '',
        status: 'reading'
      }
      // 在添加按钮前插入图片
      this.images.push(imageItem)
      let _this = this
      let fileReader = new FileReader()
      fileReader.readAsDataURL(files[idx])
      fileReader.onload = function () {
        console.log('读取成功')
        let img = document.createElement('img')
        img.src = this.result
        img.onload = function (imageData) {
          success(imageData, sign, {width: img.width, height: img.height})
        }
        _this.uploadImage(files[idx], sign)
      }
      fileReader.onerror = function () {
        if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
          console.log('超过最大图片数')
          return false
        }
        _this.images.forEach((item, idx) => {
          if (item.sign === sign) {
            console.log('读取失败')
            item.status = 'error'
          }
        })
      }
    },
    showLocalImage (imageData, sign, type, imageSize) { // type：1表示imageData 是base64，可以直接显示，否则是img元素，需读取src
      console.log('showLocalImage')
      let _this = this
      if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
        console.log('超过最大图片数')
        return false
      }
      let url = ''
      if (type.toString() === '1') {
        url = imageData
      } else if (type.toString() === '2') {
        url = imageData.target ? imageData.target.src : ((imageData.path && imageData.path[0]) ? imageData.path[0].src : '')
      }
      _this.images.forEach((item, idx) => {
        if (item.sign === sign && type.toString() === '1') { // 尚未获得图片的宽高
          let _img = document.createElement('img')
          item.localUrl = url
          _img.src = url
          _img.onload = function () {
            item.width = _img.width
            item.height = _img.height
          }
        } else if (item.sign === sign && type.toString() === '2' && imageSize) { // 已获得图片的宽高
          item.width = imageSize.width
          item.height = imageSize.height
          item.localUrl = url
        }
      })
    },
    uploadImage (file, sign) {
      console.log('')
      let _this = this
      _this.images.forEach((item, idx) => {
        if (item.sign === sign) {
          item.status = 'submitting'
        }
      })
      var CancelToken = axios.CancelToken
      let formData = new FormData()
      formData.append('file', file)
      _this.$ajax('/jv/image/compressupload', {
        token: window.localStorage.token || '',
        contentType: 'multipart/form-data',
        data: formData,
        cancelToken: new CancelToken(function executor (cancel) {
          // An executor function receives a cancel function as a parameter
          _this.cancelRequest[sign.toString()] = cancel
        })
      }).then(res => { // 上传返回数据处理
        console.log('上传图片成功')
        let status = ''
        let id = ''
        let url = ''
        if (res && res.msg) {
          _this.$toast(res.msg)
        }
        if (!res.error && res.data) {
          status = 'success'
          id = res.data.id[0]
          url = res.data.url[0]
        } else {
          status = 'error'
        }
        _this.images.forEach((item, idx) => {
          if (item.sign === sign) {
            item.status = status
            item.id = id
            item.url = url
          }
        })
        _this.cancelRequest[sign.toString()] = null
      }).catch(err => {
        if (err && err.msg) {
          _this.$toast(err.msg)
        }
        _this.images.forEach((item, idx) => {
          if (item.sign === sign) {
            console.log('catch错误')
            item.status = 'error'
          }
        })
        _this.cancelRequest[sign.toString()] = null
      })
    },
    addImage (files) {
      console.log(112)
      // let _this = this
      let currentLength = this.images.length
      let addLength = 9 - currentLength
      if (addLength <= 0) { // 超过9图处理
        return false
      }
      console.log(444)
      for (let i = 0; i < files.length; i++) {
        if (i < addLength) {
          // let reg = /(jpeg|jpg)/i
          // let isJpg = reg.test(files[i].type)
          // if (isJpg) { // jpg图片才压缩, 默认压缩质量0.7
          //   console.log(666)
          //   window.lrz(files[i]).then(res => {
          //     console.log('res', res)
          //     console.log('压缩图片成功')
          //     let sign = new Date().getTime() + i
          //     let imageItem = {
          //       id: '',
          //       sign: sign,
          //       url: '',
          //       width: '',
          //       height: '',
          //       localUrl: '',
          //       status: 'reading'
          //     }
          //     // 在添加按钮前插入图片
          //     this.images.push(imageItem)
          //     this.showLocalImage(res.base64, sign, 1)
          //     this.uploadImage(res.file, sign)
          //   }).catch(err => {
          //     console.log('压缩图片失败')
          //     this.readFile(files, i, (_imageData, _sign, sizeObj) => {
          //       this.showLocalImage(_imageData, _sign, 2, sizeObj)
          //     })
          //   })
          //   return false
          // } else {
          this.readFile(files, i, (_imageData, _sign, sizeObj) => {
            this.showLocalImage(_imageData, _sign, 2, sizeObj)
          })
          // }
          // return false
          // let sign = new Date().getTime() + i
          // let imageItem = {
          //   id: '',
          //   sign: sign,
          //   url: '',
          //   width: '',
          //   height: '',
          //   localUrl: '',
          //   status: 'reading'
          // }
          // console.log('插入图片', sign)
          // // 在添加按钮前插入图片
          // this.images.push(imageItem)
          // let fileReader = new FileReader()
          // fileReader.readAsDataURL(files[i])
          // fileReader.onload = function () {
          //   console.log('读取成功', sign)
          //   let img = document.createElement('img')
          //   img.src = this.result
          //   img.onload = function (imageData) {
          //     console.log('图片加载成功')
          //     if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
          //       console.log('超过最大图片数')
          //       return false
          //     }
          //     let data = imageData.target ? imageData.target : (imageData.path && imageData.path[0]) ? imageData.path[0] : {}
          //     _this.images.forEach((item, idx) => {
          //       if (item.sign === sign) {
          //         item.width = data.width
          //         item.height = data.height
          //         item.localUrl = data.src
          //       }
          //     })
          //   }
          //   img.onerror = function () {
          //     console.log('图片加载错误')
          //   }
          //   _this.images.forEach((item, idx) => {
          //     if (item.sign === sign) {
          //       item.status = 'submitting'
          //     }
          //   })
          //   var CancelToken = axios.CancelToken
          //   let formData = new FormData()
          //   formData.append('file', files[i])
          //   _this.$ajax('/jv/image/compressupload', {
          //     token: window.localStorage.token || '',
          //     contentType: 'multipart/form-data',
          //     data: formData,
          //     cancelToken: new CancelToken(function executor (cancel) {
          //       // An executor function receives a cancel function as a parameter
          //       _this.cancelRequest[sign.toString()] = cancel
          //     })
          //   }).then(res => { // 上传返回数据处理
          //     console.log('上传图片成功')
          //     let status = ''
          //     let id = ''
          //     let url = ''
          //     if (res && res.msg) {
          //       _this.$toast(res.msg)
          //     }
          //     if (!res.error && res.data) {
          //       status = 'success'
          //       id = res.data.id[0]
          //       url = res.data.url[0]
          //     } else {
          //       status = 'error'
          //     }
          //     _this.images.forEach((item, idx) => {
          //       if (item.sign === sign) {
          //         item.status = status
          //         item.id = id
          //         item.url = url
          //       }
          //     })
          //     _this.cancelRequest[sign.toString()] = null
          //   }).catch(err => {
          //     if (err && err.msg) {
          //       _this.$toast(err.msg)
          //     }
          //     _this.images.forEach((item, idx) => {
          //       if (item.sign === sign) {
          //         console.log('catch错误')
          //         item.status = 'error'
          //       }
          //     })
          //     _this.cancelRequest[sign.toString()] = null
          //   })
          // }
          // fileReader.onerror = function () {
          //   if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
          //     console.log('超过最大图片数')
          //     return false
          //   }
          //   _this.images.forEach((item, idx) => {
          //     if (item.sign === sign) {
          //       console.log('读取失败')
          //       item.status = 'error'
          //     }
          //   })
          // }
        } else {
          console.log('超过了')
        }
      }
    },
    deleteImage (item, idx) {
      let cancel = this.cancelRequest[item.sign.toString()]
      if (cancel) {
        cancel()
        this.cancelRequest[item.sign.toString()] = null
      }
      this.images.splice(idx, 1)
    },
    changeRange () {
      this.$router.push({name: 'EditDynamicRange', query: {selected: this.range}})
    },
    submitDynamic () {
      console.log('uploader_stats', this.$refs['uploader'].uploader.getStats(), Object.keys(this.$refs['uploader'].images).length)
      if (!utils.checkLogin()) {
        return false
      }
      let flat = false // 标记是否可提交,false可提交
      let uploader_stats = this.$refs['uploader'].uploader.getStats() // 上传图片中或者有失败的
      if (uploader_stats.successNum !== Object.keys(this.$refs['uploader'].images).length) {
        flat = true
      }
      let content = ''
      let image_ids = ''
      let topic_ids = ''
      if (flat) {
        this.$toast('有未成功上传的图片...')
        return false
      }
      if ((!this.dynamicText || (this.dynamicText && this.dynamicText.length < 10)) && uploader_stats.successNum === 0) {
        this.$toast('内容还不够10个字~')
        flat = true
      } else if (this.dynamicText && this.dynamicText.length > 2000) {
        this.$toast('内容太多了，不能多于2000个字哦~')
        flat = true
      } else {
        content = this.dynamicText
      }
      if (this.topic) {
        let topicIds = this.topic.map((item, idx) => {
          if (item.id) {
            return item.id
          }
        })
        if (topicIds && topicIds.length > 0) {
          topic_ids = topicIds.join(',')
        }
      }
      for (let i in this.$refs['uploader'].images) {
        image_ids += image_ids ? (',' + this.$refs['uploader'].images[i].id) : this.$refs['uploader'].images[i].id
      }
      if (this.submitting) {
        return false
      }
      if (flat) {
        return false
      }
      let rData = {
        content: content,
        image_ids: image_ids,
        range: this.range || '',
        actid: this.activity ? (this.activity.id || '') : '',
        circle_id: this.circle ? (this.circle.id || '') : '',
        topicId: topic_ids,
        showAllways: this.showAllways
      }
      this.submitting = true
      this.$ajax('/jv/qz/publish/dynamic', {data: rData}).then(res => {
        if (res && res.msg) {
          if (!res.error) { // 发布成功
            this.$toast(res.msg, 2000, () => {
              this.submitting = false
              console.log('发布成功,返回')
              // this.$router.go(-1)
              this.submitSuccess = true
            })
          } else {
            this.submitting = false
            this.$toast(res.msg)
          }
        }
        if (res && !res.msg && !res.error) { // 发布成功
          this.submitting = false
          console.log('发布成功,返回')
          // this.$router.go(-1)
          this.submitSuccess = true
        }
      }).catch(err => {
        this.submitting = false
      })
    },
    refreshData () {
      this.refreshing = true
      this.$nextTick(() => {
        let topic = this.$route.query.topic ? JSON.parse(this.$route.query.topic) : null
        let activity = this.$route.query.activity ? JSON.parse(this.$route.query.activity) : null
        let circle = this.$route.query.circle ? JSON.parse(this.$route.query.circle) : null
        let range = this.$route.query.range !== undefined ? this.$route.query.range.toString() : null
        let _initialData = JSON.parse(JSON.stringify(initialData))
        let _obj = Object.assign({}, _initialData, {topic, activity, circle, range})
        for (let item in _obj) {
          this[item] = _obj[item]
        }
      })
      // this.$router.replace({name: 'EditDynamic', query: this.$route.query})
    }
  },
  computed: {
    showAllways () {
      return (this.circle && this.circle.id) ? this.showAllwaysChecked : true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let title = ''
      let circle = to.query.circle ? JSON.parse(to.query.circle) : null
      if (circle && circle.title) {
        title = circle.title
      } else {
        title = '发动态'
      }
      let i = document.createElement('iframe')
      i.src = 'https://www.baidu.com/favicon.ico'
      i.style.display = 'none'
      i.onload = () => {
        setTimeout(() => {
          i.remove()
        }, 9)
      }
      document.title = title
      document.body.appendChild(i)
      if (from.name === 'EditDynamicRange') {
        vm.range = from.query.selected
      }
    })
  },
  activated () {
    if (this.$route.params.resetData) {
      this.refreshData()
    }
  }
}
</script>
