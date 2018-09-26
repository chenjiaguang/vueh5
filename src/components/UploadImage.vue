<template>
  <div ref="uploader" id="uploader" class="uploader">
    <div class="images-wrapper">
      <img class="uploader-image-item" v-for="i in images" :style="{backgroundImage: 'url(' + i.url + ')'}" :key="i.hash" />
      <div id="picker" class="add-btn uploader-image-item"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select{
  user-select: auto;
}
.uploader{
  margin-top: 100px;
}
.uploader-image-item{
  width: 32.63%;
  padding-top: 32.63%;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
.add-btn /deep/ .webuploader-pick{
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
      images: [],
      uploader: null
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

      // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      // resize: false,
      thumb: {
        quality: 70
      }
    })
    this.uploader.on('uploadProgress', (res_file, percentage) => {
      let w = res_file._info.width
      let h = res_file._info.height
      let wh = (w > h ? h : w)
      let has_add = false
      this.images.forEach(item => {
        if (item.hash === res_file.__hash) {
          has_add = true
        }
      })
      if (!has_add) { // 没添加过则生成缩略图
        this.uploader.makeThumb(res_file, (err, data_url) => {
          if (err) {
            console.log('该图片不支持预览')
          } else {
            this.images.push({hash: res_file.__hash, url: data_url})
          }
        }, wh, wh)
      }
    })
    this.uploader.on('uploadSuccess', (res_file, res) => {
      console.log('uploadSuccess', res_file, res)
    })
  }
}
</script>
