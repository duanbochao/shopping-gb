<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  activated() {}
};
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
}

.el-aside {
  background-color: #d3dce6;
}
.el-main {
  background-color: #e9eef3;
}

.el-container {
  height: 100%;
  width: 100%;
  position: relative;
  left: 0px;
  bottom: 0px;
}
</style>

