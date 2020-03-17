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
        <div class="newIcon">
          <span>上传头像</span>
          <img
            :src="newslistOne.newsIcon"
            alt
            style="width:60px;height:60px; margin-left:10px;margin-right:20px;border-radius: 50%"
          />
          <div class="uploadImg">
                      <el-upload action="/config/uploadimg"
                      :on-success="uploadSuccess"
                      :show-file-list=false
                      >
            <i class="el-icon-plus"></i>
          </el-upload>
          </div>
        </div>
        <p>
          <span>文章标题</span>
          <el-input
            size="mini"
            v-model="newslistOne.title"
            maxlength="18"
            placeholder="最多输入18个字..."
          />
        </p>
        <p>
          <span>点击次数:</span>
          <el-input-number size="mini" v-model="newslistOne.count"></el-input-number>
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
          <mavon-editor
            style="height: 100%;width: 100%;"
            ref="md"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            v-model="newslistOne.content"
          ></mavon-editor>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateNewsList">确 定</el-button>
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
        summary: "",
        contentHtml: ""
      }
    };
  },
  created() {
    this.loadNewsList();
  },
  methods: {
    uploadSuccess(response){
    if (response.state==200) {
      this.newslistOne.newsIcon=response.message;
    }
      
    },
    updateNewsList() {
      var _this = this;
      this.dialogVisible = false;

      this.newslistOne.createDate = this.timestampToTime(
        this.newslistOne.createDate
      );

      this.newslistOne.contentHtml = this.$refs.md.d_render;

      this.postRequest("/home/news/updateNews", _this.newslistOne).then(
        resp => {
          if (resp.status == 200) {
            this.$message({
              message: "恭喜你，修改成功!",
              type: "success"
            });
          }
        }
      );
    },

    timestampToTime(cjsj) {
      //格式化时间
      var date = new Date(cjsj);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },

    imgAdd(pos, $file) {
      //图片上传
      var _this = this;
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("file", $file);
      this.uploadFileRequest("/config/uploadimg", formdata).then(resp => {
        var json = resp.data.message;
        if (resp.status == 200) {
          //  _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
          _this.$refs.md.$imglst2Url([[pos, json]]);
        } else {
          _this.$message({ type: json.status, message: json });
        }
      });
    },
    imgDel(pos) {},

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
      row.createDate = new Date(row.createDate);
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
.newIcon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}


</style>
