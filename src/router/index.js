import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ActivityDetail from '@/pages/activity/detail'
import ActivityOrder from '@/pages/activity/order'
import MapPage from '@/pages/mapPage'

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
      path: '/map',
      name: 'mapPage',
      component: MapPage,
      meta: {
        title: '查看地图'
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
