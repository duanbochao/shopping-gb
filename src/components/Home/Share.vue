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
        @click="searchShare()"
      >查询</el-button>
      <el-button
        icon="el-icon-plus"
        type="primary"
        style="margin-left:3px"
        size="mini"
        @click="prveAddShare()"
      >添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table
      :data="shareList"
      style="width: 100%;height:380px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column label="编号" prop="id" width="60px"></el-table-column>
      <el-table-column label="图标" width="120px">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" :src="scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="250px"></el-table-column>

      <el-table-column label="发表时间">
        <template slot-scope="scope">{{scope.row.createDate | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="点击次数" prop="count" width="80px"></el-table-column>
      <!-- <el-table-column label="评论次数" width="80px">
        <template slot-scope="scope">
          <a
            href="#"
            @click.prevent="updateComment(scope.$index, scope.row)"
          >{{scope.row.commentCount}}</a>
        </template>
      </el-table-column>-->
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button size="mini" class="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger"    class="el-icon-delete"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="share_bottom">
      <el-button
        type="danger"
        size="mini"
        :disabled="multipleSelection.length==0"
        @click="handleMany()"
      >批量删除</el-button>
      
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout=" sizes, prev, pager, next, jumper,total"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <div>
        <p>
          <span>文章标题</span>
          <span>
            <el-input v-model="share.title" size="mini" style="width:200px"></el-input>
          </span>
        </p>
        <div class="img_box" v-show="this.share.url=='' ?false:true">
          <span>封面图片</span>
          <img style="width:50px;height:50px;border-radius: 50%" :src="share.url" />
        </div>

        <div v-show="this.share.url==''? true: false">
          <span>选择类型</span>
          <el-select v-model="dialogtype" size="mini" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="img_box">
          <span>封面详情图</span>
          <img
            @click="deleteImg(item)"
            v-for="(item,index) in imgDetails"
            :key="index"
            style="width:50px;height:50px;padding:0 3px"
            :src="item.surl"
            alt
          />

          <el-upload
            class="upload_demo"
            action="/config/uploadimg"
            :limit="3"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :show-file-list="false"
          >
            <i class="el-icon-circle-plus" style="line-height: 50px;margin-left:18px;"></i>
          </el-upload>
        </div>
        <p>
          <span>发表时间</span>
          <el-date-picker
            v-model="share.createDate"
            size="mini"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </p>

        <p>
          <span>点击次数</span>
          <span>
            <el-input-number v-model="share.count" size="mini" label="描述文字"></el-input-number>
          </span>
        </p>

        <div>
          <p>摘要内容</p>
          <textarea
            v-model="share.content"
            style="width:100%;height:100px"
            placeholder="请输入文章简介(最多250个字...)"
            maxlength="250"
          ></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shareId: -1,
      shareList: [],
      keywords: "",
      total: 0,
      search: "",
      multipleSelection: [],
      dialogVisible: false,
      imgDetails: [],
      detailsType: "",
      dialogtype: 0,
      imageContainer: "",
      shareImgDetails: {
        id: 0,
        surl: "",
        type: ""
      },
      share: {
        id: 0,
        url: "",
        title: "",
        content: "",
        createDate: "",
        type: "",
        count: ""
      },
      options: [
        {
          value: "0",
          label: "全部商品"
        },
        {
          value: "1",
          label: "最新上架"
        },
        {
          value: "2",
          label: "江南特产"
        },
        {
          value: "3",
          label: "皖北风韵"
        },
        {
          value: "4",
          label: "新疆干货"
        },
        {
          value: "5",
          label: "砀山酥梨"
        },
        {
          value: "6",
          label: "进口水果"
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleDelete(id, row) {
      //删除一个
      this.doDelete(row.id);
    },
    handleMany() {
      //批量删除
      var ids = "";
      this.multipleSelection.forEach(item => {
        ids = ids + item.id + ",";
      });

      this.doDelete(ids);
    },

    doDelete(ids) {
      var _this = this;
      this.postRequest("/home/share/deleteShareByIds", {
        ids: ids
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.$message({
            message: "删除成功",
            type: "success"
          });

          _this.loadList();
        }
      });
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
    submit() {
      //提交表单
      this.dialogVisible = false;
      this.share.createDate = new Date(this.share.createDate);
      this.share.createDate = this.timestampToTime(this.share.createDate);
      this.share.type = this.dialogtype;

      this.share.url = this.imageContainer.surl;

      this.addShare();
    },

    prveAddShare() {
      this.formateShare();
      this.imgDetails = [];
      this.dialogVisible = true;
    },
    //添加操作
    addShare() {
      var _this = this;
      this.postRequest("/home/share/addShare", this.share).then(resp => {
        if (resp && resp.status == 200) {
          _this.$message({
            message: "添加成功!",
            type: "success"
          });
          _this.loadList();
        }
      });
    },

    //上传失败后
    uploadError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    //头像上传成功后
    uploadSuccess(response) {
      var _this = this;
      if (response.state == 200) {
        this.postRequest("/home/share/addShareSubImageToDetail", {
          surl: response.message,
          sid: _this.shareId,
          type: _this.dialogtype + ""
        })
          .then(resp => {
            if (resp && resp.status === 200) {
              _this.$message({
                message: "恭喜你，图片上传成功",
                type: "success"
              });
              _this.imageContainer = resp.data.message;
              _this.imgDetails.push(resp.data.message);
              console.log(" _this.imgDetails======", _this.imgDetails);
            }
          })
          .catch(resp => {});
      }
    },
    //删除图片
    deleteImg(row) {
      var _this = this;

      this.postRequest("/home/share/deleteDetailsById", {
        sid: row.id
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message({
            message: "恭喜你，删除成功",
            type: "success"
          });
        }

        _this.imgDetails = _this.imgDetails.filter(item => item.id !== row.id);
      });
    },

    //修改操作
    handleEdit(index, row) {
      this.detailsType = row.type;
      this.shareId = row.id; //保存这个id供图片上传成功后插入操作
      this.share = row;
      this.dialogVisible = true;
      this.loadListDetail(row.id);
    },
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

    searchShare() {
      //关键词查询

      this.search = "";
      this.loadList();
    },

    //加载图片列表
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
    },

    formateShare() {
      this.share = {
        id: 0,
        url: "",
        title: "",
        content: "",
        createDate: "",
        type: "",
        count: ""
      };
    },
    //加载图片详情列表
    loadListDetail(sid) {
      var _this = this;
      this.postRequest("/home/share/web/getImage", {
        sid: sid
      }).then(resp => {
        if (resp && resp.status === 200) {
          _this.imgDetails = resp.data;
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

.img_box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
}

.el-upload el-upload--picture-card {
  width: 10px;
  height: 10px;
}

.upload_demo {
  width: 50px;
  height: 50px;
  background-color: #85bff8;
}

.share_bottom {

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  
}
</style>
