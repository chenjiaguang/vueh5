<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" ref="previewer" tabindex="-1" role="dialog" aria-hidden="true" :style="{zIndex: zIndex}">
    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>
    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">
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
        tapToClose: true,
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
      clickedEl: null
    }
  },
  mounted () {
    PhotoSwipeUI_Default.tapToClose = true
    PhotoSwipeUI_Default.tapToToggleControls = false
    let gallery = new PhotoSwipe(this.$refs['previewer'], PhotoSwipeUI_Default, this.images, this.options)
    gallery.init()
    gallery.listen('destroy', () => {
      let _body = document.getElementsByTagName('body')[0]
      _body.removeChild(this.$refs['previewer'])
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
