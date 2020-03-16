// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'

//引入时间格式
import moment from 'moment'

//安装ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);

import { postRequest } from '../src/api/index'
import { getRequest } from '../src/api/index'

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;

//全局时间过滤器
Vue.filter('dateFormat', function (value,pattern="YYYY-MM-DD HH:mm:ss") {
  // 返回处理后的值
  return  moment(value).format(pattern);
})

//配置路由守卫
router.beforeEach((to, from, next) => {
  if (to.name == "Login") {
    next();
    return;
  }

  var name = store.state.user.name;

  
  if (name === '未登录') {
    if (to.meta.requireAuth || to.name == null) {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next();
    }
  }else{
    next();
  }

})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
