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
    v-if="centerDialogVisible"
    title="新建利润系数"
    :visible.sync="centerDialogVisible"
    width="400px">
    <div>
      <div class="item"><div class="name">上货价区间开始($):</div><el-input-number v-model="minPrice" controls-position="right" :min="0"></el-input-number> <i v-if="minPriceShow">*</i></div>
      <div class="item"><div class="name">上货价区间结束($):</div><el-input-number v-model="maxPrice" controls-position="right" :min="0"></el-input-number> <i v-if="maxPriceShow">*</i></div>
      <div class="item"><div class="name">利润系数:</div><el-input-number v-model="stepNum" controls-position="right" :min="0"></el-input-number> <i v-if="stepNumShow">*</i></div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="subCoefficient">确 定</el-button>
  </span>
  </el-dialog>
  <el-dialog
    v-if="editVisible"
    title="修改利润系数"
    :visible.sync="editVisible"
    width="400px">
    <div>
      <div class="item"><div class="name">上货价区间开始($):</div><el-input-number v-model="minPriceEdit" controls-position="right" :min="0" disabled></el-input-number> <i v-if="minPriceEditShow">*</i></div>
      <div class="item"><div class="name">上货价区间结束($):</div><el-input-number v-model="maxPriceEdit" controls-position="right" :min="0" disabled></el-input-number> <i v-if="maxPriceEditShow">*</i></div>
      <div class="item"><div class="name">利润系数:</div><el-input-number v-model="stepNumEdit" controls-position="right" :min="0"></el-input-number> <i v-if="stepNumEditShow">*</i></div>
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
      stepNumShow: false,
      minPriceEditShow: false,
      maxPriceEditShow: false,
      stepNumEditShow: false,
      minPriceShow: false,
      maxPriceShow: false,
      editVisible: false,
      centerDialogVisible: false
    }
  },
  watch:{
    minPrice:function (val,oV) {
      if (val>=0) {
        this.minPriceShow = false
      } else {
        this.minPriceShow = true
      }
    },
    maxPrice:function (val,oV) {
      if (val>=0) {
        this.maxPriceShow = false
      } else {
        this.maxPriceShow = true
      }
    },
    stepNum:function (val,oV) {
      if (val>=0) {
        this.stepNumShow = false
      } else {
        this.stepNumShow = true
      }
    },
    minPriceEdit:function (val,oV) {
      if (val>=0) {
        this.minPriceEditShow = false
      } else {
        this.minPriceEditShow = true
      }
    },
    maxPriceEdit:function (val,oV) {
      if (val>=0) {
        this.maxPriceEditShow = false
      } else {
        this.maxPriceEditShow = true
      }
    },
    stepNumEdit:function (val,oV) {
      if (val>=0) {
        this.stepNumEditShow = false
      } else {
        this.stepNumEditShow = true
      }
    },
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
      this.pageNum = e
      this.coefficientList()
    },
    // 列表
    coefficientList () {
      var obj = {
        perPage: 15,
        page: this.pageNum
      }
      coefficient(obj).then((res)=>{
        if(res.data.code == 200){
          this.tableData = res.data.data.data
          this.totalNum = res.data.data.total
        }
      })
    },
    // 删除
    handleDelete(id){
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete("backend/product/profitCoefficient/" + id, {}).then((res)=>{
            if(res.data.code === 200){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.coefficientList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 新增
    addNewCoeff(){
      this.centerDialogVisible = true
    },
    subCoefficient(){
      if(this.tableData.length == 0 && this.minPrice !=0){
        this.$message.warning('创建第一个区间的时候必须从0开始创建')
        this.minPrice = 0
        return false
      }
      if (this.maxPrice > 0 && this.stepNum > 0) {
        if (this.maxPrice <= this.minPrice) {
          this.$message.warning('区间结束值应大于开始值！')
        } else {
          if (this.stepNum > 0) {
            var obj = qs.stringify({
              price_min: this.minPrice,
              price_max: this.maxPrice,
              price_coefficient: this.stepNum
            })
            this.$axios.post("backend/product/profitCoefficient", obj).then((res)=>{
              if(res.data.code === 200){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.centerDialogVisible = false
                this.coefficientList()
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
          } else {
            this.$message.warning('利润系数应大于0！')
          }
        }
      } else {
        this.$message.warning('上货价区间结束值和利润系数应大于0')
      }
    },
    editeData(id, min, max, num){
      this.editVisible = true
      this.coeffId = id
      this.minPriceEdit = min
      this.maxPriceEdit = max
      this.stepNumEdit = num
    },
    editCoefficient(){
      if (this.maxPriceEdit > 0 && this.stepNumEdit > 0) {
        if (this.minPriceEdit >= this.maxPriceEdit) {
          this.$message.warning('区间结束值应大于开始值！')
        } else {
        if (this.stepNumEdit > 0) {
          var obj = qs.stringify({
            price_min: this.minPriceEdit,
            price_max: this.maxPriceEdit,
            price_coefficient: this.stepNumEdit
          })
          this.$axios.put("backend/product/profitCoefficient/" + this.coeffId, obj).then((res)=>{
            if(res.data.code === 200){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.editVisible = false
              this.coefficientList()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          this.$message.warning('利润系数应大于0！')
        }
      }
    } else {
        this.$message.warning('上货价区间结束值和利润系数应大于0')
      }
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
  .item i{
    color: #C51015;
  }
  .name{
    width: 135px;
    line-height: 32px;
    text-align: right;
    margin-right: 20px;
  }
</style>
