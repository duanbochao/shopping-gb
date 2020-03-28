<template>
  <div class="callme_container">

    <span>当前在线用户{{userInfo.length}}个</span>
    <div class="userInfo">
      <p v-for="(item,index) in userInfo" class="user_box" :key="index">{{'游客'+(index+1)}}</p>
    </div>
    <div class="ls_container">
      <div class="content">
        <p v-for="(item,index) in userInfo" :key="index">
          <span>
            <img
              style="width:50px;height:50px; border-radius: 50%; border:2px solid gray"
              src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3488821615,2823821981&fm=26&gp=0.jpg"
            />
          </span>
          <span
            style="font-size:18px; color:white;margin-left:10px;padding:7px;border-radius: 5%;background-color:#a6d4f2"
          >{{item.content}}</span>
        </p>
      </div>
      <div class="sendMsg">
        <el-input type="text" placeholder="请输入要发送的内容..." v-model="content" />
        <el-button
          type="primary"
          style="margin-left:5px"
          :disabled="content===''"
          @click="sendMsg"
        >发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import "../../lib/sockjs";
import "../../lib/stomp";

export default {
  data() {
    return {
      content: "",
      msgList: []
    };
  },
  created() {
    this.$store.dispatch("connect");
  },
  computed: {
    userInfo() {
     
      return this.$store.state.userInfo;
    }
  },
  methods: {
    //发送数据
    sendMsg() {
      this.$store.state.stomp.send(
        "/chat",
        {},
        JSON.stringify({
          to: this.$store.state.userInfo.from,
          content: this.$store.content
        })
      );

      this.content = "";
    }
  }
};
</script>
<style scoped>
.callme_container {
  position: relative;
  height: 500px;
  margin-left: 200px;
}

.user_box {
  width: 100%;
  height: 20px;
  background-color: yellow;
}
.userInfo {
  width: 180px;
  height: 73.5%;
  overflow-y: auto;
  border: 2px solid rgb(186, 186, 245);
  position: absolute;
  margin-left: -200px;
  top: 33px;
}
.ls_container {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 33px;
  bottom: 100px;
}
.content {
  width: 98%;
  height: 100%;
  margin-left: 1%;
  border: 2px solid rgb(186, 186, 245);
  overflow-y: auto;
}
.sendMsg {
  padding: 22px 7px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.client_msg {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>

