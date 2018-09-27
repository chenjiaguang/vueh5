<template>
  <div ref="uploader" id="uploader" class="uploader">
    <transition-group name="list" tag="div" class="images-wrapper">
      <div class="uploader-image-item" v-for="(val, key, idx) in images" :style="{backgroundImage: 'url(' + val.url + ')', marginLeft: idx % 3 === 0 ? 0 : '1.055%', marginTop: idx < 3 ? 0 : '1.055%'}" :key="val.hash">
        <div v-if="val.uploadText" class="uploader-image-item-percentage">
          <span>{{val.uploadText}}</span>
        </div>
        <div class="iconfont icon-guanbi delete-btn" @click.stop="deleteImage(val.uploadId)"></div>
      </div>
      <div class="add-btn uploader-image-item" key="add-btn" :style="{marginLeft: Object.keys(images).length % 3 === 0 ? 0 : '1.055%', marginTop: Object.keys(images).length < 3 ? 0 : '1.055%'}">
        <div id="picker" class="picker"></div>
      </div>
    </transition-group>
  </div>
</template>

<style lang="scss" scoped>
.list-enter-active{
  transition: all 500ms;
}
.list-leave-active{
  transition: all 0s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: scale(.5,.5) translate(-20%, -20%);
  transform-origin: 0 100%;
}
.select{
  user-select: auto;
}
.uploader{
  margin-top: 100px;
}
.images-wrapper{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.uploader-image-item{
  width: 32.63%;
  padding-top: 32.63%;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  flex-grow: 0;
  height: 0;
}
.uploader-image-item-percentage{
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 28px;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
}
.delete-btn{
    width: 0.96rem;
    height: 0.96rem;
    line-height: 0.96rem;
    font-size: 0.48rem;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0.106667rem;
    right: 0.106667rem;
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    z-index: 3;
}
.add-btn{
  background: #F4F4F4;
  overflow: hidden;
  &:before{
    content: "";
    display: block;
    width: 33.33%;
    height: 3.03%;
    position: absolute;
    left: 33.33%;
    top: 48.485%;
    background: #D8D8D8;
    z-index: 1;
  }
  &:after{
    content: "";
    display: block;
    width: 33.33%;
    height: 3.03%;
    position: absolute;
    left: 33.33%;
    top: 48.485%;
    background: #D8D8D8;
    transform: rotate(90deg);
    z-index: 1;
  }
}
.picker{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  overflow: hidden;
}
.picker /deep/ .webuploader-pick{
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 0;
  left: 0;
}
</style>

<script>
// import '@/../cwebassets/js/jQuery.3.3.1.min.js'
// import '@/../cwebassets/js/webuploader.min.js'

export default {
  data () {
    return {
      images: {},
      uploader: null
    }
  },
  methods: {
    deleteImage (id) {
      let _images = this.images
      delete _images[id]
      this.images = Object.assign({}, _images)
      this.uploader.removeFile(id, true)
    }
  },
  mounted () {
    this.uploader = WebUploader.create({
      // 存在文件，自动上传
      auto: true,
      // swf文件路径
      swf: this.$assetsPublicPath + '/cwebassets/Uploader.swf',

      // 文件接收服务端。
      server: this.$apiDomain + '/jv/image/upload',

      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: {
        id: '#picker',
        multiple: true
      },
      fileNumLimit: 9,
      // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      // resize: false,
      thumb: {
        quality: 70
      }
    })
    this.uploader.on('uploadProgress', (res_file, percentage) => {
      console.log('uploadProgress', percentage)
      let w = res_file._info.width
      let h = res_file._info.height
      let wh = (w > h ? h : w)
      if (!this.images[res_file.id]) { // 没添加过缩略图则生成缩略图
        this.uploader.makeThumb(res_file, (err, data_url) => {
          if (err) {
            console.log('该图片不支持预览')
          } else {
            if (!this.images[res_file.id]) {
              this.images[res_file.id] = {uploadId: res_file.id, hash: res_file.__hash, url: data_url, uploadText: percentage.toFixed(2) * 100 + '%'}
              this.images = Object.assign({}, this.images)
            }
          }
        }, wh, wh)
      } else {
        this.images[res_file.id].uploadText = percentage.toFixed(2) * 100 + '%'
      }
    })
    this.uploader.on('uploadSuccess', (res_file, res) => {
      console.log('this.iamges', this.images)
      console.log('uploadSuccess', res_file, res)
      this.images[res_file.id].uploadText = ''
    })
    this.uploader.on('uploadError', (res_file, reason) => {
      console.log('uploadError', res_file, reason)
    })
    this.uploader.on('error', type => {
      if (type === 'Q_EXCEED_NUM_LIMI') {
        console.log('超出9张图片,不能再上传了')
      }
    })
  }
}
</script>
