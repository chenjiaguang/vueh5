<template>
  <div class="edit-page">
    <div class="text-box">
      <textarea class="text-content" placeholder="此刻，我想说..." v-model="dynamicText"></textarea>
    </div>
    <div class="pic-box">
      <image-container v-if="!$route.params.resetData" :images="images" :router="$router" :showDelete="true" @deleteFunc="deleteImage" :appearAnimation="true" :isUpload="true" @addFunc="addImage" />
    </div>
    <div class="options-box" v-if="topic || activity || circle || range">
      <edit-option :option="{leftIcon: 'topic_edit', title: '话题'}" v-if="topic">
        <div class="topic-box clearfix" slot="extra">
          <div class="topic-item fl" v-for="(item, idx) in topic" :key="idx">
            <i class="iconfont icon-topic topic-icon"></i>{{item.title}}
          </div>
        </div>
      </edit-option>
      <edit-option :option="{leftIcon: 'activity_edit', title: activity.title}" v-if="activity"></edit-option>
      <edit-option :option="{leftIcon: 'circle', title: '发布于圈子', rightText: circle.title}" v-if="circle"></edit-option>
      <edit-option :option="{leftIcon: 'range_' + range, title: rangeMap[range.toString()], rightIcon: 'next'}" @tapFunc="changeRange" v-if="range || range === 0"></edit-option>
    </div>
    <div class="submit-btn" @click.stop="submitDynamic">发布</div>
  </div>
</template>

<style lang="scss" type="text/scss" scoped>
.edit-page{
  padding: 0 4%;
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
.submit-btn{
  margin-top: 80px;
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
import imageContainer from '@/components/ImageContainer'
import EditOption from './components/EditOption'
import axios from 'axios'
import utils from '@/lib/utils'

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
  submitSuccess: false
}
export default {
  data () {
    let topic = this.$route.query.topic ? JSON.parse(this.$route.query.topic) : null
    let activity = this.$route.query.activity ? JSON.parse(this.$route.query.activity) : null
    let circle = this.$route.query.circle ? JSON.parse(this.$route.query.circle) : null
    let range = this.$route.query.range !== undefined ? this.$route.query.range.toString() : null
    let _initialData = JSON.parse(JSON.stringify(initialData))
    let _obj = Object.assign({}, _initialData, {topic, activity, circle, range})
    console.log('_obj', _obj)
    return _obj
  },
  components: {imageContainer, EditOption},
  watch: {
    '$route.query.previewImage': function (val, oldVal) {
      if (!val && oldVal) {
        if (window.previewImageId) {
          this.$previewImage.hide(window.previewImageId)
          window.previewImageId = null
        }
      }
    },
    submitSuccess: function (val, oldVal) {
      if (val && !oldVal) {
        this.refreshData()
        this.$router.go(-1)
      }
    }
  },
  methods: {
    addImage (files) {
      console.log('addImage')
      let _this = this
      let currentLength = this.images.length
      let addLength = 9 - currentLength
      if (addLength <= 0) { // 超过9图处理
        console.log('超过9图处理')
        return false
      }
      for (let i = 0; i < files.length; i++) {
        if (i < addLength) {
          let sign = new Date().getTime() + i
          let item = {
            id: '',
            sign: new Date().getTime() + i,
            url: '',
            width: '',
            height: '',
            localUrl: '',
            status: 'reading'
          }
          // 在添加按钮前插入图片
          this.images.push(item)
          let fileReader = new FileReader()
          fileReader.readAsDataURL(files[i])
          fileReader.onload = function () {
            let img = document.createElement('img')
            img.src = this.result
            img.onload = function (imageData) {
              if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
                console.log('超过最大图片数')
                return false
              }
              let data = imageData.target ? imageData.target : (imageData.path && imageData.path[0]) ? imageData.path[0] : {}
              _this.images = _this.images.map((item, idx) => {
                if (item.sign === sign) {
                  return Object.assign({}, item, {
                    width: data.width,
                    height: data.height,
                    localUrl: data.src,
                    status: 'submitting'
                  })
                } else {
                  return item
                }
              })
            }
            var CancelToken = axios.CancelToken
            let formData = new FormData()
            formData.append('file', files[i])
            _this.$ajax('/jv/image/compressupload', {
              token: window.localStorage.token || '',
              contentType: 'multipart/form-data',
              data: formData,
              cancelToken: new CancelToken(function executor (cancel) {
                // An executor function receives a cancel function as a parameter
                _this.cancelRequest[sign.toString()] = cancel
              })
            }).then(res => { // 上传返回数据处理
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
              _this.images = _this.images.map((item, idx) => {
                if (item.sign === sign) {
                  return Object.assign({}, item, {
                    status: status,
                    id: id,
                    url: url
                  })
                } else {
                  return item
                }
              })
              _this.cancelRequest[sign.toString()] = null
            }).catch(err => {
              if (err && err.msg) {
                _this.$toast(err.msg)
              }
              _this.images = _this.images.map((item, idx) => {
                if (item.sign === sign) {
                  console.log('catch错误')
                  return Object.assign({}, item, {
                    status: 'error'
                  })
                } else {
                  return item
                }
              })
              _this.cancelRequest[sign.toString()] = null
            })
          }
          fileReader.onerror = function () {
            if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
              console.log('超过最大图片数')
              return false
            }
            _this.images = _this.images.map((item, idx) => {
              if (item.sign === sign) {
                console.log('读取失败')
                return Object.assign({}, item, {
                  status: 'error'
                })
              } else {
                return item
              }
            })
          }
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
      if (!utils.checkLogin()) {
        return false
      }
      let flat = false // 标记是否可提交,false可提交
      let content = ''
      let image_ids = ''
      let topic_ids = ''
      let uploadImages = this.images.filter(item => item.status === 'success')
      let imageIds = this.images.map((item, idx) => {
        if (item.status === 'submitting' || item.status === 'reading') {
          flat = true
        }
        if (item.id) {
          return item.id
        }
      })
      if (flat) {
        this.$toast('图片正在上传中，请稍候发布')
        return false
      }
      if ((!this.dynamicText || (this.dynamicText && this.dynamicText.length < 10)) && uploadImages.length === 0) {
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
      if (imageIds && imageIds.length > 0) {
        image_ids = imageIds.join(',')
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
        showAllways: true
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
      let topic = this.$route.query.topic ? JSON.parse(this.$route.query.topic) : null
      let activity = this.$route.query.activity ? JSON.parse(this.$route.query.activity) : null
      let circle = this.$route.query.circle ? JSON.parse(this.$route.query.circle) : null
      let range = this.$route.query.range !== undefined ? this.$route.query.range.toString() : null
      let _initialData = JSON.parse(JSON.stringify(initialData))
      let _obj = Object.assign({}, _initialData, {topic, activity, circle, range})
      for (let item in _obj) {
        this[item] = _obj[item]
      }
      this.$route.params.resetData = false
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name !== 'EditDynamicRange') {
      to.params.resetData = true
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
    } else {
      to.params.resetData = false
    }
    next(vm => {
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
