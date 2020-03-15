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




