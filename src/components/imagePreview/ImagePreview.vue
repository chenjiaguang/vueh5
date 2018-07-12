<template>
    <transition appear appear-class="before-appear">
        <swiper class="swiper-container" :id="id" :options="swiperOption" ref="mySwiper" :style="{width: swiperOption.width + 'px', height: swiperOption.height + 'px'}">
            <div class="swiper-wrapper">
                <!-- slides --> 
                <swiper-slide v-for="(item, idx) in images" :key="idx"><img class="image" :src="item" /></swiper-slide>
            </div>
            <!-- Optional controls -->
            <div class="swiper-pagination"></div>
            <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
            <!-- <div class="swiper-button-next" slot="button-next"></div> -->
            <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
        </swiper>
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
                width: window.innerWidth,
                height: window.innerHeight,
                on: {
                    tap: function () {
                        
                    }
                },
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction'
                }
            }
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    methods: {
        close () {
            this.$previewImage.hide(id)
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .swiper-wrapper{
        background-color: #000;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .image{
        width: 100%
    }
    .swiper-pagination{
        position: absolute;
        color: #fff;
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 34px;
        left: 0;
        top: 64px;
    }
</style>
