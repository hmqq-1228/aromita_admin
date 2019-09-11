<template>
<div class="attribute">
  <div class="heade">
    <el-input placeholder="请输入属性名称" v-model="attrName">
      <template slot="prepend">属性名称:</template>
      <el-button slot="append" icon="el-icon-search" @click="searchList()"></el-button>
    </el-input>
    <el-button type="success" @click="addAttr()"><i class="el-icon-plus"></i>新增</el-button>
  </div>
  <div style="min-height: 500px">
    <el-table :data="List" border style="width: 100%" height="700">
      <el-table-column prop="attr_name" label="属性名"></el-table-column>
      <el-table-column label="属性状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.attr_status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row.id,scope.row.attr_status)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="属性值">
        <template slot-scope="scope">
          <el-table :data="scope.row.values" border max-height="240">
            <el-table-column prop="attr_value" label="属性值名称"></el-table-column>
            <el-table-column label="属性值状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.val_status"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changevalStatus(scope.row.id,scope.row.val_status)">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="updated_at" label="修改时间"></el-table-column>
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
import {attrList} from "@/http/attr.js"
import qs from 'qs'
export default {
  name: "attribute",
  data() {
    return {
      attrName: '',
      List: [],
      state: true,
      attr_status_list:{
        0:"关闭",
        1:"开启"
      }
    }
  },
  created(){
    this.getProjectList()
  },
  methods: {
    cellStyle: function ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 2 && row.attr_status === 1) {
        return 'stateStyle'
      } else if (columnIndex === 2 && row.attr_status === 0) {
        return 'stateStyle1'
      }
    },
    //查询列表
    searchList(){
      this.getProjectList()
    },
    //获取属性列表
    getProjectList(){
      let pre={
        attr_name:this.attrName
      }
      attrList(pre).then((res)=>{
        this.List = res.data.data.data
      })
    },
    //新增属性
    addAttr(){
      this.$router.push('/addAttr')
    },
    // 改变属性状态
    changeStatus(id,num){
      this.$axios.put(`backend/product/attr/ajaxUpdateStatus/${id}`,qs.stringify({status:num})).then((res)=>{
        if(res.data.code == 200){
          this.$message({
              message: '状态修改成功',
              type: 'success'
            });
        }
        this.getProjectList()
      })
    },
    // 改变属性值状态
    changevalStatus(id,num){
      this.$axios.put(`backend/product/attrVal/ajaxUpdateStatus/${id}`,qs.stringify({status:num})).then((res)=>{
        if(res.data.code == 200){
          this.$message({
              message: '状态修改成功',
              type: 'success'
            });
        }
        this.getProjectList()
      })
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 400px;
}
.foot{
  text-align: right;
  margin-top: 30px;
}
</style>
