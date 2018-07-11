<template>
  <transition appear appear-class="before-appear">
      <div :id="id" :style="'z-index:' + new Date().getTime()" class="modal-wrapper" @touchmove.prevent>
          <div class="modal-box">
            <div class="content-box" v-html="text"></div>
            <div @click="hideAlert" class="button-box">
                <div class="main-btn">确定</div>
            </div>
          </div>
      </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
        id: '',
        text: '',
        onClose: function () {}
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
    .content-box{
        font-size: 34px;
        line-height: 48px;
        font-weight: 600;
        color: #030303;
        text-align: center;
        padding: 36px 50px;
    }
    .button-box{
        position:relative;
        color: #0076FF;
        text-align: center;
        height: 88px;
        line-height: 88px;
        font-size: 34px;
    }
    .button-box:before{
        content: "";
        display: block;
        width: 300%;
        height: 3px;
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(0.3333, 0.3333);
        transform-origin: 0 0;
        background-color: #4D4D4D;
    }
    .main-btn{
        font-weight: 600;
    }
</style>
