<template>
  <div class="systemManager">
    <!-- 头部搜索区域 -->
    <div class="sys_search">
      <el-input
        style="width:400px;margin-right:10px;"
        size="small"
        v-model="keywords"
        prefix-icon="el-icon-search"
        placeholder="默认展示部分用户，请通过用户名搜索用户..."
      ></el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="getAllUser()">搜索</el-button>
    </div>

    <!-- 卡片区域 -->
    <div class="car_box">
      <el-card class="box-card" v-for="(item,index) in dataList" :key="index">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
          <i
            class="el-icon-delete"
            style="float: right; padding: 3px 0;color:red;font-size:14px"
            type="text"
            @click="deleteUserById(item.id)"
          >删除</i>
        </div>
        <div>
          <div style="text-align:center">
            <img style="width:60px;height:60px; border-radius: 50%;" :src="item.userface" />
          </div>
          <div class="item_box">
            <p>
              <span>用户名:</span>
              <span>{{item.username}}</span>
            </p>
            <p>
              <span>注册时间</span>
              <span>{{new Date() || dateFormat}}</span>
            </p>

            <div class="user_status">
              <span>用户状态:</span>
              <el-switch
                style="display: block"
                v-model="item.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                @change="updateStatus(item)"
              ></el-switch>
            </div>

            <div>
              <span>用户角色:</span>
              <el-tag
                type="success"
                style="margin-right:5px"
                size="mini"
                v-for="(item,index) in item.roles"
                :key="index"
              >{{item.nameZh}}</el-tag>
              <!-- 对话框内容 -->
              <el-popover
                placement="bottom"
                title="标题"
                width="200"
                @hide="updateRoles(item.id,index)"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
              >
                <el-button
                  type="text"
                  icon="el-icon-more"
                  slot="reference"
                  size="mini"
                  @click="showRoles(item.roles)"
                ></el-button>
                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roles"
                    :key="item.value"
                    :label="item.nameZh"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-popover>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      keywords: "",
      roles: [],
      selectedRoles: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value1: ["a", "b"],
      value2: []
    };
  },
  created() {
    this.getAllUser();
    this.getAllRoles();
  },
  methods: {
    deleteUserById(id) {
      this.postRequest("/home/lunbo/deleteUserById", {
        id: id
      }).then(resp => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getAllUser();
      });
    },

    updateStatus(item) {
      this.postRequest("/home/lunbo/updateUser", {
        enabled: item.enabled,
        id: item.id
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message({
            message: "更新成功",
            type: "success"
          });

          this.getAllUser();
        }
      });
    },
    updateRoles(id, index) {
      var rs = "";
      this.selectedRoles.forEach(r => {
        rs = rs + r + ",";
      });
      this.postRequest("/home/lunbo/updateRoles", {
        rids: rs,
        uid: id
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message("更新成功!");
          this.getAllUser();
          this.getAllRoles();
        }
      });
    },

    showRoles(roles) {
      this.selectedRoles = [];
      roles.forEach(r => {
        this.selectedRoles.push(r.id);
      });
    },
    getAllUser() {
      var searchWords = "";
      if (this.keywords === "") {
        searchWords = "all";
      } else {
        searchWords = this.keywords;
      }

      var _this = this;
      this.postRequest("/home/lunbo/getAllUser", {
        keywords: searchWords
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.dataList = resp.data;
          console.log(_this.dataList);
        }
      });
    },
    getAllRoles() {
      var _this = this;
      this.postRequest("/home/lunbo/getAllRoles").then(resp => {
        if (resp && resp.status == 200) {
          _this.roles = resp.data;
        }
      });
    }
  }
};
</script>
<style scoped>
.sys_search {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-card {
  width: 340px;
  height: 360px;
  box-shadow: 0 0 3px rgb(177, 67, 250);
  margin-top: 10px;
}

.item_box {
  font-size: 14px;
  color: rgb(176, 176, 245);
}
.car_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.user_status {
  display: flex;
  margin-bottom: 10px;
}
</style>
