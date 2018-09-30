import Vue from 'vue'
import Router from 'vue-router'
const NotFoundPage = resolve => require(['@/pages/notFoundPage'], resolve)
const Home = resolve => require(['@/pages/home'], resolve)
const CircleDetail = resolve => require(['@/pages/circle/detail'], resolve)
const CircleApply = resolve => require(['@/pages/circle/apply'], resolve)
const ActivityDetail = resolve => require(['@/pages/activity/detail'], resolve)
const ActivityDynamic = resolve => require(['@/pages/activity/dynamic'], resolve)
const ActivityOrder = resolve => require(['@/pages/activity/order'], resolve)
const ConfirmOrder = resolve => require(['@/pages/activity/confirmOrder'], resolve)
const WebPay = resolve => require(['@/pages/activity/webPay'], resolve)
const ActivitySuccess = resolve => require(['@/pages/activity/success'], resolve)
const ActivityTicket = resolve => require(['@/pages/activity/ticket'], resolve)
const MapPage = resolve => require(['@/pages/mapPage'], resolve)
const Agreement = resolve => require(['@/pages/agreement'], resolve)
const UserCenter = resolve => require(['@/pages/user/center'], resolve)
const EditDynamic = resolve => require(['@/pages/dynamic/edit'], resolve)
const EditDynamicRange = resolve => require(['@/pages/dynamic/chooseRange'], resolve)
const DynamicDetail = resolve => require(['@/pages/dynamic/detail'], resolve)
const DynamicSendComment = resolve => require(['@/pages/dynamic/sendComment'], resolve)
const TopicDetail = resolve => require(['@/pages/topic/detail'], resolve)
const SMSCode = resolve => require(['@/pages/smsCode'], resolve)
const WeixinLoginJump = resolve => require(['@/pages/weixinLoginJump'], resolve)
const PromotionIndex = resolve => require(['@/pages/promotion/index'], resolve)
const NewsDetail = resolve => require(['@/pages/news/articleDetail'], resolve)
const VideoMedia = resolve => require(['@/pages/media/video'], resolve)
// import NotFoundPage from '@/pages/notFoundPage'
// import Home from '@/pages/home'
// import CircleDetail from '@/pages/circle/detail'
// import CircleApply from '@/pages/circle/apply'
// import ActivityDetail from '@/pages/activity/detail'
// import ActivityDynamic from '@/pages/activity/dynamic'
// import ActivityOrder from '@/pages/activity/order'
// import ConfirmOrder from '@/pages/activity/confirmOrder'
// import WebPay from '@/pages/activity/webPay'
// import ActivitySuccess from '@/pages/activity/success'
// import ActivityTicket from '@/pages/activity/ticket'
// import MapPage from '@/pages/mapPage'
// import Agreement from '@/pages/agreement'
// import UserCenter from '@/pages/user/center'
// import EditDynamic from '@/pages/dynamic/edit'
// import EditDynamicRange from '@/pages/dynamic/chooseRange'
// import DynamicDetail from '@/pages/dynamic/detail'
// import DynamicSendComment from '@/pages/dynamic/sendComment'
// import TopicDetail from '@/pages/topic/detail'
// import SMSCode from '@/pages/smsCode'
// import WeixinLoginJump from '@/pages/weixinLoginJump'
// import PromotionIndex from '@/pages/promotion/index'
// import NewsDetail from '@/pages/news/articleDetail'
// import TestVideo from '@/pages/testVideo'
Vue.use(Router)
let prefix = '/h5'

const router = new Router({
  routes: [
    {
      path: '*', // 所有404页面，（未能正确匹配路由时显示的页面）
      name: 'NotFoundPage',
      meta: {
        title: '范团'
      },
      component: NotFoundPage
    },
    {
      path: prefix + '/',
      name: 'Home',
      component: Home
    },
    {
      path: prefix + '/activity/detail',
      name: 'ActivityDetail',
      component: ActivityDetail,
      meta: {
        title: '范团活动',
        keepAlive: true
      }
    },
    {
      path: prefix + '/activity/dynamic',
      name: 'ActivityDynamic',
      component: ActivityDynamic,
      meta: {
        title: '大家都在晒',
        keepAlive: true
      }
    },
    {
      path: prefix + '/activity/order',
      name: 'ActivityOrder',
      component: ActivityOrder,
      meta: {
        title: '提交订单'
      }
    },
    {
      path: prefix + '/activity/order/confirm',
      name: 'ConfirmOrder',
      component: ConfirmOrder,
      meta: {
        title: '确认订单',
        keepAlive: true
      }
    },
    {
      path: prefix + '/webPay', // 微信外h5支付回调页面
      name: 'WebPay',
      component: WebPay,
      meta: {
        title: '订单支付'
      }
    },
    {
      path: prefix + '/activity/success',
      name: 'ActivitySuccess',
      component: ActivitySuccess,
      meta: {
        title: '报名成功'
      }
    },
    {
      path: prefix + '/activity/ticket',
      name: 'ActivityTicket',
      component: ActivityTicket,
      meta: {
        title: '电子票'
      }
    },
    {
      path: prefix + '/map',
      name: 'mapPage',
      component: MapPage,
      meta: {
        title: '查看地图'
      }
    },
    {
      path: prefix + '/agreement',
      name: 'Agreement',
      component: Agreement,
      meta: {
        title: ''
      }
    },
    {
      path: prefix + '/circle/detail',
      name: 'CircleDetail',
      component: CircleDetail,
      meta: {
        title: '范团圈子',
        keepAlive: true
      }
    },
    {
      path: prefix + '/user/center',
      name: 'UserCenter',
      component: UserCenter,
      meta: {
        title: '范团名片',
        keepAlive: true
      }
    },
    {
      path: prefix + '/dynamic/edit',
      name: 'EditDynamic',
      component: EditDynamic,
      meta: {
        title: '发动态',
        keepAlive: true
      }
    },
    {
      path: prefix + '/dynamic/chooserange',
      name: 'EditDynamicRange',
      component: EditDynamicRange,
      meta: {
        title: '选择可见范围'
      }
    },
    {
      path: prefix + '/dynamic/detail',
      name: 'DynamicDetail',
      component: DynamicDetail,
      meta: {
        keepAlive: true
      }
    },
    {
      path: prefix + '/smsCode',
      name: 'SMSCode',
      component: SMSCode
    },
    {
      path: prefix + '/weixinLoginJump',
      name: 'WeixinLoginJump',
      component: WeixinLoginJump,
      meta: {
        title: '正在登陆'
      }
    },
    {
      path: prefix + '/dynamic/sendComment',
      name: 'DynamicSendComment',
      component: DynamicSendComment,
      meta: {
        title: '评论'
      }
    },
    {
      path: prefix + '/topic/detail',
      name: 'TopicDetail',
      component: TopicDetail,
      meta: {
        title: '范团话题',
        keepAlive: true
      }
    },
    {
      path: prefix + '/promotion/index',
      name: 'PromotionIndex',
      component: PromotionIndex,
      meta: {
        title: '范团'
      }
    },
    {
      path: prefix + '/news/detail',
      name: 'NewsDetail',
      component: NewsDetail,
      meta: {
        title: '范团'
      }
    },
    {
      path: prefix + '/media/video',
      name: 'VideoMedia',
      component: VideoMedia,
      meta: {
        title: '视频播放'
      }
    },
    {
      path: prefix + '/circle/apply',
      name: 'CircleApply',
      component: CircleApply,
      meta: {
        title: '入圈申请'
      }
    }
  ],
  hashbang: false,
  history: true,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    // let i = document.createElement('iframe')
    // i.src = 'https://www.baidu.com/favicon.ico'
    // i.style.display = 'none'
    // i.onload = () => {
    //   i.remove()
    // }
    document.title = to.meta.title
    // document.body.appendChild(i)
    next()
  } else {
    document.title = '\u200E'
    next()
  }
})

export default router
