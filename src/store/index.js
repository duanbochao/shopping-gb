import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default  new Vuex.Store({
  state: {
    userInfo:[],
    stomp:null,
    user:{
        name:window.localStorage.getItem('user' || '[]') ==null ? "未登录" : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
        userface:window.localStorage.getItem('user' || '[]') ==null ? '': JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
        username:window.localStorage.getItem('user' || '[]') ==null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    login(state,user){
      state.user=user;
      window.localStorage.setItem("user",JSON.stringify(user))
    }
  },
  getters:{
 
  },
  actions: {
    connect(context) {
      context.state.stomp = Stomp.over(new SockJS("/ws/endpointChat"));
      context.state.stomp.connect({}, function (frame) {
        context.state.stomp.subscribe("/user/queue/chat", function (response) {
         
          var flag = false;
          context.state.userInfo.some(item => {
            if (item.from===JSON.parse(response.body).from) {
              item.content=JSON.parse(response.body).content;
              flag= true;
              return;
            }
          });
          if (!flag) {
            context.state.userInfo.push(JSON.parse(response.body));
          }
          

          


        })
      }, failedMsg=> {
      })
    }
  }
})