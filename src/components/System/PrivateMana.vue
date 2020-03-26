<template>
  <div>
    <div class="private">
      <el-input placeholder="请输入角色英文名称" size="mini" style="width:240px" v-model="name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="mini" placeholder="请输入角色中文名称"  style="width:260px;margin:0 5px;" v-model="nameZh"></el-input>
      <el-button size="mini" type="primary" @click="addRole">添加角色</el-button>
    </div>

    <div class="private_container">
      <el-collapse accordion v-for="(item,index) in roles" :key="index" @change="Change(item.id)">
        <el-collapse-item :title="item.nameZh" name="1">
          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>可访问资源</span>
                <i class="el-icon-delete" style="float: right; padding: 3px 0"></i>
              </div>
              <div>
                <el-tree
                  ref="tree"
                  :data="treeData"
                  show-checkbox
                  node-key="id"
                  :default-expanded-keys="[1]"
                  :default-checked-keys="mids"
                  :props="defaultProps"
                ></el-tree>
              </div>
              <div style="text-align:right">
                <el-button size="mini">取消修改</el-button>
                <el-button type="primary" size="mini" @click="updateRoles(item.id,index)">确定修改</el-button>
              </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "1",
      roles: [],
      mids: [],
      name:'',
      nameZh:'',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getAllRoles();
  },
  methods: {
    addRole() {
      var _this = this;
      this.postRequest("/config/addRole", {
        name: _this.name,
        nameZh: _this.nameZh
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.$message({
            message: resp.data.message,
            type: "success"
          });
          _this.getAllRoles();
        }
      });
    },

    updateRoles(rid, index) {
      var _this = this;
      var checkedKeys = this.$refs.tree[index].getCheckedKeys(true);
      var ids = "";
      checkedKeys.forEach(item => {
        ids = ids + item + ",";
      });

      this.postRequest("/config/updateMenuRoles", {
        mids: ids,
        rid: rid
      }).then(resp => {
        if (resp && resp.data.state === 200) {
          _this.$message({
            message: resp.data.message,
            type: "success"
          });
          _this.name='',
          _thss.nameZh='',
          _this.getAllRoles();
        }
      });
    },
    Change(rid) {
      this.getMenuTree(rid);
    },
    getMenuTree(rid) {
      var _this = this;
      this.postRequest("/config/getMenuTree/" + rid).then(resp => {
        if (resp && resp.status == 200) {
          _this.treeData = resp.data.menuTree;
          _this.mids = resp.data.mids;
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
.private {
  display: flex;
}
.private_container {
  width: 500px;
  margin-top: 20px;
}

.box-card {
  width: 490px;
}
</style>
