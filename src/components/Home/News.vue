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
      <el-table-column label="编号" prop="id" width="60px"></el-table-column>
      <el-table-column label="图标" width="90px">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" :src="scope.row.newsIcon" />
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
        <template slot="header">
          <div class="search">
            <el-input v-model="keywords" size="mini" placeholder="请输入标题搜索" />
            <el-button
              icon="el-icon-search"
              type="primary"
              style="margin-left:3px"
              size="mini"
              @click="loadNewsListByKeyworlds()"
            ></el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            class="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            class="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件区域 -->
    <div class="news_bottom_box">
      <div>
        <el-button type="danger" disabled size="mini">批量删除</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="clearnNewsListStyle()">添加</el-button>
      </div>
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
            :src="newslistOne.newsIcon==null ? 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3895940275,3954737772&fm=26&gp=0.jpg' : newslistOne.newsIcon"
            alt
            style="width:60px;height:60px; margin-left:10px;margin-right:20px;border-radius: 50%"
          />
          <div class="uploadImg">
            <el-upload
              action="/config/uploadimg"
              :on-success="uploadSuccess"
              :show-file-list="false"
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
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitNewsList" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 评论对话框 -->
    <div>
      <el-dialog title="评论详情" :visible.sync="dialogTableVisible" @close="commentDialogClose">
        <el-table :data="commentData" size="mini">
          <el-table-column property="id" label="id" width="50"></el-table-column>
          <el-table-column label="评论用户">
            <template
              slot-scope="scope"
            >{{ (scope.row.username===null || scope.row.username==='') ? '匿名用户' : scope.row.username}}</template>
          </el-table-column>
          <el-table-column property="commentContent" label="评论内容"></el-table-column>
          <el-table-column label="评论时间">
            <template slot-scope="scope">{{scope.row.creteDate | dateFormat}}</template>
          </el-table-column>
        </el-table>
        <div style="text-align:right;margin-top:5px">
          <el-button size="mini" @click="nextUp(--index)" v-show="index<=1 ? false:true">上一页</el-button>
          <el-button size="mini" @click="nextDown(++index)" v-show="flag? true:false">下一页</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalCount: -1,
      page: 1,
      index: 1,
      flag: true,
      currentPage: 1,
      keywords: "",
      size: 5,
      nid: -1,
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
      },
      commentData: [],
      dialogTableVisible: false
    };
  },
  created() {
    this.loadNewsList();
  },
  methods: {

    submitNewsList(){ //提交表单数据信息
        if (this.newslistOne.id===0) {
          this.addNews();
        }else{
          this.updateNewsList();
        }

    },
    addNews() {
      this.postRequest("/home/news/addNewsList",this.newslistOne).then(resp=>{
        if (resp && resp.data.state==1) {
           this.$message({
              message: resp.data.message,
              type: "success"
            });
            this.dialogVisible=false;
        }
      })
    },

    clearnNewsListStyle() {
      this.dialogVisible = true;
      //格式化NewsListStyle
      this.newslistOne = {
        id: 0,
        title: "",
        createDate: "",
        count: "",
        content: "",
        newsIcon: "",
        summary: "",
        contentHtml: ""
      };
    },
    commentDialogClose() {
      //弹出框关闭后清空缓存数据
      this.commentData = null;
    },
    nextUp() {
      this.getComment();
    },

    nextDown() {
      this.getComment();
    },

    updateComment(index, row) {
      this.nid = row.id;
      this.getComment();
      this.dialogTableVisible = true;
    },

    getComment() {
      var _this = this;
      //更新评论内容
      this.dialogTableVisible = true;
      var _this = this;
      this.postRequest("/home/comment/web/getCommentByPage", {
        page: _this.index,
        nid: _this.nid,
        commetType: "0"
      }).then(resp => {
        if (resp.data.state == "1") {
          this.commentData = resp.data.message;
          if (this.commentData.length < 5) {
            this.flag = false;
          } else {
            this.flag = true;
          }
        } else {
          this.$message("数据已经到底啦!");
          this.flag = false;
        }
      });
    },

    uploadSuccess(response) {
      //图片上传方法
      if (response.state == 200) {
        console.log("hello world");

        this.newslistOne.newsIcon = response.message;
      }
    },
    



    updateNewsList() {
      //更新
      var _this = this;
      this.dialogVisible = false;

      this.newslistOne.createDate = this.timestampToTime(
        this.newslistOne.createDate
      );

      //获取编译器中的html信息
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

.news_bottom_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
