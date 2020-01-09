<template>
  <div class="banner">
    <div class="header">
      <div>版权信息设置(只能添加1个)</div>
      <el-button type="primary" icon="el-icon-plus" v-if="bannerList.length<1" @click="addNew()">新增</el-button>
    </div>
    <el-table
      :data="bannerList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="80">
      </el-table-column>
      <el-table-column
        prop="picture_title"
        label="版权信息">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="toBannerDetail(scope.row.id)">详情</el-button>
          <el-button size="mini" type="primary" @click="bannerEdit(scope.row.id)">编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="delItem(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
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
          <el-form-item label="版权信息" prop="name">
            <el-input placeholder="请输入版权信息" type="textarea" v-model="ruleForm.name" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 40px;">
            <el-button type="primary" @click="submitForm('ruleForm')">{{bntStr}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-drawer
      title="版权信息详情"
      size="575px"
      :visible.sync="drawerDetail"
      direction="rtl"
      :before-close="handleClose2">
      <div class="draCont">
        <el-form label-width="100px">
          <el-form-item label="ID">
            <el-input readonly v-model="DetailId"></el-input>
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input type="textarea" readonly v-model="DetailName" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="版权位置" prop="PicUrl">
            <el-input readonly v-model="DetailPosion"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="PicUrl">
            <el-input readonly v-model="DetailCreate"></el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="PicUrl">
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
  import {uploadUrl} from '@/http/commodity.js'
  import {getBannerList,addNewBanner} from '@/http/home.js'
  export default {
    data(){
      return{
        isEdit: false,
        drawer: false,
        currentId: '',
        drawerDetail: false,
        dialogVisible: false,
        dialogImageUrl: '',
        uploadUrl:uploadUrl,
        bannerType:{
          type:'collections_top'
        },
        imageUrl: '',
        bntStr: '',
        DetailId: '3',
        DetailUrl: '',
        DetailName: '这是测试数据',
        DetailEdit: '2019-08-08',
        DetailPicUrl: 'www.baidu.com',
        DetailPosion: 'Banner',
        DetailCreate: '2019-10-10',
        bannerTitle: '',
        url: "https://arapi.panduo.com.cn/uploads/",
        ruleForm:{
          ID: '',
          name:'',
          imageUrl: '',
          PicUrl: ''
        },
        rules:{
          name: [
            { required: true, message: '请输入版权信息', trigger: 'blur' },
            { min: 5, max: 100, message: '版权长度在 5 到 100 个字符', trigger: 'blur' }
          ]
        },
        bannerList: []
      }
    },
    created () {
      this.getBannerListFuc()
    },
    methods:{
      // 获取banner列表
      getBannerListFuc () {
        getBannerList ({position:80}).then((res)=>{
          if (res.data.code === 200) {
            this.bannerList = res.data.data.data
          }
        })
      },
      addNew () {
        this.drawer = true
        this.isEdit = false
        this.bntStr = '立即创建'
        this.bannerTitle = '新建版权信息'
      },
      addNewFuc () {
        var obj = {
          position: 80,
          picture_title: this.ruleForm.name,
          picture_src: '',
          picture_href: ''
        }
        addNewBanner (obj).then((res)=>{
          if (res.data.code === 200) {
            this.drawer = false
            this.$message.success('新建成功！')
            this.getBannerListFuc()
            this.$refs['ruleForm'].resetFields();
          } else {
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
        that.bannerTitle = '修改版权信息'
        that.$axios.get(`backend/home/edit/${id}`,{}).then((res)=>{
          console.log('eeeeee', res)
          if (res.data.code === 200) {
            that.ruleForm.ID = res.data.data.id
            that.ruleForm.name = res.data.data.picture_title
          }
        })
      },
      handleClose(){
        this.drawer = false
        // this.drawerDetail = false
        this.$refs['ruleForm'].resetFields();
      },
      handleClose2(){
        this.drawerDetail = false
      },
      // 删除
      // delItem (id) {
      //   this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.deleteFuc(id)
      //   }).catch(() => {
      //     return false
      //   });
      // },
      // deleteFuc (id) {
      //   this.$axios.delete(`backend/home/${id}`,{}).then((res)=>{
      //     if (res.data.code === 200) {
      //       this.getBannerListFuc()
      //       this.$message.success('删除成功！')
      //     }
      //   })
      // },
      // 详情
      toBannerDetail (id) {
        this.drawerDetail = true
        this.$axios.get(`backend/home/${id}`,{}).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            this.DetailId = res.data.data.id
            this.DetailName = res.data.data.picture_title
            if (res.data.data.position === 80) {
              this.DetailPosion = '底部版权信息'
            }
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
              that.addNewFuc()
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
          position: 80,
          picture_title: that.ruleForm.name,
          picture_src: '',
          picture_href: ''
        }
        // console.log('iiiiii', that.ruleForm.imageUrl.split(that.url)[1])
        this.$axios.put("backend/home/" + that.currentId,obj).then((res)=>{
          console.log('kkkkk', res)
          if (res.data.code === 200) {
            that.drawer = false
            that.getBannerListFuc()
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
    padding: 0 20px;
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
