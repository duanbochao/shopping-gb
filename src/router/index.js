import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import News from '@/components/Home/News'
import Share from '@/components/Home/Share'
import Callme from '@/components/Home/Callme'
import Systemmanager from '@/components/System/Systemmanager'
import PrivateMana from '@/components/System/PrivateMana'
import Video from '@/components/Home/Video'
import Goods from '@/components/Home/Goods'
import Feedback from '@/components/Home/Feedback'
import ShopCar from '@/components/Shop/ShopCar'
import Member from '@/components/Member/Member'
import Search from '@/components/Search/Search'
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
            name:'水果资讯',
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
          },
          {
            path:'/home/callme',
            name:"联系我们",
            component:Callme
          },
          {
            path:'/home/video',
            name:"视频专区",
            component:Video
          },
          {
            path:'/home/goods',
            name:"商品购买",
            component:Goods
          },
          {
            path:'/home/feedback',
            name:"留言反馈",
            component:Feedback
          },
          {
            path:'/shop',
            name:"留言反馈",
            component:ShopCar
          },
          {
            path:'/member',
            name:"会员管理",
            component:Member
          } ,
          {
            path:'/search',
            name:"搜收管理",
            component:Search
          }
     
      ]
    }
  ]
})
