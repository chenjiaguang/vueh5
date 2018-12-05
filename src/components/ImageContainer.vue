<template>
  <div style="width: 100%;" class="clearfix">
    <template v-for="(item, idx) in images">
      <div :key="item.sign || item.id || idx" v-if="isAndroid()">
        <div ref="imageItem" v-if="isUpload" :key="item.sign || item.id || idx" @click.stop="previewImage(idx, $refs['imageItem'], (item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url))" :style="{marginTop: idx < 3 ? 0 : '1.055%', backgroundImage: 'url(' + (item.localUrl ||  item.url) + ')'}" class="item-container two-and-more fl" :class="{left: idx % 3 === 0}">
          <!-- <img :src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" /> -->
          <div class="long-tag" v-if="Number(item.height) / Number(item.width) > 2 && !item.gif">长图</div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error' || item.status === 'reading'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
        <div ref="imageItem" v-else v-lazy:background-image="(item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url)" :key="item.sign || item.id || idx" @click.stop="previewImage(idx, $refs['imageItem'], (item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url))" :style="{marginTop: idx < 3 ? 0 : '1.055%'}" class="item-container fl" :class="{one: images.length === 1 && !isUpload, 'two-and-more': images.length > 1 || isUpload, left: idx % 3 === 0, horizontal: Number(item.width) >= Number(item.height), vertical: Number(item.width) < Number(item.height)}">
          <!-- <img :data-src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" /> -->
          <div class="long-tag" v-if="item.longCover && !item.gif">长图</div>
          <div class="gif-tag" v-if="item.gif"></div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error' || item.status === 'reading'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
      </div>
      <transition :key="item.sign || item.id || idx" :appear="appearAnimation" appear-class="before-appear" v-else>
        <div ref="imageItem" v-if="isUpload" :key="item.sign || item.id || idx" @click.stop="previewImage(idx, $refs['imageItem'], (item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url))" :style="{marginTop: idx < 3 ? 0 : '1.055%', backgroundImage: 'url(' + (item.localUrl || item.url) + ')'}" class="item-container two-and-more fl" :class="{left: idx % 3 === 0}">
          <!-- <img :src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" /> -->
          <div class="long-tag" v-if="Number(item.height) / Number(item.width) > 2 && !item.gif">长图</div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error' || item.status === 'reading'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
        <div ref="imageItem" v-else v-lazy:background-image="(item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url)" :key="item.sign || item.id || idx" @click.stop="previewImage(idx, $refs['imageItem'], (item.gif && item.staticImage) ? item.staticImage : (item.compress || item.url))" :style="{marginTop: idx < 3 ? 0 : '1.055%'}" class="item-container fl" :class="{one: images.length === 1 && !isUpload, 'two-and-more': images.length > 1 || isUpload, left: idx % 3 === 0, horizontal: Number(item.width) >= Number(item.height), vertical: Number(item.width) < Number(item.height)}">
          <!-- <img :data-src="item.localUrl || item.url" class="image-item" :class="{horizontal: images.length === 1 && (Number(item.width) / Number(item.height) >= 1.44) || images.length > 1 && Number(item.width) >= Number(item.height), vertical: images.length === 1 && (Number(item.width) / Number(item.height) < 1.44) || images.length > 1 && Number(item.width) < Number(item.height)}" /> -->
          <div class="long-tag" v-if="item.longCover && !item.gif">长图</div>
          <div class="gif-tag" v-if="item.gif"></div>
          <div class="delete-btn iconfont icon-guanbi" v-if="showDelete" @click.stop="deleteImage(item, idx)"></div>
          <div class="status-box" v-if="item.status === 'submitting' || item.status === 'error' || item.status === 'reading'"><span class="status-text">{{statusText[item.status]}}</span></div>
        </div>
      </transition>
    </template>
    <div v-if="isUpload && images.length < 9" :style="{marginTop: images.length < 3 ? 0 : '1.055%'}" :class="{left: images.length % 3 === 0}" class="item-container add-btn two-and-more fl">
      <input ref="upload" @change="addImage" multiple class="input-image" type="file" accept="image/*" />
      <!-- accept如果写image/gif, image/jpeg, image/jpe, image/png的话在android微信浏览器里面会无法触发onchange事件 -->
    </div>
  </div>
</template>

<script>
import browserUA from '@/lib/browserUA'
export default {
  props: ['images', 'showDelete', 'deleteFunc', 'appearAnimation', 'addFunc', 'isUpload', 'router'],
  data () {
    return {
      statusText: {
        reading: '正在读取...',
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
    previewImage (idx, els, placeholder) {
      this.$previewImage.show({images: this.images, idx, clickedEl: els, placeholder: placeholder || null})
    },
    isAndroid () {
      return browserUA.isAndroid()
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
  display: block;
  margin-left: 1.055%;
  position: relative;
  overflow: hidden !important;
  transition: width 500ms, height 500ms, opacity 500ms, transform 500ms, padding-top 500ms;
  opacity: 1;
  transform: scale(1, 1);
  transform-origin: 0 0;
  background-color: #EEEEEE;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
.item-container[lazy=error]{
  background-size: 60%;
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
.fl{
    float: left;
}
.fr{
    float: right;
}
// .image-item{
//   display: block;
//   width: 100%;
//   height: 100%;
//   border: none;
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   -webket-touch-callout: default;
// }
// .image-item.horizontal{
//   width: auto;
//   height: 100%;
// }
// .image-item.vertical{
//   width: 100%;
//   height: auto;
// }
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
.gif-tag{
  width: 54px;
  height: 26px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-image: url("../../cwebassets/image/is_gif.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
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
