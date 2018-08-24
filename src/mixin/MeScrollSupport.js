let mixin = {
  // 进入路由时,恢复列表状态
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.mescroll) {
        // 滚动到之前列表的位置 (注意:路由使用keep-alive才生效)
        if (vm.mescroll.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop)
        }
      }
    })
  },
  // 离开路由时,记录列表状态
  beforeRouteLeave (to, from, next) {
    if (this.mescroll) {
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop()// 记录当前滚动条的位置
    }
    next()
  }
}
export default mixin
