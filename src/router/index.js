import Vue from 'vue'
import Router from 'vue-router'
import NotFoundPage from '@/pages/notFoundPage'
import Home from '@/pages/home'
import ActivityDetail from '@/pages/activity/detail'
import ActivityOrder from '@/pages/activity/order'
import WebPay from '@/pages/activity/webPay'
import ActivitySuccess from '@/pages/activity/success'
import ActivityTicket from '@/pages/activity/ticket'
import MapPage from '@/pages/mapPage'
import Agreement from '@/pages/agreement'
import TestImageContainer from '@/pages/testImageContainer'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      name: 'NotFoundPage',
      meta: {
        title: '范团'
      },
      component: NotFoundPage
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/activity/detail',
      name: 'ActivityDetail',
      component: ActivityDetail,
      meta: {
        title: '范团活动'
      }
    },
    {
      path: '/activity/order',
      name: 'ActivityOrder',
      component: ActivityOrder,
      meta: {
        title: '提交订单'
      }
    },
    {
      path: '/webPay', // 微信外h5支付回调页面
      name: 'WebPay',
      component: WebPay,
      meta: {
        title: '订单支付'
      }
    },
    {
      path: '/activity/success',
      name: 'ActivitySuccess',
      component: ActivitySuccess,
      meta: {
        title: '报名成功'
      }
    },
    {
      path: '/activity/ticket',
      name: 'ActivityTicket',
      component: ActivityTicket,
      meta: {
        title: '电子票'
      }
    },
    {
      path: '/map',
      name: 'mapPage',
      component: MapPage,
      meta: {
        title: '查看地图'
      }
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: Agreement,
      meta: {
        title: ''
      }
    },
    {
      path: '/test/image',
      name: 'testImageContainer',
      component: TestImageContainer,
      meta: {
        title: '图片测试'
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
    let i = document.createElement('iframe');
    i.src = 'https://www.baidu.com/favicon.ico';
    i.style.display = 'none';
    i.onload = () => {
        setTimeout(() => {
            i.remove()
        }, 9)
    }
    document.title = to.meta.title
    document.body.appendChild(i)
  }
  next()
})

export default router
