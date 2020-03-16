<template>
  <div class="news">
    <!-- 表格区域 -->
    <el-table
      fit
      max-height="390px"
      size="mini"
      :data="newsList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;height:380px;"
    >
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column label="编号" prop="id" width="70px"></el-table-column>
      <el-table-column label="图标" width="100px">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" :src="scope.row.newsIcon" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="260px"></el-table-column>
      <el-table-column label="点击次数" prop="count" width="80px"></el-table-column>
      <el-table-column label="发表时间">
        <template slot-scope="scope">{{scope.row.createDate | dateFormat}}</template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <div class="search">
            <el-input v-model="keywords" size="mini" placeholder="输入关键字搜索" />
            <el-button
              type="primary"
              style="margin-left:5px"
              size="mini"
              @click="loadNewsListByKeyworlds()"
            >查询</el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:right;margin-top:10px;"
      background
      :page-size="5"
      :current-page.sync="currentPage"
      layout=" prev, pager, next,total, jumper"
      :total="totalCount"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalCount: -1,
      page: 1,
      currentPage: 1,
      keywords: "",
      size: 5,
      search: "",
      newsList: []
    };
  },
  created() {
    this.loadNewsList();
  },
  methods: {
    handleCurrentChange(val) {
      //分页查询
      this.page = val;
      this.loadNewsList();
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    loadNewsListByKeyworlds() {
      if (this.keywords != null && this.keywords != "") {
        this.page = 1;
        this.currentPage = 1;
      }
      this.loadNewsList();
    },
    loadNewsList() {
      //查询接口
      var _this = this;
      this.postRequest("/home/news/getNewsListByPage", {
        keywords: _this.keywords,
        page: _this.page,
        size: 5
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.newsList = resp.data.newsList;
          _this.totalCount = parseInt(resp.data.total);
        }
      });
    }
  }
};
</script>
<style scoped>
.news {
  text-align: center;
}

.search {
  display: flex;
}
</style>
