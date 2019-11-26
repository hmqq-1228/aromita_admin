<template>
  <div class="banner">
    <div class="header">
      <div>底部功能设置(每列最多添加9个)</div>
      <el-button type="primary" icon="el-icon-plus" @click="addNew()">新增</el-button>
    </div>
    <el-table
      :data="bannerList"
      border
      :cell-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="tool_title"
        label="功能标题"
        width="300">
      </el-table-column>
      <el-table-column
        prop="tool_href"
        label="链接地址">
      </el-table-column>
      <el-table-column
        prop="column"
        label="列数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="topStr"
        label="是否为主项"
        width="150">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="toBannerDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="primary" @click="bannerEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delItem(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="changePage">
        </el-pagination>
    </div>
    <el-drawer
      :title="bannerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose">
      <div class="draCont">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="ID" v-if="isEdit">
            <el-input readonly v-model="ruleForm.ID"></el-input>
          </el-form-item>
          <el-form-item label="功能标题" prop="name">
            <el-input placeholder="请输入功能标题" v-model="ruleForm.name">
              <template slot="prepend"><i class="el-icon-edit"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item label="功能链接" prop="imageUrl">
            <el-input placeholder="请输入功能链接" v-model="ruleForm.imageUrl">
              <template slot="prepend"><i class="el-icon-link"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item label="列数" prop="column">
            <el-select v-model="ruleForm.column" placeholder="请选择功能列数" style="width: 300px;">
              <el-option label="第一列" value="1"></el-option>
              <el-option label="第二列" value="2"></el-option>
              <el-option label="第三列" value="3"></el-option>
              <el-option label="第四列" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否为主项" prop="isMain">
            <el-switch v-model="ruleForm.isMain"></el-switch>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button type="primary" @click="submitForm('ruleForm')">{{bntStr}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-drawer
      title="功能设置详情"
      size="575px"
      :visible.sync="drawerDetail"
      direction="rtl"
      :before-close="handleClose2">
      <div class="draCont">
        <el-form label-width="100px">
          <el-form-item label="ID">
            <el-input readonly v-model="DetailId"></el-input>
          </el-form-item>
          <el-form-item label="功能标题">
            <el-input readonly v-model="DetailName"></el-input>
          </el-form-item>
          <el-form-item label="链接地址">
            <el-input readonly v-model="DetailPicUrl"></el-input>
          </el-form-item>
          <el-form-item label="列数">
            <el-input readonly v-model="DetailCol"></el-input>
          </el-form-item>
          <el-form-item label="是否为主项">
            <el-input readonly v-model="DetailIsMain"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input readonly v-model="DetailCreate"></el-input>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input readonly v-model="DetailEdit"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button @click="cancel()">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import {shereTools,addNewSetting} from '@/http/home.js'
  export default {
    data(){
      return{
        page:1,
        pageSize:15,
        total:0,
        isEdit: false,
        drawer: false,
        currentId: '',
        drawerDetail: false,
        dialogVisible: false,
        dialogImageUrl: '',
        bannerType:{
          type:'collections'
        },
        imageUrl: '',
        bntStr: '',
        DetailId: '3',
        DetailUrl: '',
        DetailName: '这是测试数据',
        DetailEdit: '2019-08-08',
        DetailPicUrl: 'www.baidu.com',
        DetailCol: 0,
        DetailIsMain: '',
        DetailCreate: '2019-10-10',
        bannerTitle: '',
        url: "https://arapi.panduo.com.cn/uploads/",
        ruleForm:{
          ID: '',
          name:'',
          imageUrl: '',
          column: '',
          isMain: false
        },
        rules:{
          name: [
            { required: true, message: '请输入图片名称', trigger: 'blur' },
            { min: 1, max: 50, message: '名称长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          imageUrl:[
            { required: true, message: '请填写功能链接', trigger: 'blur' },
            { type: 'url', required: true, message: '请填写正确的网址', trigger: 'blur' }
          ],
          column: [
            { required: true, message: '请选择功能列数', trigger: 'change' }
          ]
        },
        bannerList: []
      }
    },
    created () {
      this.shereToolsListFuc()
    },
    methods:{
      //分页
      changePage(val){
        this.page = val
        this.shereToolsListFuc()
      },
      tableRowClassName({row, rowIndex}) {
        // console.log('kk', row, rowIndex)
        if (row.is_top === 20) {
          return 'warning-row';
        }
        return '';
      },
      // 获取banner列表
      shereToolsListFuc () {
        shereTools({page:this.page}).then((res)=>{
          if (res.data.code === 200) {
            this.bannerList = res.data.data.data
            this.total = res.data.data.total
            for (var i=0;i<this.bannerList.length;i++){
              this.$set(this.bannerList[i],'topStr', '否')
              if (this.bannerList[i].is_top === 20) {
                this.bannerList[i].topStr = '是'
              }
            }
          }
        })
      },
      addNew () {
        this.drawer = true
        this.isEdit = false
        this.bntStr = '立即创建'
        this.bannerTitle = '添加功能设置'
      },
      addNewBanner () {
        var obj = {
          column: this.ruleForm.column,
          tool_href: this.ruleForm.imageUrl,
          is_top: this.ruleForm.isMain === true?20:10,
          tool_title: this.ruleForm.name
        }
        addNewSetting(obj).then((res)=>{
          if (res.data.code === 200) {
            this.drawer = false
            this.$message.success('新建成功！')
            this.shereToolsListFuc()
            this.$refs['ruleForm'].resetFields();
          }else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      bannerEdit (id) {
        var that = this
        this.currentId = id
        that.drawer = true
        that.isEdit = true
        that.bntStr = '确定修改'
        that.bannerTitle = '修改功能设置'
        that.$axios.get(`backend/home/tools/edit/${id}`,{}).then((res)=>{
          // console.log('eeeeee', res)
          if (res.data.code === 200) {
            that.ruleForm.ID = res.data.data.id
            that.ruleForm.name = res.data.data.tool_title
            that.ruleForm.imageUrl = res.data.data.tool_href
            that.ruleForm.column = res.data.data.column
            if (res.data.data.is_top === 20) {
              that.ruleForm.isMain = true
            } else {
              that.ruleForm.isMain = false
            }
          }
        })
      },
      handleClose(){
        this.drawer = false
        this.$refs['ruleForm'].resetFields();
      },
      handleClose2(){
        this.drawerDetail = false
      },
      // 删除
      delItem (id) {
        this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFuc(id)
        }).catch(() => {
          return false
        });
      },
      deleteFuc (id) {
        this.$axios.delete(`backend/home/tools/${id}`,{}).then((res)=>{
          if (res.data.code === 200) {
            this.shereToolsListFuc()
            this.$message.success('删除成功！')
          }
        })
      },
      // 详情
      toBannerDetail (id) {
        this.drawerDetail = true
        this.$axios.get(`backend/home/tools/${id}`,{}).then((res)=>{
          // console.log('kkkkk', res)
          if (res.data.code === 200) {
            this.DetailId = res.data.data.id
            this.DetailName = res.data.data.tool_title
            this.DetailCol = res.data.data.column
            if (res.data.data.is_top === 20){
              this.DetailIsMain = '是'
            } else {
              this.DetailIsMain = '否'
            }
            this.DetailPicUrl = res.data.data.tool_href
            this.DetailCreate = res.data.data.created_at
            this.DetailEdit = res.data.data.updated_at
          }
        })
        // this.$router.push('/bannerDetail')
      },
      cancel () {
        this.drawerDetail = false
      },
      submitForm(formName) {
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.bntStr === '确定修改') {
              that.subEditInfo()
            } else if (that.bntStr === '立即创建') {
              that.addNewBanner()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      subEditInfo () {
        var that = this
        var obj = {
          tool_title: that.ruleForm.name,
          tool_href: that.ruleForm.imageUrl,
          column: that.ruleForm.column,
          is_top: that.ruleForm.isMain === true? 20 : 10
        }
        this.$axios.put("backend/home/tools/" + that.currentId,obj).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            that.drawer = false
            that.shereToolsListFuc()
            that.$message.success('修改成功！')
            this.$refs['ruleForm'].resetFields();
          } else {
            that.$message.warning(res.data.msg)
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .tip{
    font-size: 14px;
    color: #666;
  }
  .tip.error{
    color: #C51015;
  }
  .header{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .draCont{
    padding: 0 40px;
  }
  .draCont .el-input{
    width: 300px !important;
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 300px;
    /*height: 178px;*/
    display: block;
  }
  .imgBox{
    width: 300px;
    display: block;
    border: 1px dashed #d9d9d9;
  }
  .imgBox img{
    width: 100%;
    height: 100%;
  }
  .el-form-item{
    margin-bottom: 24px !important;
  }
</style>
