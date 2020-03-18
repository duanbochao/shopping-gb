<template>
  <div>
    <!-- 头部搜索区域 -->
    <div class="search">
      <el-select v-model="type" size="mini" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input
        v-model="keywords"
        size="mini"
        placeholder="输入关键字搜索"
        style="width:200px;padding:0 10px"
      />
      <el-button
        icon="el-icon-search"
        type="primary"
        style="margin-left:3px"
        size="mini"
        @click="search()"
      >查询</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="shareList" style="width: 100%;height:100%">
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column label="编号" prop="id" width="60px"></el-table-column>
      <el-table-column label="图标" width="90px">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" :src="scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="200px"></el-table-column>

      <el-table-column label="发表时间">
        <template slot-scope="scope">{{scope.row.createDate | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="点击次数" prop="count" width="80px"></el-table-column>
      <el-table-column label="评论次数" width="80px">
        <template slot-scope="scope">
          <a
            href="#"
            @click.prevent="updateComment(scope.$index, scope.row)"
          >{{scope.row.commentCount}}</a>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div style="margin-top:10px;text-align:right">
      <el-pagination
      :page-sizes="[5, 10, 15, 20]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shareList: [],
      keywords: "",
      total:0,
      options: [
        {
          value: "1",
          label: "清纯美女"
        },
        {
          value: "2",
          label: "极品诱惑"
        },
        {
          value: "3",
          label: "大胸长腿"
        },
        {
          value: "4",
          label: "国产自拍"
        },
        {
          value: "5",
          label: "高清无码"
        },
        {
          value: "6",
          label: "高清有码"
        }
      ],
      type: "",
      size: 10,
      page: 1
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    //分页条目每页size
    handleSizeChange(size) {
      this.size = size;
      this.loadList();
    },
    //指定到多少页当前页page
    handleCurrentChange(page) {
      this.page = page;
      this.loadList();
    },

    search() {
      //关键词查询
      console.log(this.value);
      this.loadList();
    },

    loadList() {
    
      var _this = this;
      this.postRequest("/home/share/web/getSharePagesByType", {
        page: _this.page,
        size: _this.size,
        type: _this.type
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.shareList = resp.data.shareList;
           _this.total = resp.data.total;
        }
      });
    }
  }
};
</script>
<style scoped>
.search {
  display: flex;
  margin-bottom: 10px;
}
</style>
