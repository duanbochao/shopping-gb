import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import News from '@/components/Home/News'
import Share from '@/components/Home/Share'
import Systemmanager from '@/components/System/Systemmanager'
import PrivateMana from '@/components/System/PrivateMana'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },    
    {
      path: '/home',
      name: '首页',
      component: Home,
      meta:{
        requireAuth:true
      },
      children: [
          {
            path:'/home/news',
            name:'新闻资讯',
            component:News
          },
          {
            path:'/home/share',
            name:"图片分享",
            component:Share
          },
          {
            path:'/home/sysmanager',
            name:"操作管理员",
            component:Systemmanager
          },
          {
            path:'/home/privatemana',
            name:"权限组管理",
            component:PrivateMana
          }
      ]
    }
  ]
})
