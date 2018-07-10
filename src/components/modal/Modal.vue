<template>
  <transition appear appear-class="before-appear">
      <div :id="id" class="modal-wrapper">
          <div class="modal-box">
            <div :style="'z-index:' + new Date().getTime()" class="toast-box">{{text}}</div>
            <div @click="hideAlert">确定</div>
          </div>
      </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
        id: '',
        text: ''
    }
  },
  methods: {
    hideAlert () {
      this.$modal.hideAlert()
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
    .modal-wrapper{
        position: 'fixed';
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
    }
    .modal-box{
        
    }
</style>
