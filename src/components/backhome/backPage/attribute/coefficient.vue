<template>
<div class="coefficient">
  <div class="heade">
    <div style="width: 400px;">
      <el-input placeholder="请输入系数" v-model="coefficient">
        <template slot="prepend">系数:</template>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-button type="primary" @click="addNewCoeff()"><i class="el-icon-plus"></i> 新增</el-button>
  </div>
  <div class="content">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="price_min"
        label="上货价区间开始"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price_max"
        label="上货价区间结束"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price_coefficient"
        label="系数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间"
        width="180">
      </el-table-column>
      <el-table-column>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editeData(scope.row.id, scope.row.price_min, scope.row.price_max, scope.row.price_coefficient)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    title="新建利润系数"
    :visible.sync="centerDialogVisible"
    width="400px">
    <div>
      <div class="item"><div class="name">上货价区间开始($):</div><el-input-number v-model="minPrice" controls-position="right" :min="0"></el-input-number></div>
      <div class="item"><div class="name">上货价区间结束($):</div><el-input-number v-model="maxPrice" controls-position="right" :min="0"></el-input-number></div>
      <div class="item"><div class="name">利润系数:</div><el-input-number v-model="stepNum" controls-position="right" :min="0"></el-input-number></div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="subCoefficient">确 定</el-button>
  </span>
  </el-dialog>
  <el-dialog
    title="修改利润系数"
    :visible.sync="editVisible"
    width="400px">
    <div>
      <div class="item"><div class="name">上货价区间开始($):</div><el-input-number v-model="minPriceEdit" @change="minChange" controls-position="right" :min="0"></el-input-number></div>
      <div class="item"><div class="name">上货价区间结束($):</div><el-input-number v-model="maxPriceEdit" @change="maxChange" controls-position="right" :min="0"></el-input-number></div>
      <div class="item"><div class="name">利润系数:</div><el-input-number v-model="stepNumEdit" controls-position="right" :min="0"></el-input-number></div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCoefficient">修 改</el-button>
  </span>
  </el-dialog>
  <div class="foot">
    <el-pagination
      background
      :page-size="15"
      @current-change="currentPage($event)"
      layout="total, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</div>
</template>

<script>
import qs from 'qs'
import {coefficient} from "@/http/category.js"
export default {
  name: "coefficient",
  data() {
    return {
      coeffId: '',
      coefficient: '',
      tableData: [],
      totalNum: 0,
      minPrice: 0,
      maxPrice: 0,
      stepNum: 0,
      pageNum: 1,
      minPriceEdit: 0,
      maxPriceEdit: 0,
      stepNumEdit: 0,
      editVisible: false,
      centerDialogVisible: false
    }
  },
  watch:{
    minPrice: function (val, ov) {
      if (val > this.maxPrice) {
        this.maxPrice = val
      }
    },
    maxPrice: function (val, ov) {
      if (val < this.minPrice) {
        this.minPrice = val
      }
    },
    // minPriceEdit: function (val, ov) {
    //   if (val > this.maxPriceEdit) {
    //     this.maxPriceEdit = val
    //   }
    // },
    centerDialogVisible: function (val, ov) {
      if (!val) {
        this.minPrice = 0
        this.maxPrice = 0
        this.stepNum = 0
      }
    },
    editVisible: function (val, ov) {
      if (!val) {
        this.minPriceEdit = 0
        this.maxPriceEdit = 0
        this.stepNumEdit = 0
      }
    }
  },
  created () {
    this.coefficientList()
  },
  methods:{
    currentPage (e) {
      var that = this
      console.log('size', e)
      that.pageNum = e
      that.coefficientList()
    },
    // 列表
    coefficientList () {
      var that = this
      var obj = {
        perPage: 15,
        page: that.pageNum
      }
      coefficient(obj).then((res)=>{
        if(res.data.code === 200){
          that.tableData = res.data.data.data
          that.totalNum = res.data.data.total
        }
      })
      // that.$axios.get("backend/product/profitCoefficient", obj).then((res)=>{
      //   if(res.data.code === 200){
      //     that.tableData = res.data.data.data
      //     that.totalNum = res.data.data.total
      //   }
      // })
    },
    // 删除
    handleDelete(id){
      var that = this
      that.$axios.delete("backend/product/profitCoefficient/" + id, {}).then((res)=>{
        if(res.data.code === 200){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          that.coefficientList()
        }
      })
    },
    // 新增
    addNewCoeff(){
      var that = this
      that.centerDialogVisible = true
    },
    subCoefficient(){
      var that = this
      var obj = qs.stringify({
        price_min: that.minPrice,
        price_max: that.maxPrice,
        price_coefficient: that.stepNum
      })
      that.$axios.post("backend/product/profitCoefficient", obj).then((res)=>{
        if(res.data.code === 200){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          that.centerDialogVisible = false
          that.coefficientList()
        }
      })
    },
    editeData(id, min, max, num){
      var that = this
      console.log(min, max, num)
      that.editVisible = true
      that.coeffId = id
      that.minPriceEdit = min
      that.maxPriceEdit = max
      that.stepNumEdit = num
    },
    minChange(num){
      if (num > this.maxPriceEdit) {
        this.maxPriceEdit = num
      }
    },
    maxChange(num){
      if (num < this.minPriceEdit) {
        this.minPriceEdit = num
      }
    },
    editCoefficient(){
      var that = this
      var obj = qs.stringify({
        price_min: that.minPriceEdit,
        price_max: that.maxPriceEdit,
        price_coefficient: that.stepNumEdit
      })
      that.$axios.put("backend/product/profitCoefficient/" + that.coeffId, obj).then((res)=>{
        if(res.data.code === 200){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          that.editVisible = false
          that.coefficientList()
        }
      })
    }
  }
}
</script>

<style scoped>
.heade{
  display: flex;
  justify-content: space-between;
}
.foot{
  text-align: right;
  margin-top: 30px;
}
  .item{
    display: flex;
    justify-content: start;
    margin-bottom: 10px;
  }
  .name{
    width: 135px;
    line-height: 32px;
    text-align: right;
    margin-right: 20px;
  }
</style>
