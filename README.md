# 商品后台管理系统

## 绘制登录界面并实现登录
+ 创建项目
+ 绘制登录界面

## Vue-cli中引入axios的方法

+ main.js中错误引入axios如下
``` bash
import axios from 'axios'
import qs from 'qs'

Vue.use(axios)

```
+ main.js中正确引入axios如下

``` bash
import axios from 'axios'
import qs from 'qs'
Vue.prototype.axios = axios
```

## 完成新闻资讯显示
+ 新闻资讯编译显示


## 新闻资讯优化
+ 通过this.$refs.md.d_render;将编译器中的数据全部以Html形式取出来，去除编译器自带的样式
+ 将编译器自带的样式保存一份到数据库，将提取的html形式保存一份到数据库
+ 返回到编译器中显示的是原有给格式

## 新闻资讯图片上传
+ 设置图片上传
```
<el-upload action="/config/uploadimg"
    :on-success="uploadSuccess"
    :show-file-list=false >
    <i class="el-icon-plus"></i>
</el-upload>


//上传成功后的回调
uploadSuccess(response){

if (response.state==200) {
    this.newslistOne.newsIcon=response.message;
}
```





