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
        <template slot="header">
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
    <!-- 分页组件区域 -->
    <el-pagination
      style="text-align:right;margin-top:10px;"
      background
      :page-size="5"
      :current-page.sync="currentPage"
      layout=" prev, pager, next,total, jumper"
      :total="totalCount"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 对话框区域 -->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      style="text-align:left"
    >
      <div>
        <div>
          <span>上传头像</span>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="success"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <p>
          <span>文章标题</span>
          <el-input size="mini" v-model="newslistOne.title" maxlength="24" />
        </p>
        <p>
          <span>点击次数:</span>
          <el-input size="mini" v-model="newslistOne.count" />
        </p>
        <div class="block">
          <span>发表时间:</span>
          <el-date-picker
            v-model="newslistOne.createDate"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </div>

        <span>文章内容:</span>
        <div id="editor">
          <mavon-editor style="height: 100%;width: 100%;" v-model="newslistOne.content"></mavon-editor>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogImageUrl: "",
      dialogVisible: false,
      newsList: [],
      newslistOne: {
        id: 0,
        title: "",
        createDate: "",
        count: "",
        content: "",
        newsIcon: "",
        summary: ""
      }
    };
  },
  created() {
    this.loadNewsList();
  },
  methods: {
    success() {
      console.log("good success");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file.url);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    handleCurrentChange(val) {
      //分页查询
      this.page = val;
      this.loadNewsList();
    },

    handleEdit(index, row) {
      //修改
      //  row.createDate=new Date(row.createDate);

      this.newslistOne = row;
      this.dialogVisible = true;
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

.el-input--mini {
  width: 400px;
}
</style>
