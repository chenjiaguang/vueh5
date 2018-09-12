<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" ref="previewer" tabindex="-1" role="dialog" aria-hidden="true" :style="{zIndex: zIndex}" @touchmove.prevent>
    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>
    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap" @click.stop="close">
        <!-- Container that holds slides.
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <!--  Controls are self-explanatory. Order can be changed. -->
                <div class="pswp__counter custom-counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.min.js'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
// 浏览图片用photoswipe
export default {
  data () {
    return {
      images: [],
      options: {
        closeOnVerticalDrag: true,
        // hideAnimationDuration: 0,
        showHideOpacity: true,
        pinchToClose: false,
        // tapToClose: true,
        tapToToggleControls: false,
        closeEl: false,
        captionEl: false,
        fullscreenEl: false,
        zoomEl: false,
        shareEl: false,
        counterEl: true,
        arrowEl: false,
        preloaderEl: true,
        loop: false,
        getThumbBoundsFn: (index) => {
          // find thumbnail element
          var thumbnail = this.clickedEl
          // get window scroll Y
          var pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          var rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      zIndex: 999,
      clickedEl: null,
      gallery: null,
      startPos: {
        x: null,
        y: null
      },
      endTimeStamp: null
    }
  },
  methods: {
    close () {
      console.log('close')
      if (this.gallery) {
        this.gallery.close()
      }
    }
  },
  mounted () {
    this.gallery = new PhotoSwipe(this.$refs['previewer'], PhotoSwipeUI_Default, this.images, this.options)
    this.gallery.init()
    this.gallery.listen('destroy', () => {
      let _body = document.getElementsByTagName('body')[0]
      _body.removeChild(this.$refs['previewer'])
      this.gallery = null
    })
    // let _this = this
    // this.gallery.framework.bind(this.gallery.scrollWrap /* bind on any element of gallery */, 'pswpTap', function (e) {
    //   console.log('tap', e, e.detail.releasePoint)
    // //   e.detail.origEvent  // original event that finished tap (e.g. mouseup or touchend)
    // //   e.detail.target // e.target of original event
    // //   e.detail.releasePoint // object with x/y coordinates of tap
    // //   e.detail.pointerType // mouse, touch, or pen
    // //   _this.gallery.close()
    // //   if (e.detail.target.className === 'pswp__img') {
    // //     e.stopPropagation()
    // //     // e.preventDefault()
    // //     return true
    // //   }
    // })
    let _this = this
    this.gallery.listen('preventDragEvent', function (e, isDown, preventObj) {
      // e - original event
      // isDown - true = drag start, false = drag release

      // Line below will force e.preventDefault() on:
      // touchstart/mousedown/pointerdown events
      // as well as on:
      // touchend/mouseup/pointerup events
    //   console.log('isDown', e)
      console.log('preventDragEvent', e)
      if (isDown) {
        if (_this.gallery.timer) {
          clearTimeout(_this.gallery.timer)
        }
        _this.startPos.x = parseInt(e.changedTouches[0].pageX)
        _this.startPos.y = parseInt(e.changedTouches[0].pageY)
        _this.startPos.timestamp = e.timeStamp
      } else if (!isDown && parseInt(e.changedTouches[0].pageX) === _this.startPos.x && parseInt(e.changedTouches[0].pageY) === _this.startPos.y && e.timeStamp - _this.startPos.timestamp < 300 && (!_this.endTimeStamp || e.timeStamp - _this.endTimeStamp > 300)) {
        _this.gallery.timer = setTimeout(() => {
          _this.gallery && _this.gallery.close()
        }, 300)
      }
      if (isDown && e.target.className === 'pswp__img') {
        preventObj.prevent = false
      } else {
        preventObj.prevent = true
        _this.endTimeStamp = e.timeStamp
      }
    })
  }
}
</script>

<style lang="scss" scoped>
    .custom-counter{
        font-size: 34px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        top: 77px;
        left: 0;
    }
    .pswp__top-bar{
        background: transparent;
        width: 100%;
        height: 194px;
    }
</style>
