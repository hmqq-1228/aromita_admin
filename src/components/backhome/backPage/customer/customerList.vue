<template>
  <div class="customerList">
    <div class="title">客户管理</div>
    <div class="search">
      <div class="inputVal">
        <div><el-input v-model="inputEmail" placeholder="请输入客户邮箱"></el-input></div>
        <div><el-input v-model="inputName" placeholder="请输入客户名称"></el-input></div>
      </div>
      <div class="register">
        <div class="nameItem">注册时间:</div>
        <div class="time">
          <el-date-picker
            v-model="registerDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="register">
        <div class="nameItem2">最后登录时间:</div>
        <div class="time">
          <el-date-picker
            v-model="registerDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div style="margin-left: 20px"><el-button type="primary">搜 索</el-button></div>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="date"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份">
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toPointsDetail()">积分明细</el-button>
            <el-button type="text" size="small" @click="resetPassword()">重置密码</el-button>
          </template>
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
  name: "customerList",
  data() {
    return {
      inputEmail: '',
      inputName: '',
      registerDate: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333
      }]
    }
  },
  methods:{
    resetPassword () {
      this.$alert('已发送重置密码邮件给客户，请引导客户完成重置密码后续步骤', '密码重置', {
        confirmButtonText: '知道了',
        callback: action => {

        }
      });
    },
    toPointsDetail () {
      this.$router.push('/pointsDetail')
    }
  }
}
</script>

<style scoped>
  .title{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .search{
    display: flex;
    justify-content: start;
  }
  .inputVal{
    width: 420px;
    display: flex;
    justify-content: space-between;
  }
  .inputVal>div{
    width: 200px;
  }
  .register{
    display: flex;
    justify-content: space-between;
  }
  .nameItem{
    width: 100px;
    text-align: center;
    line-height: 32px;
  }
  .nameItem2{
    width: 120px;
    text-align: center;
    line-height: 32px;
  }
  .content{
    margin-top: 20px;
  }
</style>
