<template>
    <div class="content-container">
      <div :style="{height: (contextHeight && !showMore && contextHeight > halfScreenHeight) ? (halfScreenHeight + 'px') : 'auto', position: 'relative', overflow: 'hidden'}">
        <div class="header">活动介绍</div>
        <div v-resize.initial="resize" class="content-context">
          <div v-if="htmlContent" v-html="htmlContent" style="overflow-x:auto"></div>
          <template v-else v-for="(item, idx) in content">
            <p :key="idx" v-if="item.type === '1'" class="content-text">{{item.content}}</p>
            <div :key="idx" v-else-if="item.type === '2' && item.content" class="image-box">
              <img ref="contentImage" :src="item.content.image" class="image" @click.stop="() => preview(contentImages.idxArr.indexOf(idx), $refs['contentImage'][contentImages.idxArr.indexOf(idx)], item.content.image)" />
              <div v-if="item.content.description" class="description">{{item.content.description}}</div>
            </div>
          </template>
        </div>
        <div v-if="contextHeight && contextHeight > halfScreenHeight" :style="{position: (contextHeight && !showMore && contextHeight > halfScreenHeight) ? 'absolute' : 'static', bottom: 0, left: 0}" ref="contentBtn" class="show-hide-btn" @click.stop="changeShowContext"><span class="show-hide-text">{{showMore ? '收起' : '查看更多图文详情'}}<i class="pull-sign iconfont icon-pull_down" :style="{transform: showMore ? 'scale(0.25) rotate(180deg)' : 'scale(0.25) rotate(0)'}"></i></span></div>
      </div>
    </div>
</template>

<style scoped>
  .content-container{
    padding: 0 4%;
    font-size:28px;
    line-height: 46px;
    position: relative;
    overflow: hidden;
    transition: height 300ms;
  }
  .header{
    font-size: 32px;
    line-height: 44px;
    font-weight: bold;
    padding-bottom: 25px;
    padding-top: 66px;
  }
  .content-context{
    margin-bottom: 21px;
  }
  .content-context /deep/ .fant-image{
    max-width: 100%;
  }
  .content-text{
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .image-box{
    width: 100%;
    margin: 21px 0;
  }
  .image{
    display: block;
    width: 100%;
  }
  .description{
    font-size: 24px;
    line-height: 34px;
    color: #999;
    padding: 13px 0 35px;
    text-align: center;
  }
  .show-hide-btn{
    width: 110%;
    height: 84px;
    background-color: #fff;
    margin-left: -5%;
    line-height:84px;
    font-size: 24px;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .show-hide-btn:after{
    content: "";
    display: block;
    width: 200%;
    height: 2px;
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: 0 0;
    background-color: #e5e5e5;
  }
  .show-hide-text{
    display: inline-block;
    position: relative;
    padding-right:35px;
  }
  .pull-sign{
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -38px;
    margin-right: -24px;
    display: block;
    width: 72px;
    height: 72px;
    line-height: 72px;
    font-size:72px;
    color: #333;
    transform-origin: 50% 50%;
    transition: all 300ms;

  }
</style>

<script>
import resize from 'vue-resize-directive'
export default {
  directives: {
    resize
  },
  props: {
    content: {
      type: Array,
      required: true
    },
    htmlContent: {
      type: String,
      required: false
    },
    router: {
      required: false
    }
  },
  data () {
    return {
      initial: false,
      setted: false,
      showMore: false, // 显示更多
      contextHeight: null,
      halfScreenHeight: parseInt(window.innerHeight * 0.5)
    }
  },
  methods: {
    changeShowContext () {
      this.showMore = !this.showMore
    },
    resize (ele) {
      let pos = ele.getBoundingClientRect()
      this.contextHeight = pos.height
    },
    preview (idx, el, placeholder) {
      this.$previewImage.show({images: this.contentImages.imageArr, idx, clickedEl: el, placeholder})
    }
  },
  computed: {
    contentImages () {
      let imageArr = []
      let idxArr = []
      this.content.forEach((item, idx) => {
        if (item.type.toString() === '2') {
          imageArr.push({
            width: item.width,
            height: item.height,
            url: item.content.image
          })
          idxArr.push(idx)
        }
      })
      let obj = {imageArr, idxArr}
      return obj
    }
  }
}
</script>
