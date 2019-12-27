<template>
  <div class="customerList">
    <div class="heade">
        <h3>客户管理</h3>
        <!-- <el-button type="success" @click="coupon()">赠送优惠券</el-button> -->
    </div>
    <div class="search">
        <div class="inputVal">
          <div><el-input v-model="email" placeholder="请输入客户邮箱"></el-input></div>
          <div><el-input v-model="firstname" placeholder="请输入客户姓名"></el-input></div>
        </div>
        <div class="register">
          <div class="nameItem">注册时间:</div>
          <div class="time">
            <el-date-picker
              v-model="registerDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </div>
        <div class="register">
          <div class="nameItem2">最后登录时间:</div>
          <div class="time">
            <el-date-picker
              v-model="registerDate1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </div>
        <div style="margin-left: 20px"><el-button type="primary" @click="searchList()">查 询</el-button></div>
    </div>
    <div class="content">
      <el-table
        :data="customerTable"
        style="width: 100%"
        max-height="720px">
        <el-table-column prop="id" label="客户ID"></el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.firstname}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="created_at" label="注册时间"></el-table-column>
        <el-table-column prop="last_login_time" label="最后登录时间"></el-table-column>
        <el-table-column prop="score" label="可用积分"></el-table-column>
        <!-- <el-table-column prop="id" label="已使用积分"></el-table-column>
        <el-table-column prop="id" label="总积分"></el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toPointsDetail(scope.row.id)">积分明细</el-button>
            <el-button type="text" size="small" @click="resetPassword(scope.row.email)">找回密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @current-change="currentPage($event)"
        layout="total, prev, pager, next, jumper"
        :page-size="20"
        :total="total">
      </el-pagination>
    </div>
    <!-- 优惠券列表弹框 -->
    <el-dialog
      title="赠送优惠券"
      :visible.sync="couponVisible">
      <div class="couponList">
        <div class="searchcoupon">
            <el-input placeholder="优惠券名称/优惠券编码">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <el-table
          :data="couponTable"
          style="width: 100%">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="id" label="优惠券名称"></el-table-column>
          <el-table-column prop="id" label="面额"></el-table-column>
          <el-table-column prop="id" label="类型"></el-table-column>
          <el-table-column prop="id" label="使用条件"></el-table-column>
          <el-table-column prop="id" label="剩余张数"></el-table-column>
          <el-table-column prop="id" label="有效期"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {customerList,resetpass} from '@/http/customer.js'
export default {
  data() {
    return {
      page:1,
      pageSize:20,
      total:0,
      email: '',
      firstname: '',
      registerDate:[],
      registerDate1:[],
      created_at_start:'',
      created_at_stop:'',
      last_login_time_start:'',
      last_login_time_stop:'',
      customerTable: [],
      couponVisible:false,//优惠券弹框
      couponTable:[],//优惠券列表
    }
  },
  created(){
    this.getList()
  },
  methods:{
    //查询列表
    searchList(){
      this.page = 1
      this.getList()
    },
    //分页
    currentPage(num) {
      this.page = num
      this.getList()
    },
    //客户列表
    getList(){
      if(this.registerDate.length!=0){
        this.created_at_start = this.registerDate[0]
        this.created_at_stop = this.registerDate[1]
      }
      if(this.registerDate1.length!=0){
        this.last_login_time_start = this.registerDate1[0]
        this.last_login_time_stop = this.registerDate1[1]
      }
      let pre={
        email:this.email,
        page: this.page,
        firstname:this.firstname,
        created_at_start:this.created_at_start,
        created_at_stop:this.created_at_stop,
        last_login_time_start:this.last_login_time_start,
        last_login_time_stop:this.last_login_time_stop
      }
      customerList(pre).then((res)=>{
        this.customerTable = res.data.data.data
        this.total = res.data.data.total
      })
    },
    //重置密码
    resetPassword (email) {
      this.$confirm('找回密码邮件发送给客户后，请引导客户完成找回密码后续步骤, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetpass({email:email}).then((res)=>{
              if(res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '已发送！'
                });
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    //客户积分明细
    toPointsDetail (id) {
      this.$router.push({ path: 'pointsDetail', query: { id: id }})
    },
    //赠送优惠券
    // coupon(){
    //   this.couponVisible = true
    // }
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
  .searchcoupon{
    width: 360px;
    margin-bottom: 20px;
  }
</style>
