<template>
    <transition appear appear-class="before-appear">
        <div class="container" :id="id" ref="mySwiper" :style="{width: swiperOption.width + 'px', height: swiperOption.height + 'px', zIndex: timestap}" @click.stop="close" @touchmove.prevent>
            <swiper class="swiper-wrapper" :options="swiperOption">
                <!-- slides -->
                <swiper-slide class="swiper-item" v-for="(item, idx) in images" :key="idx">
                    <div class="swiper-item-content swiper-zoom-container">
                        <img class="image" :src="item" />
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </transition>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  data () {
    return {
      id: '',
      images: [],
      swiperOption: {
        initialSlide: 0,
        setWrapperSize: true,
        zoom: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        }
      },
      timestap: 999
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    close () {
      this.$previewImage.hide(this.id)
      this.onHide()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .container{
        position: fixed;
        transform: scale(1, 1);
        top: 0;
        left: 0;
        transition: transform 300ms;
        &.before-appear{
            transform: scale(0.8, 0.8);
        }
    }
    .swiper-wrapper{
        width: 100%;
        height: 100%;
        background-color: #000;
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
    }
    .swiper-item{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        position: relative;
    }
    .swiper-item-content{
        width: 100%;
        height: 100%;
        // max-height:100%;
        // position: absolute;
        // left: 0;
        // top: 50%;
        // transform: translateY(-50%);
        // overflow-x: hidden;
        // overflow-y: auto;
    }
    .image{
        display: block;
        width: 100%;
    }
</style>
