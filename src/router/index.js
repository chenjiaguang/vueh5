import Vue from 'vue'
import Router from 'vue-router'
import NotFoundPage from '@/pages/notFoundPage'
import Home from '@/pages/home'
import CircleDetail from '@/pages/circle/detail'
import ActivityDetail from '@/pages/activity/detail'
import ActivityDynamic from '@/pages/activity/dynamic'
import ActivityOrder from '@/pages/activity/order'
import WebPay from '@/pages/activity/webPay'
import ActivitySuccess from '@/pages/activity/success'
import ActivityTicket from '@/pages/activity/ticket'
import MapPage from '@/pages/mapPage'
import Agreement from '@/pages/agreement'
import UserCenter from '@/pages/user/center'
import EditDynamic from '@/pages/dynamic/edit'
import EditDynamicRange from '@/pages/dynamic/chooseRange'
import DynamicDetail from '@/pages/dynamic/detail'
import DynamicSendComment from '@/pages/dynamic/sendComment'
import TopicDetail from '@/pages/topic/detail'
import SMSCode from '@/pages/smsCode'
import WeixinLoginJump from '@/pages/weixinLoginJump'
import PromotionIndex from '@/pages/promotion/index'
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
