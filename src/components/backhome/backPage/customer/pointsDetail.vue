<template>
  <div class="pointsDetail">
    <div class="heade">
        <h3>客户积分明细</h3>
        <router-link to="/customerList">
            <el-button type="info">返回客户列表</el-button>
        </router-link>
    </div>
    <div class="count">
      <el-table
        border
        :data="pointsTable"
        style="width: 100%">
        <el-table-column
          prop="score"
          label="积分点数">
        </el-table-column>
        <el-table-column
          prop="source"
          label="积分收支">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {scoreDetail} from '@/http/customer.js'
export default {
  name: "pointsDetail",
  data() {
    return {
      pointsTable: [],
      customerId:'',//客户ID
    }
  },
  created(){
    this.customerId = this.$route.query.id
    if(this.customerId){
      this.getList()
    }
  },
  methods:{
    getList(){
      scoreDetail({id:this.customerId}).then((res)=>{
          this.pointsTable = res.data.data
      }) 
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
