<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .stateStyle{
    color: #13ce66;
  }
  .el-table td, .el-table th{
    text-align: center;
  }
  .stateStyle1{
    color: #666;
  }
  .el-table .warning-row{
    background: #f0f9eb;
  }
</style>
