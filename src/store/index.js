import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default  new Vuex.Store({
  state: {
    user:{
        name:window.localStorage.getItem('user' || '[]') ==null ? "未登录" : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
        userface:window.localStorage.getItem('user' || '[]') ==null ? '': JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
        username:window.localStorage.getItem('user' || '[]') ==null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})