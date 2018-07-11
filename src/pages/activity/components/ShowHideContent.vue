<template>
    <div class="content-container" ref="contentWrapper" :style="{height: showMore ? (contentWrapperHeight + 'px') : (halfScreenHeight + 'px')}">
        <div ref="contentContainer">
          <div ref="contentHeader" class="header">活动介绍</div>
          <div ref="contentContext" class="content-context">
              <template v-for="(item, idx) in content">
                <p :key="idx" v-if="item.type === '1'" @load="load">{{item.content}}</p>
                <img :key="idx" v-else-if="item.type === '2'" :src="item.content.image" @load="load" />
              </template>
          </div>
        </div>
        <div v-if="contentWrapperHeight && contentWrapperHeight > halfScreenHeight" ref="contentBtn" class="show-hide-btn" @click="changeShowContext"><span class="show-hide-text">{{showMore ? '收起' : '查看更多图文详情'}}<i class="pull-sign iconfont icon-pull_down" :style="{transform: showMore ? 'scale(0.25) rotate(180deg)' : 'scale(0.25) rotate(0)'}"></i></span></div>
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
    font-weight: 600;
    padding-bottom: 25px;
    padding-top: 66px;
  }
  .content-context{
    padding-bottom: 21px;
    white-space: pre-wrap;
  }
  .content-context img{
    display: block;
    margin: 21px 0;
    width: 100%;
  }
  .show-hide-btn{
    width: 92%;
    height: 84px;
    background-color: #fff;
    margin-left: 4%;
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
export default {
  props: {
    content: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      initial: false,
      setted: false,
      showMore: false, // 显示更多
      contentWrapperHeight: null,
      halfScreenHeight: parseInt(window.innerHeight * 0.5),
    }
  },
  methods: {
    changeShowContext () {
      let currentHeight = this.$refs['contentWrapper'].offsetHeight
      if (currentHeight > this.halfScreenHeight) {
        this.$refs['contentContainer'].style.height = this.halfScreenHeight + 'px'
        this.showMore = false
      } else {
        this.$refs['contentContainer'].style.height = this.contentWrapperHeight + 'px'
        this.showMore = true
      }
    },
    load () {
      this.$nextTick(() => {
        let btnHeight = (84 / 750) * window.innerWidth
        let wrapperHeight = this.$refs['contentContainer'].offsetHeight
        if (wrapperHeight > this.halfScreenHeight && !this.$refs['contentBtn']) { // 大于半屏且未显示切换按钮
          this.contentWrapperHeight = wrapperHeight + btnHeight
        } else {
          this.contentWrapperHeight = wrapperHeight
        }
      })
    }
  }
}
</script>
