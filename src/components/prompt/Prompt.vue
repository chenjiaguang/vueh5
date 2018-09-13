<template>
  <transition appear appear-class="before-appear">
      <div :id="id" :style="'z-index:' + new Date().getTime()" class="prompt-wrapper" @touchmove.prevent>
          <div class="prompt-box" :class="os">
            <div class="content-box" :class="os">{{contentText}}</div>
            <div class="button-box" :class="os">
              <div class="btn left-btn" @click.stop="onCancel" :class="os"><span>{{leftText || '取消'}}</span></div>
                <div class="btn right-btn" @click.stop="onConfirm" :class="os"><span>{{rightText || '确定'}}</span></div>
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
      contentText: '',
      leftText: '',
      rightText: '',
      cancel: function () {},
      confirm: function () {},
      os: !browserUA.isAndroid() ? 'android' : 'ios'
    }
  },
  methods: {
    onCancel () {
      this.$prompt.hidePrompt(this.id, this.cancel)
    },
    onConfirm () {
      this.$prompt.hidePrompt(this.id, this.confirm)
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .prompt-wrapper{
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
    .prompt-box{
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateY(-50%);
        opacity: 1;
        transition: opacity 100ms;
        &.before-appear {
            opacity: 0;
        }
    }
    .prompt-box.ios{
        width: 540px;
        border-radius: 24px;
        margin-left: -270px;
    }
    .prompt-box.android{
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
        padding: 55px 36px;
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
        justify-content: space-around;
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
    .btn{
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn.ios{
      flex: 1;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn.android{
      padding: 0 30px 0 40px;
    }
    .btn.ios:before{
      content: "";
      display: block;
      width: 2px;
      height: 200%;
      background: #4D4D4D;
      opacity: 0.78;
      position: absolute;
      left: 0;
      top: 0;
      transform: scale(0.5, 0.5);
      transform-origin: 0 0;
    }
    .btn.ios:first-child:before{
      display: none;
    }
    .left-btn{
      font-size: 34px;
      line-height: 40px;
        font-weight: normal;
        color: #999;
    }
    .right-btn{
      font-size: 34px;
      line-height: 40px;
        font-weight: 600;
        color: #0076FF;
    }
</style>
