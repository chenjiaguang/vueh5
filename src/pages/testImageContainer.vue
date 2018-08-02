<template>
  <div class="test-box">
    <image-container :images="images" :showDelete="true" @deleteFunc="deleteFunction" />
    <div>
      <div v-for="(item, idx) in imgLinks" :key="idx">
        <cube-button :light="true" @click="add(idx)">添加{{idx + 1}}</cube-button>
        <cube-button @click="deleteImage(item, idx)">删除{{idx + 1}}</cube-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ImageContainer from '@/components/ImageContainer.vue'
import {
    /* eslint-disable no-unused-vars */
    Button
  } from 'cube-ui'
Vue.use(Button)
export default {
  data () {
    return {
      images: [],
      imgLinks: [
        {
          url: 'http://pic9.photophoto.cn/20081128/0033033999061521_b.jpg',
          width: '1024',
          height: '739'
        },
        {
          url: 'http://img5.imgtn.bdimg.com/it/u=2609732996,3987684265&fm=27&gp=0.jpg',
          width: '500',
          height: '889'
        },
        {
          url: 'http://www.znsfagri.com/uploadfile/editor/image/20170626/20170626151136_11631.jpg',
          width: '2880',
          height: '1800'
        },
        {
          url: 'http://pic.58pic.com/58pic/15/10/19/80W58PICBsP_1024.jpg',
          width: '631',
          height: '526'
        },
        {
          url: 'http://img.zcool.cn/community/01bc705812f626a84a0e282b9369b2.jpg',
          width: '640',
          height: '4200'
        },
        {
          url: 'http://img.mp.itc.cn/upload/20170324/663c85eae74f4320a3e382f03af76d52_th.jpg',
          width: '2560',
          height: '1440'
        },
        {
          url: 'http://www.wallcoo.com/nature/2009_Landscape_1680_Desktop_05/wallpapers/1280x1024/Rugged%20Mountains.jpg',
          width: '1280',
          height: '1024'
        },
        {
          url: 'http://s3.sinaimg.cn/middle/804992c8xb3280cad8292&690',
          width: '690',
          height: '459'
        },
        {
          url: 'http://up.enterdesk.com/edpic_source/aa/f1/87/aaf187b276a69105adc4d5bfd69f2887.jpg',
          width: '640',
          height: '1136'
        }
      ]
    }
  },
  components: {ImageContainer},
  methods: {
    add (idx) {
      let img = this.imgLinks[idx]
      this.images.push(img)
    },
    deleteImage (item, idx) {
      this.images.splice(idx, 1)
    },
    deleteFunction (item, idx) {
      this.deleteImage(item, idx)
    }
  }
}
</script>

<style scoped>
.test-box{
  width: 70%;
  background: pink;
  padding: 0;
  margin: 0;
}
</style>

