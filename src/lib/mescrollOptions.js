export default {
  get: function ($downOffset, $upOffset) {
    let maxWidth = window.innerWidth > (54 * 10) ? (54 * 10) : window.innerWidth // 最大宽度，flexible中html font-size都最大值的10倍
    let downOffset = (maxWidth / 750) * ($downOffset || 94)
    let upOffset = (maxWidth / 750) * ($upOffset || 100)
    let htmlContent = '<div class="pull-down-wrapper" style="height:' + downOffset + 'px">'
    htmlContent += '<img class="pull-down-icon" src="' + this.$assetsFullPath + 'image/refresh_icon.png" />'
    htmlContent += '<img class="pull-down-icon refreshing" src="' + this.$assetsFullPath + 'image/refreshing_icon.png" />'
    htmlContent += '</div>'
    let options = {
      down: {
        inited: (mescroll, downwarp) => {
          mescroll.refreshDom = downwarp.getElementsByClassName('pull-down-icon')[0]
          mescroll.refreshingDom = downwarp.getElementsByClassName('pull-down-icon')[1]
        },
        inOffset: (mescroll) => {
          mescroll.refreshDom.style.display = 'block'
          mescroll.refreshingDom.style.display = 'none'
        },
        showLoading: (mescroll) => {
          mescroll.refreshDom.style.display = 'none'
          mescroll.refreshingDom.style.display = 'block'
        },
        offset: downOffset,
        htmlContent: htmlContent,
        auto: false,
        autoShowLoading: true,
        callback: () => { }
      },
      up: {
        auto: false,
        offset: upOffset,
        callback: () => { },
        onScroll: () => { },
        htmlLoading: '<div class="pull-up-wrapper" style="height:' + upOffset + 'px"><div class="loading-content"><img class="loading-icon" src="' + this.$assetsFullPath + 'image/loading_icon.png" />正在加载...</div></div>',
        htmlNodata: '<div class="pull-up-wrapper" style="height:' + upOffset + 'px"><div class="loading-content">再刷也没有了</div></div>'
      }
    }
    return options
  }
}
