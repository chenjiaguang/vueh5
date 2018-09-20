<template>
  <transition appear appear-class="before-appear">
      <div :id="id" :style="'z-index:' + new Date().getTime()" class="modal-wrapper" @touchmove.prevent>
          <div class="modal-box" :class="os">
            <div class="content-box" :class="os" v-html="text"></div>
            <div @click="hideAlert" class="button-box" :class="os">
                <div class="main-btn" :class="os">{{btnText}}</div>
            </div>
          </div>
      </div>
  </transition>
</template>

<script>
import browserUA from '@/lib/browserUA'
export default {
  data () {
    return {
      id: '',
      text: '',
      onClose: function () {},
      btnText: '确定',
      os: browserUA.isAndroid() ? 'android' : 'ios'
    }
  },
  methods: {
    hideAlert () {
      this.$modal.hideAlert(this.id, this.onClose)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .modal-wrapper{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.5);
        transition: background-color 300ms;
        &.before-appear {
            background-color:  rgba(0,0,0,0);
        }
    }
    .modal-box{
        width: 540px;
        border-radius: 24px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -270px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 1;
        transition: opacity 100ms;
        &.before-appear {
            opacity: 0;
        }
    }
    .modal-box.ios{
        width: 540px;
        border-radius: 24px;
        margin-left: -270px;
    }
    .modal-box.android{
        width: 650px;
        border-radius: 4px;
        margin-left: -325px;
    }
    .content-box{
        font-size: 34px;
        line-height: 48px;
        font-weight: 600;
        color: #030303;
    }
    .content-box.ios{
        text-align: center;
        padding: 20px 36px;
    }
    .content-box.android{
      text-align: left;
      padding: 23px 30px;
    }
    .button-box{
        position:relative;
        color: #0076FF;
        text-align: center;
        height: 88px;
        line-height: 88px;
        font-size: 34px;
        display: flex;
    }
    .button-box.ios{
        justify-content: center;
        align-items: center;
    }
    .button-box.android{
        justify-content: flex-end;
        align-items: center;
    }
    .button-box.ios:before{
        content: "";
        display: block;
        width: 200%;
        height: 2px;
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(0.5, 0.5);
        transform-origin: 0 0;
        background-color: #4D4D4D;
        opacity: 0.78;
    }
    .button-box.android:before{
        display: none;
    }
    .main-btn{
        padding: 0 30px;
    }
</style>
