let mixin = {
  // 进入路由时,恢复列表状态
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log('mescroll')
      if (vm.mescroll && vm.mescroll instanceof Array) {
        // 滚动到之前列表的位置 (注意:路由使用keep-alive才生效)
        for (let i = 0; i < vm.mescroll.length; i++) {
          if (vm.mescroll[i].lastScrollTop) {
            vm.mescroll[i].setScrollTop(vm.mescroll[i].lastScrollTop)
          }
        }
      } else if (vm.mescroll && !(vm.mescroll instanceof Array)) {
        if (vm.mescroll.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop)
        }
      }
    })
  },
  // 离开路由时,记录列表状态
  beforeRouteLeave (to, from, next) {
    if (this.mescroll && this.mescroll instanceof Array) {
      for (let i = 0; i < this.mescroll.length; i++) {
        this.mescroll[i].lastScrollTop = this.mescroll[i].getScrollTop()// 记录当前滚动条的位置
        console.log('lastScrollTop', this.mescroll[i].getScrollTop())
      }
    } else {
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop()// 记录当前滚动条的位置
    }
    next()
  }
}
export default mixin
