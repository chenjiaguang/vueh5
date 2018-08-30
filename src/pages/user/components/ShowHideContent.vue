<template>
    <div class="content-container" ref="contentWrapper">
        <div ref="contentContainer" class="content-text clearfix"><img v-if="isLongDynamic" :src="$assetsPublicPath + '/cwebassets/image/long_dynamic.png'" class="long-dynamic-icon" /><div style="display:inline" v-html="convertedContent"></div></div>
        <div v-if="contentHeight && contentHeight > contentMaxHeight && !showMore" ref="contentBtn" class="show-hide-btn clearfix"><span @click.stop="changeShowContext" class="show-hide-btn-text fr">{{showMore ? '收起' : '展开'}}</span></div>
    </div>
</template>

<style scoped>
  .content-container{
    position: relative;
    overflow: hidden;
  }
  .content-text{
    font-size:32px;
    line-height: 48px;
    margin-bottom: 17px;
    overflow: hidden;
    transition: all 300ms;
    white-space: normal;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .clearfix:after{
    content: "";
    display: block;
    width: 100%;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .show-hide-btn{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .show-hide-btn-text{
    display: block;
    line-height: 48px;
    font-size: 32px;
    color: #1EB0FD;
    padding-left: 50px;
    padding-bottom: 17px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1))
  }
  .long-dynamic-icon{
    vertical-align: middle;
    height: 30px;
    margin: -4px 10px 0 0;
    padding: 0;
    border: none;
    display: inline-block !important;
  }
</style>

<script>
import utils from '@/lib/utils'
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    isLongDynamic: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showMore: false, // 显示更多
      contentHeight: null,
      contentMaxHeight: window.innerWidth / 750 * 240
    }
  },
  methods: {
    changeShowContext () {
      let currentHeight = this.$refs['contentContainer'].offsetHeight
      if (currentHeight > this.contentMaxHeight) {
        this.$refs['contentContainer'].style.maxHeight = this.contentMaxHeight + 'px'
        this.showMore = false
      } else {
        this.$refs['contentContainer'].style.maxHeight = this.contentHeight + 'px'
        this.showMore = true
      }
    },
    load () {
      this.$nextTick(() => {
        let wrapperHeight = this.$refs['contentContainer'].offsetHeight
        this.contentHeight = wrapperHeight
        let _lineHeight = parseFloat(window.getComputedStyle(this.$refs['contentContainer'], false).lineHeight)
        this.contentMaxHeight = Math.ceil(_lineHeight * 5)
        if (this.contentHeight > this.contentMaxHeight) {
          this.showMore = false
          this.$refs['contentContainer'].style.maxHeight = this.contentMaxHeight + 'px'
        } else {
          this.showMore = true
        }
      })
    }
  },
  computed: {
    convertedContent: function () {
      return utils.handleContentUrl(this.content)
    }
  },
  mounted () {
    this.load()
  },
  updated () {
    if (this.contentHeight) {
      return false
    }
    this.load()
  }
}
</script>
