<template>
  <div style="width: 100%;overflow: hidden;">
    <template v-for="(item, idx) in images">
      <transition :key="idx" :appear="appearAnimation" appear-class="before-appear">
        <div @click="previewImage(idx)" :style="{marginTop: idx < 3 ? 0 : '1.055%'}" class="item-container fl" :class="{disabled: !item.url, one: images.length === 1, 'two-and-more': images.length > 1, left: idx % 3 === 0, horizontal: Number(item.width) >= Number(item.height), vertical: Number(item.width) < Number(item.height)}">
          <img :src="item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" />
          <div class="long-tag" v-if="Number(item.height) / Number(item.width) > 4">长图</div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click="deleteImage(item, idx)"></div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
export default {
  props: ['images', 'showDelete', 'deleteFunc', 'appearAnimation'],
  data () {
    return {}
  },
  methods: {
    deleteImage (item, idx) {
      this.$emit('deleteFunc', item, idx)
    },
    previewImage (idx) {
      console.log(123)
      let _images = this.images.map(item => item.url)
      this.$previewImage.show({images: _images, idx})
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
  transition: all 0.5s;
  &.before-appear{
    width: 0 !important;
    padding-top: 0 !important;
  }
  &.v-leave-to{
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
.left{
  margin-left: 0
}
.item-container.disabled{
  transform: scale(0, 0);
  margin-top: 0 !important;
  width: 0;
  padding-top: 0;
  opacity: 0;
}
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
}
</style>
