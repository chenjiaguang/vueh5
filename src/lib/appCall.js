export default function (func, overlay) {
  console.log(`调用${arguments[0]}方法`)
  let new_arguments = []
  for (let i = 0; i < arguments.length; i++) {
    if (i !== 0) {
      new_arguments.push(arguments[i])
    }
  }
  if (isAndroid()) { // Android
    if (arguments[0] === 'getToken') { // 获取token
      window._token = window.android[arguments[0]]()
    } else if (arguments[0] === 'getLongitude') { // 获取经度
      window._lng = window.android[arguments[0]]()
    } else if (arguments[0] === 'getLatitude') { // 获取纬度
      window._lat = window.android[arguments[0]]()
    } else if (arguments[0] === 'goShopDetail') {
      window.android[arguments[0]] && window.android[arguments[0]](arguments[1])
    } else if (arguments[0] === 'isFanTuan') {
      window._is_app = parseInt(window.android[arguments[0]]())
    } else if (arguments[0] === 'goUserCard') {
      window.android[arguments[0]] && window.android[arguments[0]](arguments[2], arguments[3], arguments[4])
    } else if (arguments[0] === 'goDynamicDetail') {
      window.android['goActDetail'] && window.android['goActDetail'](arguments[1])
    } else if (arguments[0] === 'goLongDynamic') {
      window.android['goLongDetail'] && window.android['goLongDetail'](arguments[1])
    } else if (arguments[0] === 'h5GoUserCenter') { // 跳转用户名片
      window.android[arguments[0]] && window.android[arguments[0]](arguments[1])
    } else if (arguments[0] === 'h5GoArticleDetail') { // 跳转文章详情页
      window.android[arguments[0]] && window.android[arguments[0]](arguments[1])
    } else if (new_arguments.length) { // 有参数时
      window.android[arguments[0]] && window.android[arguments[0]](...new_arguments)
    } else { // 无参数时
      window.android[arguments[0]] && window.android[arguments[0]]()
    }
  }

  if (isIOS()) { // Ios
    let url = window.location.href
    let request_str = ''
    if (!new_arguments.length) { // 无参数时
      request_str = `_${arguments[0]}`
    } else if (arguments[0] === 'goReview') { // 去评价
      request_str = `_${arguments[0]}={"order_id":"${arguments[1]}"}`
    } else if (arguments[0] === 'setRightShopSearch') { // 设置购物中心详情页右上角搜索icon
      request_str = `_${arguments[0]}={"mall_id":"${arguments[1]}","name":"${arguments[2]}"}`
    } else if (arguments[0] === 'goMallHomePage') { // 购物中心详情页跳转楼层
      request_str = `_${arguments[0]}={"title":"${arguments[1]}","floorId":"${arguments[2]}","centerId":"${arguments[3]}","floorName":"${arguments[4]}"}`
    } else if (arguments[0] === 'goPayView') { // 唤起原生支付
      request_str = `_${arguments[0]}=${arguments[1]}`
    } else if (arguments[0] === 'setRightButtonText') {
      request_str = `_${arguments[0]}={"title":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'goShopDetail') {
      request_str = `_${arguments[0]}={"mid":${JSON.stringify(arguments[1])},"name":${JSON.stringify(arguments[2])}}`
    } else if (arguments[0] === 'goModifyPassword') {
      request_str = `_${arguments[0]}={"phone":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'goShopNews') {
      request_str = `_${arguments[0]}={"mall_id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'goShopSay') {
      request_str = `_${arguments[0]}={"mid":"${arguments[1]}","name":"${arguments[2]}","score":"${arguments[3]}","logo":"${arguments[4]}"}`
    } else if (arguments[0] === 'shareView') {
      request_str = `_${arguments[0]}={"shareTitle":${JSON.stringify(arguments[1])},"shareDescription":${JSON.stringify(arguments[2])},"url":${JSON.stringify(arguments[3])}}`
    } else if (arguments[0] === 'goUserCard') {
      request_str = `_${arguments[0]}={"title":${JSON.stringify(arguments[1])},"uid":${JSON.stringify(arguments[2])},"isNews":${arguments[3]},"type":${arguments[4]}}`
    } else if (arguments[0] === 'shareWXFriends' || arguments[0] === 'shareWXTimeline') {
      request_str = `_${arguments[0]}={"shareTitle":${JSON.stringify(arguments[2])},"shareDescription":${JSON.stringify(arguments[3])},"url":${JSON.stringify(arguments[4])}}`
    } else if (arguments[0] === 'copyUrl') {
      request_str = `_${arguments[0]}`
    } else if (arguments[0] === 'goDynamicDetail') {
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'goLongDynamic') {
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'goSelectPic') {
      request_str = `_goUploadPic`
    } else if (arguments[0] === 'goGallery') {
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoShortDynamic') { // 跳转短动态
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoLongDynamic') { // 跳转长文
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoPublishShortDynamic') { // 跳转发布短动态
      request_str = `_h5GoPublishShortDynamic`
    } else if (arguments[0] === 'h5GoActivityDetail') { // 跳转活动详情页
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoActivityDynamic') { // 跳转活动晒图页
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])},"circleName":${JSON.stringify(arguments[2])},"actId":${JSON.stringify(arguments[3])},"actName":${JSON.stringify(arguments[4])}}`
    } else if (arguments[0] === 'h5GoOrder') { // 跳转活动购票页面
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoConfirmOrder') { // 跳转确认订单页
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoTicket') {
      request_str = `_${arguments[0]}={"checkcode":${JSON.stringify(arguments[1])}}`
    } else if (arguments[0] === 'h5GoArticleDetail') {
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])},"url":${JSON.stringify(arguments[2])}}`
    } else if (arguments[0] === 'h5GoApplyCircle') { // 跳转申请加入群组
      request_str = `_${arguments[0]}={"circleid":${JSON.stringify(arguments[1])},"name":${JSON.stringify(arguments[2])},"cover":${JSON.stringify(arguments[3])}}`
    } else if (arguments[0] === 'h5GoCircleDetail') { // 跳转群组详情
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])},"name":${JSON.stringify(arguments[2])},"hasAct":${JSON.stringify(arguments[3])}}`
    } else if (arguments[0] === 'h5GoTopicDetail') { // 跳转话题详情
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])},"title":${JSON.stringify(arguments[2])},"content":${JSON.stringify(arguments[3])},"tcName":${JSON.stringify(arguments[4])},"coverUrl":${JSON.stringify(arguments[5])},"dyCount":${JSON.stringify(arguments[6])}}`
    } else if (arguments[0] === 'h5GoUserCenter') { // 跳转用户名片
      request_str = `_${arguments[0]}={"id":${JSON.stringify(arguments[1])},"is_news":${JSON.stringify(arguments[2])},"type":${JSON.stringify(arguments[3])}}`
    }
    url += request_str
    console.log('ios请求url', url)
    let iFrame = document.createElement('iframe')
    iFrame.setAttribute('src', url)
    iFrame.setAttribute('style', 'display:none;')
    iFrame.setAttribute('height', '0px')
    iFrame.setAttribute('width', '0px')
    iFrame.setAttribute('frameborder', '0')
    document.body.appendChild(iFrame)
    // 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
    iFrame.parentNode.removeChild(iFrame)
    iFrame = null
  }

  function isAndroid () {
    return Boolean(window.android)
  }
  function isIOS () {
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }
}
