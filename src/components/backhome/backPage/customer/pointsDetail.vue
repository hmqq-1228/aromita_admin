<template>
  <div class="pointsDetail">
    <div class="title">积分明细</div>
    <div class="count">
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="积分点数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="积分收支">
        </el-table-column>
        <el-table-column
          prop="address"
          label="时间">
        </el-table-column>
      </el-table>
    </div>
    <div class="foot">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="100">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "pointsDetail",
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>

<style scoped>
.title{
  font-size: 18px;
  font-weight: bold;
}
  .count{
    margin-top: 20px;
  }
</style>
