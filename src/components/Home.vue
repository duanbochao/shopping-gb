<template>
  <el-container class="home-container">
    <el-header>
      <div class="header_box">
        <h3 style="color:white">购物商城后台管理系统</h3>
        <div class="header_box_right">
          <span style="margin-right:20px">🔔</span>
          <div>
            <el-dropdown>
              <span class="el-dropdown-link" style="color:white">
                <span>{{user.name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item>注销</el-dropdown-item>
                <el-dropdown-item divided>管理</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div style="margin-left:5px">
            <img
              style="width:45px;height:45px;  border-radius: 50%"
              :src="user.userface"
              alt
            />
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened router>
          <el-submenu :index="index+''" v-for="(item,index) in dataList" :key="index" style="color:#d3dce6">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="chi.path" v-for="(chi,i) in item.children" :key="i">{{chi.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-text="this.$router.currentRoute.name">活动管理</el-breadcrumb-item>
        </el-breadcrumb>
       <div style="margin-top:10px">
          <router-view></router-view>
       </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      dataList: []
    };
  },
  created() {
    this.getMenusById();
  },
  methods: {
    getMenusById() {
      this.getRequest("/config/getMenusById").then(resp => {
        this.dataList = resp.data;
      });
    }
  },
  computed:{
    user(){
      return this.$store.state.user;
    }
  }
};
</script>
<style scoped>
.el-header {
  background-color: #3c90fd;
}

.el-aside {
  background-color: #d3dce6;
}
.el-main {
  background-color: #ffffff;
}

.home-container{
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0px;
  bottom: 0px;
}

.header_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header_box_right {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-submenu {
    background-color: #d3dce6;
}
</style>

