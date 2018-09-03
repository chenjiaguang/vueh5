// 动态详情页的图片展示
<template>
  <div v-if="images&&images.length" class="row flex-wrap-wrap space-between">
    <div v-for="(item, idx) in images" :key="idx" @click="previewImage(idx)" :class="[imageClassName]">
      <div :style="`background-image:url(${(item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url)});height:${images.length==1?((images[0].height/images[0].width*$winWidth)+'px'):null}`" :class="['image-item']" />
      <div class="long-tag" v-if="item.longCover && !item.gif">长图</div>
      <div class="gif-tag" v-if="item.gif"></div>
    </div>
    <div v-if="images&&images.length&&(images.length==5||images.length==8)" :class="[imageClassName]"></div>
  </div>
</template>

<script>
export default {
  props: ['images'],
  data () {
    return {}
  },
  computed: {
    imageClassName: function () {
      if (this.images.length === 1) {
        return 'one'
      } else if (this.images.length === 2 || this.images.length === 4) {
        return 'two'
      } else {
        return 'three'
      }
    }
  },
  methods: {
    previewImage (idx) {
      let _images = this.images.map(item => item.url || item.localUrl)
      this.$previewImage.show({ images: _images, idx }, this.previewCallBack)
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.one {
  width: 100%;
  position: relative;
}
.two {
  width: 372px;
  height: 372px;
  margin-bottom: 6px;
  position: relative;
}
.three {
  width: 246px;
  height: 246px;
  margin-bottom: 12px;
  position: relative;
}

.image-item {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  height: 100%;
  height: 100%;
}
.long-tag {
  width: 128px;
  height: 64px;
  font-size: 42px;
  line-height: 64px;
  color: #fff;
  border-top-left-radius: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  position: absolute;
  right: 1px;
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
</style>
