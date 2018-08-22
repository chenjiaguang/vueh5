# vueh5

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 范团活动:/h5/activity/detail    query['id':活动id]
# 大家都在晒:/h5/activity/dynamic    query['activity_id':活动id]
# 活动购票(提交订单):/h5/activity/order    query['id':活动id]
# h5支付回调(订单支付):/h5/webPay    query['checkcode':后端返回的checkcode, 'payNo':订单号]
# 电子票:/h5/activity/ticket    query['checkcode':后端返回的checkcode]
# 查看地图:/h5/map    query['lng':地址经度, 'lat':地址纬度, 'title'?:详细地址]
# 用户协议:/h5/agreement    query['type':协议类型['user':用户协议, 'author':作者协议, 'activity':活动协议]]
# 范团圈子:/h5/circle/detail    query['circle_id':圈子id, 'jump_tab'?:默认展示的tab索引,从0开始] 
# 范团名片:/h5/user/center    query['user_id':用户id] 
# 范团话题:/h5/topic/detail    query['topic_id':话题id, 'jump_tab'?:默认展示的tab索引,从0开始]
# 发动态:/h5/dynamic/edit    query['topic'?:话题，数组形如[{id:xxx, title: xxxx}], 'activity'?:活动，对象形如{id: xxx, title: xxxx}, 'circle'?:圈子，对象形如{id: xxx, title: xxxx}, 'range'?:可见范围，字符串0或1或2]
# 选择可见范围(发动态):/h5/dynamic/chooserange    query['selected':选中的可见范围，字符串0或1或2]

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
      name: 'agreement',
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
      component: WeixinLoginJump
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
      component: TopicDetal,
      meta: {
        title: '范团话题',
        keepAlive: true
      }
    }
