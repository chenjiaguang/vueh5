<template>
  <div class="edit-page">
    <div class="text-box">
      <textarea class="text-content" placeholder="此刻，我想说..."></textarea>
    </div>
    <div class="pic-box">
      <image-container :images="images" @addFunc="addImage" />
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
      <edit-option :option="{leftIcon: 'range_' + range, title: rangeMap[range.toString()], rightIcon: 'next'}" @tapFunc="changeRange" v-if="range"></edit-option>
    </div>
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
</style>

<script>
import imageContainer from '@/components/ImageContainer'
import EditOption from './components/EditOption'
export default {
  data () {
    let topic = this.$route.params.topic || null
    let activity = this.$route.params.activity || null
    let circle = this.$route.params.circle || null
    let range = this.$route.params.range || null
    return {
      images: [
        {
          url: 'add-btn',
          width: 220,
          height: 220
        }
      ],
      topic,
      activity,
      circle,
      range,
      rangeMap: {
        0: '公开',
        1: '仅好友可见',
        2: '仅自己可见'
      }
    }
  },
  components: {imageContainer, EditOption},
  methods: {
    addImage (files) {
      
      let _this = this
      let currentLength = this.images.filter(item => item.url !== 'add-btn').length
      let addLength = 9 - currentLength // 最多9图
      if (addLength <= 0) { // 超过9图处理
        return false
      }
      for (let i = 0; i < files.length; i++) {
        if (i < addLength) {
          let sign = new Date().getTime() + i
          let item = {
            sign: new Date().getTime() + i,
            url: '',
            width: '',
            height: '',
            localUrl: '',
            status: ''
          }
          this.images.splice(-1, 0 ,item) // 在添加按钮前插入图片
          let fileReader = new FileReader()
          fileReader.readAsDataURL(files[i])
          fileReader.onload = function () {
            let img = document.createElement('img')
            img.src = this.result
            img.onload = function (imageData) {
              if (_this.images.length > 9) { // 大于9张图时终止，为防止其他错误
                return false
              }
              let data = imageData.path[0]
              _this.images = _this.images.map((item, idx) => {
                if (item.sign === sign) {
                  return {
                    sign: sign,
                    url: '',
                    width: data.width,
                    height: data.height,
                    localUrl: data.src,
                    status: 'local'
                  }
                } else {
                  return item
                }
              })
            }
          }
        }
      }
      return false
      let formData = new FormData()
      formData.append('file', files[0])
      this.$ajax('/jv/image/upload', {token: 'lcaKiq5GIC_FHqubOBcI6FUKaL8N171U', contentType: 'multipart/form-data', data: formData}).then(res => {
        console.log(111, res)
      }).catch(err => {
        console.log(222, err)
      })
    },
    changeRange () {
      console.log('changeRange')
    }
  },
  mounted () {
    console.log('this.topic', this.topic, this.activity)
  }
}
</script>




