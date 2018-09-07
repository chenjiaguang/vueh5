let mixin = {
  // 离开路由时,关掉查看大图
  beforeRouteUpdate (to, from, next) {
    if (!to.query.previewImage && from.query.previewImage) { // 点击大图后返回
      if (window.previewImageId) {
        this.$previewImage.hide(window.previewImageId)
        window.previewImageId = null
      }
    }
    next()
  }
}
export default mixin
