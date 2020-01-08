<template>
<div class="attribute">
  <div class="heade">
    <h3>属性&属性值管理</h3>
    <el-input placeholder="请输入属性名称" v-model="attrName">
      <template slot="prepend">属性名称:</template>
      <el-button slot="append" icon="el-icon-search" @click="searchList()">查询</el-button>
    </el-input>
    <el-button type="primary" @click="addAttr()"><i class="el-icon-plus"></i>新增</el-button>
  </div>
  <div style="min-height: 500px">
    <el-table :data="List" border style="width: 100%" max-height="760">
      <el-table-column prop="attr_name" label="属性名"></el-table-column>
      <el-table-column label="属性状态" width="150">
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
          <el-table :data="scope.row.values_list" border max-height="200">
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
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="addAttrVal(scope.row)">属性值</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    v-if="dialogVisible"
    title="添加属性值"
    :visible.sync="dialogVisible"
    width="400px">
    <div class="addAttrBox">
      <el-form :model="form" :rules="rules" ref="form" >
        <el-form-item label="属性名" label-width="100px">
          <el-input v-model="form.name" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="属性值" label-width="100px" prop="value">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性状态" label-width="100px">
          <el-switch v-model="form.state"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="concelForm('form')">取 消</el-button>
    <el-button type="primary" @click="subFormData('form')">确 定</el-button>
  </span>
  </el-dialog>
  <div class="foot">
    <el-pagination
      background
      :page-size="15"
      @current-change="getPageNum($event)"
      layout="total, prev, pager, next, jumper"
      :total="totalNum">
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
      pageNum: 1,
      totalNum: 0,
      dialogVisible: false,
      attr_status_list:{
        0:"关闭",
        1:"开启"
      },
      form: {
        id: '',
        name: '',
        value: '',
        state: true
      },
      rules: {
        value: [
          {required: true, message: '请输入属性值', trigger: 'blur'},
        ]
      }
    }
  },
  created(){
    this.getProjectList()
  },
  methods: {
    // cellStyle: function ({row, column, rowIndex, columnIndex}) {
    //   if (columnIndex === 2 && row.attr_status === 1) {
    //     return 'stateStyle'
    //   } else if (columnIndex === 2 && row.attr_status === 0) {
    //     return 'stateStyle1'
    //   }
    // },
    addAttrVal (attr) {
      console.log('id', attr)
      this.dialogVisible = true
      this.form.id = attr.id
      this.form.name = attr.attr_name
    },
    subFormData (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
         var obj = qs.stringify({
           attr_id: that.form.id,
           attr_value: that.form.value,
           val_status: that.form.state === true ? 1 : 0
         })
          this.$axios.post("backend/product/attrVal",obj).then((res)=>{
            if(res.data.code === 200){
              this.$message({
                message: '属性值添加成功',
                type: 'success'
              });
              this.dialogVisible = false
              this.getProjectList()
            }
          })
        }
      })
    },
    concelForm (formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    getPageNum (e) {
      this.pageNum = e
      this.getProjectList()
    },
    //查询列表
    searchList(){
      this.pageNum = 1
      this.getProjectList()
    },
    //获取属性列表
    getProjectList(){
      var that = this
      let pre={
        attr_name:this.attrName,
        perPage: 15,
        page: that.pageNum
      }
      attrList(pre).then((res)=>{
        this.List = res.data.data.data
        that.totalNum = res.data.data.total
      })
    },
    //新增属性
    addAttr(){
      this.$router.push('/addAttr')
    },
    // 改变属性状态
    changeStatus(id,num){
      console.log('kkkkk', num)
      var that = this
      if (num === 0) {
        that.$confirm('关闭属性后，请及时对相关属性的类别进行设置！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$axios.put(`backend/product/attr/ajaxUpdateStatus/${id}`,qs.stringify({status:num})).then((res)=>{
            if(res.data.code == 200){
              that.getProjectList()
              that.$message({
                message: '状态修改成功',
                type: 'success'
              });
            }
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消更改'
          });
          that.getProjectList()
        });
      } else {
        that.$axios.put(`backend/product/attr/ajaxUpdateStatus/${id}`,qs.stringify({status:num})).then((res)=>{
          if(res.data.code == 200){
            that.getProjectList()
            that.$message({
              message: '状态修改成功',
              type: 'success'
            });
          }
        })
      }
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
.heade{
  display: flex;
  justify-content: space-between;
}
.foot{
  text-align: right;
  margin-top: 30px;
}
.addAttrBox .el-input{
  width: 240px!important;
}
</style>
