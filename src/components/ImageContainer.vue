<template>
  <div style="width: 100%;overflow: hidden;">
    <template v-for="(item, idx) in images">
      <transition :key="item.sign || item.id || idx" :appear="appearAnimation" appear-class="before-appear">
        <div v-if="isUpload" :key="item.sign || item.id || idx" @click.stop="previewImage(idx)" :style="{marginTop: idx < 3 ? 0 : '1.055%'}" class="item-container fl" :class="{disabled: !(item.localUrl || item.url), one: images.length === 1 && !isUpload, 'two-and-more': images.length > 1 || isUpload, left: idx % 3 === 0, horizontal: Number(item.width) >= Number(item.height), vertical: Number(item.width) < Number(item.height)}">
          <img :src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" />
          <div class="long-tag" v-if="Number(item.height) / Number(item.width) > 4">长图</div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
        <div v-else v-lazy-container="{selector: 'img'}" :key="item.sign || item.id || idx" @click.stop="previewImage(idx)" :style="{marginTop: idx < 3 ? 0 : '1.055%'}" class="item-container fl" :class="{disabled: !(item.localUrl || item.url), one: images.length === 1 && !isUpload, 'two-and-more': images.length > 1 || isUpload, left: idx % 3 === 0, horizontal: Number(item.width) >= Number(item.height), vertical: Number(item.width) < Number(item.height)}">
          <img :data-src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" />
          <div class="long-tag" v-if="Number(item.height) / Number(item.width) > 4">长图</div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
      </transition>
    </template>
    <div v-if="isUpload && images.length < 9" :style="{marginTop: images.length < 3 ? 0 : '1.055%'}" :class="{left: images.length % 3 === 0}" class="item-container add-btn two-and-more fl">
      <input ref="upload" @change="addImage" multiple class="input-image" type="file" accept="image/gif, image/jpeg, image/jpe, image/png" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['images', 'showDelete', 'deleteFunc', 'appearAnimation', 'addFunc', 'isUpload', 'router'],
  data () {
    return {
      statusText: {
        submitting: '正在上传...',
        error: '上传失败!'
      }
    }
  },
  methods: {
    addImage () {
      let files = this.$refs['upload'].files
      this.$emit('addFunc', files)
    },
    deleteImage (item, idx) {
      this.$emit('deleteFunc', item, idx)
    },
    previewImage (idx) {
      let _images = this.images.map(item => (item.url || item.localUrl))
      this.$previewImage.show({images: _images, idx}, this.router)
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.container{
  display: block;
  width: 100%;
  overflow: hidden;
}
.item-container{
  margin-left: 1.055%;
  position: relative;
  overflow: hidden;
  transition: width 500ms, height 500ms, opacity 500ms, transform 500ms, padding-top 500ms;
  opacity: 1;
  transform: scale(1, 1);
  transform-origin: 0 0;
  background-color: #EEEEEE;
  &.before-appear{
    width: 0 !important;
    transform: scale(0, 0);
    opacity: 0;
  }
  &.v-leave-to, &.v-leave-active{
    transition: all 0s;
    width: 0 !important;
    padding-top: 0 !important;
  }
  &.one.horizontal{
    width: 63.15%;
    padding-top: 43.85%;
  }
  &.one.vertical{
    width: 43.85%;
    padding-top: 63.15%;
  }
  &.two-and-more{
    width: 32.63%;
    padding-top: 32.63%;
  }
}
.add-btn{
  background: #F4F4F4;
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
.input-image{
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
}
.left{
  margin-left: 0
}
// .item-container.disabled{
//   transform: scale(0, 0);
//   margin-top: 0 !important;
//   width: 0;
//   // padding-top: 0;
//   // opacity: 0;
// }
.fl{
    float: left;
}
.fr{
    float: right;
}
.image-item{
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webket-touch-callout: default;
}
.image-item.horizontal{
  width: auto;
  height: 100%;
}
.image-item.vertical{
  width: 100%;
  height: auto;
}
img[lazy=error]{
  max-width: 50%;
  max-height: 50%;
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
.status-box{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2;
}
.status-text{
  width: 100%;
  font-size: 32px;
  color: #fff;
  position: absolute;
  left:0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.delete-btn{
  width: 72px;
  height: 72px;
  line-height: 72px;
  font-size: 36px;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 8px;
  right: 8px;
  transform: scale(0.5, 0.5);
  transform-origin: 100% 0;
  z-index: 3;
}
</style>
