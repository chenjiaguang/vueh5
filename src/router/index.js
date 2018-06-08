import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ActivityDetail from '@/pages/activity/detail'
import ActivityOrder from '@/pages/activity/order'
import ActivitySuccess from '@/pages/activity/success'
import ActivityTicket from '@/pages/activity/ticket'
import MapPage from '@/pages/mapPage'
import Agreement from '@/pages/agreement'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/activity/detail',
      name: 'activityDetail',
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
    }
  ],
  hashbang: false,
  history: true,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
