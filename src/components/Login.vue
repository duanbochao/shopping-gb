<template>
  <div class="login">
    <div class="loginBox">
      <el-form>
        <h3>Shopping后台管理系统</h3>
        <el-form-item>
          <el-input v-model="username" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        </el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-form-item>
          <el-button type="primary" @click="doLogin()">主要按钮</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "duanbochao",
      password: "123",
      checked: true
    };
  },
  created() {},
  methods: {
    doLogin() {
      var _this = this;
      this.postRequest("/login", {
        username: _this.username,
        password: _this.password
      }).then(resp => {

        if (resp && resp.data.state == 1) {
          this.$message({
            message: "恭喜你，登录成功!",
            type: "success"
          });

          this.$router.push({path:'/home'})
          
        }else{
           this.$message.error('登录失败，请核实用户名或密码是否错误');
        }


      });
    }
  }
};
</script>
<style scoped>
.loginBox {
  width: 350px;
  height: 300px;
  padding: 10px 30px 0px 30px;
  border: 1px solid rgb(245, 195, 195);
  margin: 100px auto;
  box-shadow: 0 0 6px rgb(210, 206, 248);
  border-radius: 20px;
}

.el-button--primary {
  margin-top: 10px;
  width: 100%;
}
</style>
